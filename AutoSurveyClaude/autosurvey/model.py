"""Client vision multi-modèle : Nemotron (NVIDIA NIM) en principal, Claude en fallback.

Le prompt système (règles + profil) est constant pendant un sondage : il est
marqué cache_control pour être lu depuis le cache au lieu d'être refacturé
à chaque capture. La capture et la mémoire récente changent à chaque étape,
elles sont donc placées après, dans le message utilisateur.

La réponse est validée strictement : une action inconnue ou un champ manquant
est renvoyé au modèle, sans jamais exécuter une action à moitié formée.

Modèles :
- Nemotron (NVIDIA NIM) : modèle principal pour toutes les étapes normales.
- Claude (Anthropic) : fallback utilisé quand Nemotron échoue, ou quand une
  détection de boucle / question en tableau nécessite un modèle plus robuste.
"""

from __future__ import annotations

import base64
import io
import json
import logging
import re
import time
from collections import deque
from typing import Any

try:
    import httpx
except Exception:  # pragma: no cover - httpx est une dépendance d'openai
    httpx = None

try:
    from openai import (
        APIConnectionError,
        BadRequestError,
        InternalServerError,
        NotFoundError,
        OpenAI,
        RateLimitError,
    )
except Exception:  # pragma: no cover - openai peut ne pas être installé
    OpenAI = None
    APIConnectionError = Exception
    BadRequestError = Exception
    InternalServerError = Exception
    NotFoundError = Exception
    RateLimitError = Exception

try:
    import anthropic
except Exception:  # pragma: no cover - anthropic peut ne pas être installé
    anthropic = None

try:
    from PIL import Image, ImageDraw, ImageFont
except Exception:  # pragma: no cover - pillow peut ne pas être installé
    Image = None
    ImageDraw = None
    ImageFont = None

from . import config
from .screen import Frame

log = logging.getLogger("autosurvey")

MAX_CALLS = 3  # tentatives par étape avant bascule sur l'autre modèle
BACKOFF = [3, 6, 12, 20, 30]  # secondes entre tentatives après erreur API

# Limite : maximum 10 requêtes API par minute.
RATE_LIMIT_MAX_CALLS = 10
RATE_LIMIT_PERIOD = 60.0  # secondes


class RateLimiter:
    """Limite le nombre d'appels API sur une fenêtre glissante."""

    def __init__(self, max_calls: int = RATE_LIMIT_MAX_CALLS, period: float = RATE_LIMIT_PERIOD) -> None:
        self.max_calls = max_calls
        self.period = period
        self._timestamps: deque[float] = deque()

    def wait(self) -> None:
        """Bloque si la fenêtre glissante est déjà pleine."""
        now = time.monotonic()
        while self._timestamps and self._timestamps[0] <= now - self.period:
            self._timestamps.popleft()

        if len(self._timestamps) >= self.max_calls:
            sleep_for = self._timestamps[0] + self.period - now
            if sleep_for > 0:
                log.info("rate limit : %d appels/min atteint, attente %.1fs", self.max_calls, sleep_for)
                time.sleep(sleep_for)
                now = time.monotonic()
                while self._timestamps and self._timestamps[0] <= now - self.period:
                    self._timestamps.popleft()

        self._timestamps.append(time.monotonic())


# Champs obligatoires par action.
REQUIRED: dict[str, tuple[str, ...]] = {
    "click": ("x", "y"),
    "double_click": ("x", "y"),
    "right_click": ("x", "y"),
    "scroll": ("x", "y"),
    "drag": ("x", "y", "x2", "y2"),
    "type": ("text",),
    "press": ("key",),
    "hotkey": ("keys",),
    "wait": (),
    "done": (),
}


class ModelError(Exception):
    """Aucune réponse valide du modèle après toutes les tentatives."""


class InvalidAction(Exception):
    """Réponse du modèle non exploitable : elle est redemandée."""


def _as_int(value: Any, key: str) -> int:
    try:
        return int(round(float(value)))
    except (TypeError, ValueError) as exc:
        raise InvalidAction(f"{key} non numérique: {value!r}") from exc


def _validate_one_action(data: dict[str, Any]) -> dict[str, Any]:
    """Valide un seul objet d'action et le normalise."""
    kind = data.get("action")
    if kind not in REQUIRED:
        raise InvalidAction(f"action inconnue: {kind!r}")
    missing = [k for k in REQUIRED[kind] if data.get(k) in (None, "")]
    if missing:
        raise InvalidAction(f"{kind}: champs manquants {missing}")

    for key in ("x", "y", "x2", "y2"):
        if key in data:
            data[key] = _as_int(data[key], key)
    if kind == "wait":
        data["seconds"] = min(max(float(data.get("seconds", 2)), 0.5), 10.0)
    if kind == "hotkey" and not isinstance(data["keys"], list):
        raise InvalidAction("hotkey: keys doit être une liste")
    if kind == "done" and data.get("status") not in {"finished", "blocked", "stuck"}:
        data["status"] = "stuck"

    data.setdefault("question", "")
    data.setdefault("answer", "")
    data.setdefault("reason", "")
    data.setdefault("disposition", "")
    return data


def parse_action(text: str) -> list[dict[str, Any]]:
    """Extrait et valide une ou plusieurs actions JSON contenues dans la réponse du modèle.

    Le modèle peut répondre avec :
    - un seul objet JSON : {"action": "click", ...}
    - un tableau d'objets JSON : [{"action": "click", ...}, {"action": "click", ...}]

    Retourne toujours une liste (même d'un seul élément).
    """
    cleaned = text.strip()
    cleaned = re.sub(r"^```json\s*", "", cleaned)
    cleaned = re.sub(r"```\s*$", "", cleaned)

    data: Any = None

    # Cas tableau JSON : [...]
    first_bracket = cleaned.find("[")
    if first_bracket >= 0:
        last_bracket = cleaned.rfind("]")
        if last_bracket > first_bracket:
            fragment = cleaned[first_bracket : last_bracket + 1]
            try:
                data = json.loads(fragment)
            except json.JSONDecodeError:
                data = None

    # Cas objet JSON unique : {...}
    if data is None:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group(0))
            except json.JSONDecodeError:
                data = None

    if data is None:
        raise InvalidAction("aucun objet JSON dans la réponse")

    if isinstance(data, dict):
        return [_validate_one_action(data)]

    if isinstance(data, list):
        if not data:
            raise InvalidAction("tableau d'actions vide")
        return [_validate_one_action(item) for item in data if isinstance(item, dict)]

    raise InvalidAction("la réponse n'est pas un objet JSON ni un tableau d'actions")


def system_prompt(width: int, height: int, profile_text: str) -> str:
    """Prompt système complet. Constant pendant un sondage : c'est lui qui est mis en cache."""
    return f"""Tu pilotes un ordinateur Windows pour remplir un sondage en ligne.
Tu reçois une capture d'écran ({width}x{height}). Tu choisis une ou plusieurs actions à exécuter.

=== FORMAT DE SORTIE ===

Réponds UNIQUEMENT par un objet JSON ou un tableau JSON d'objets. Actions possibles :
- {{"action":"click","x":int,"y":int}}   clic (radio, case, bouton, champ, option)
- {{"action":"double_click","x":int,"y":int}}
- {{"action":"right_click","x":int,"y":int}}
- {{"action":"type","text":"...","clear":false}}   tape dans le champ DÉJÀ cliqué ; clear=true vide le champ avant
- {{"action":"press","key":"enter|tab|esc|pagedown|pageup|backspace|space|up|down"}}
- {{"action":"hotkey","keys":["ctrl","a"]}}
- {{"action":"scroll","x":int,"y":int,"direction":"down|up","amount":5}}
- {{"action":"drag","x":int,"y":int,"x2":int,"y2":int}}
- {{"action":"wait","seconds":2}}   page en chargement, écran vide, ou rien à faire
- {{"action":"done","status":"finished|blocked|stuck","reason":"..."}}

Chaque réponse contient aussi "question" (texte de la question traitée, "" sinon),
"answer" (réponse choisie ou saisie, "" sinon) et "reason" (une phrase).

=== MULTI-ACTIONS (plusieurs actions d'un coup) ===

Quand une question demande plusieurs réponses (ex: cocher plusieurs cases dans une grille,
sélectionner plusieurs options, cliquer sur plusieurs boutons), tu peux renvoyer un
TABLEAU JSON contenant un objet par action, dans l'ordre d'exécution :

[{{"action":"click","x":300,"y":400,"question":"Cochez les affirmations vraies","reason":"Première affirmation vraie","answer":"oui"}},
 {{"action":"click","x":300,"y":480,"question":"Cochez les affirmations vraies","reason":"Deuxième affirmation vraie","answer":"oui"}},
 {{"action":"press","key":"enter","question":"","reason":"Valider et passer à la suivante","answer":""}}]

Règles pour le multi-actions :
- Pour une question classique à choix unique : UN seul objet (pas de tableau).
- Pour une grille de cases à cocher ou plusieurs options : un tableau avec un objet par case/option.
- Chaque objet du tableau doit avoir ses propres coordonnées x et y.
- Chaque objet du tableau doit avoir son propre champ "question", "answer" et "reason".
- Le système exécutera chaque objet l'un après l'autre, automatiquement.
- Ne mélange pas un objet seul et un tableau : c'est soit un objet, soit un tableau.

=== DÉFILEMENT (SCROLL) ===

Quand tu fais défiler, utilise UN GRAND défilement pour révéler une bonne partie de l'écran d'un coup.
- L'amount doit être élevé (proche du maximum autorisé) pour faire défiler au moins la moitié de la hauteur de l'écran.
- Ne fais pas de petits défilements : un seul grand scroll suffit généralement pour faire apparaître la suite du questionnaire ou le bouton Suivant.
- Positionne le scroll sur le bord gauche (x=50) pour ne pas toucher le contenu du questionnaire.

=== PATTERN OPTIMAL POUR TERMINER UNE QUESTION ===

Quand tu as répondu à toutes les options d'une question et que le bouton "Suivant" est visible, le plus efficace est d'envoyer un TABLEAU JSON multi-actions contenant :
1. Les clics sur les options de réponse (si pas déjà faits)
2. Un dernier clic sur le bouton "Suivant" pour valider et passer à la question suivante

Exemple optimal pour une question terminée :
[{{"action":"click","x":300,"y":400,"question":"Quelle est votre âge ?","reason":"Répondre à la question","answer":"30-40 ans"}},
 {{"action":"click","x":500,"y":860,"question":"Quelle est votre âge ?","reason":"Cliquer sur Suivant pour passer à la question suivante","answer":""}}]

Règles :
- Toujours répondre à la question AVANT de cliquer sur Suivant.
- Le clic sur "Suivant" est le dernier objet du tableau.
- Si "Suivant" n'est pas encore visible, ne le clique pas : fais d'abord un grand défilement pour le révéler, puis clique.

=== NAVIGATION ===

1. Coordonnées dans le repère de l'image ({width}x{height}), origine en haut à gauche. Vise le centre de l'élément.
2. Traite les questions une par une, de haut en bas. Ne passe à la suite que si toutes les questions visibles ont une réponse.
3. Avant de cliquer une case ou une option, vérifie son état : un clic sur une case déjà cochée la décoche. Tu as le droit de changer d'avis : si tu as déjà sélectionné une option mais qu'une meilleure réponse apparaît après avoir défilé, clique d'abord sur l'ancienne option pour la décocher, puis sélectionne la nouvelle. Ne laisse jamais une réponse obsolète sélectionnée quand tu as trouvé mieux.
4. Liste déroulante : clique pour l'ouvrir, puis clique l'option. Si le champ est à saisir, clique-le puis tape.
5. Curseur ou échelle : clique le point de l'échelle qui correspond à la réponse choisie. Date : tape-la selon le format affiché dans le champ.
6. Champ de texte : clique-le d'abord, puis utilise "type".
7. Si un bouton Suivant / Next / Valider / Envoyer est visible et que toutes les questions visibles sont répondues, clique-le. Sinon fais défiler vers le bas.
8. Bandeau cookies ou pop-up : ferme-le, ou accepte/refuse-le.
9. Tu ne vois que l'écran. D'autres fenêtres peuvent être ouvertes : ne clique que dans le sondage.
10. Écran noir, vide ou en chargement : wait. Message de fin, remerciement ou soumission réussie : done "finished". Connexion, paiement, captcha ou sondage hors de portée : done "blocked" avec la raison.
11. Erreur de connexion (page qui ne charge plus, "connexion perdue", "impossible de se connecter", erreur réseau) : clique sur le bouton d'actualisation / rechargement de la page (l'icône de flèche circulaire dans la barre d'adresse du navigateur) pour recharger la page, puis réessaye.
12. Si rien ne change après plusieurs actions, essaie une autre action. done "stuck" seulement en dernier recours.

=== RÉPONSES ===

12. Réponds dans la langue du sondage, jamais dans une autre.
13. Si le profil répond à la question, utilise-le tel quel.
14. Fait réel absent du profil (situation, habitudes, statut, etc.) : donne une réponse plausible selon les statistiques réelles de la population ciblée (par exemple la répartition réelle en France). Ne contredis jamais le profil et reste cohérent d'une question à l'autre.
15. Goûts et préférences (couleur, film, marque, opinion) : invente librement une réponse plausible, en restant cohérent avec le profil s'il en contient.
16. Identifiants et données sensibles (numéro de sécurité sociale, IBAN, pièce d'identité, mot de passe, coordonnées bancaires) : n'invente jamais. done "blocked" avec la raison.
17. Ne réponds jamais une seconde fois à une question listée dans "QUESTIONS DÉJÀ RÉPONDUES", SAUF si elle apparaît sur l'écran actuel avec un champ vide ou un message d'erreur (ex: "Bitte geben Sie eine Antwort"). Dans ce cas, clique sur le champ et corrige la réponse, puis clique sur Suivant. L'image actuelle prime sur la liste des questions déjà répondues.

=== PROFIL ===

{profile_text}

Les informations enregistrées dans le profil doivent toujours être en français, quelle que soit la langue du sondage ou de la personne. Traduisez-les si nécessaire.

=== QUESTIONS EN TABLEAU / DISPOSITION SPÉCIALE ===

Quand une question demande plusieurs réponses d'un coup (grille de cases à cocher, plusieurs options, sélection multiple), utilise le FORMAT TABLEAU JSON multi-actions avec un objet par case/option à cocher. Chaque objet doit avoir ses propres coordonnées x, y et ses propres champs "question", "answer", "reason". Ne sélectionne qu'une seule option par objet.

Chaque réponse doit aussi inclure un champ "disposition" :
- "disposition": "tableau" quand la question est une grille / sélection multiple / plusieurs cases à cocher
- "disposition": "menu_deroulant" quand la question est un menu déroulant / liste déroulante
- "disposition": "" (vide) pour une question classique à réponse unique

Si Nemotron ne peut pas traiter ce type de question, laisse Claude prendre le relais (il est plus robuste pour les grilles et multi-actions).

=== VARIATION DES RÉPONSES ===

Ne sois pas trop neutre et ne réponds pas trop souvent "je ne sais pas". Quand une question appelle un avis, une préférence ou un choix, donne une réponse claire et plausible, même si tu dois la varier d'une fois à l'autre. Reste cohérent avec le profil mais n'hésite pas à varier les réponses quand il est nécessaire de choisir une option parmi plusieurs. Ne laisse jamais une question sans réponse quand une sélection est requise.
"""


# ---------------------------------------------------------------------------
# Overlay de coordonnées pour aider Nemotron à se repérer
# ---------------------------------------------------------------------------


def _overlay_coords(image: Image.Image) -> Image.Image:
    """Dessine des repères de coordonnées normalisés 0-1000 sur les bords de l'image.

    Ajoute les valeurs des axes X (en haut) et Y (à gauche) directement sur
    l'image afin que Nemotron puisse visualiser les limites réelles de l'écran
    en utilisant l'échelle normalisée 0-1000 (0 = bord gauche/haut, 1000 = bord droit/bas).
    Cela évite que le modèle ne réponde avec des coordonnées pixel absolues
    qui seraient fausses si la résolution d'écran change.
    """
    draw = ImageDraw.Draw(image)
    width, height = image.size

    try:
        font = ImageFont.load_default(size=14)
    except TypeError:
        font = ImageFont.load_default()

    # Barre supérieure : repères X en 0-1000 (tous les 50 unités = 21 repères max)
    for i in range(21):
        norm_x = i * 50  # 0, 50, 100, ..., 1000
        x = int(norm_x * width / 1000)
        label = str(norm_x)
        bbox = draw.textbbox((0, 0), label, font=font)
        tw = bbox[2] - bbox[0]
        draw.line((x, 0, x, 4), fill=(255, 0, 0))
        draw.text((max(x - tw // 2, 0), 6), label, fill=(255, 0, 0), font=font)

    # Barre gauche : repères Y en 0-1000
    for i in range(21):
        norm_y = i * 50
        y = int(norm_y * height / 1000)
        label = str(norm_y)
        bbox = draw.textbbox((0, 0), label, font=font)
        th = bbox[3] - bbox[1]
        draw.line((0, y, 4, y), fill=(255, 0, 0))
        draw.text((6, max(y - th // 2, 0)), label, fill=(255, 0, 0), font=font)

    # Échelle affichée en coin supérieur droit
    size_label = "0-1000"
    bbox = draw.textbbox((0, 0), size_label, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.rectangle([width - tw - 8, 6, width - 2, 6 + th + 4], fill=(255, 0, 0))
    draw.text((width - tw - 6, 8), size_label, fill=(0, 0, 0), font=font)

    return image


# ---------------------------------------------------------------------------
# Clients de modèle
# ---------------------------------------------------------------------------


class _NemotronClient:
    """Client NVIDIA NIM pour Nemotron (OpenAI-compatible).

    Nemotron n'a PAS de mode "thinking" (chaîne de pensée) comme Claude.
    Il répond directement en JSON sans réflexion intermédiaire.
    """

    def __init__(self) -> None:
        api_keys_raw = config.NIM_API_KEY
        self.api_keys = [k.strip() for k in api_keys_raw.split(",") if k.strip()] if api_keys_raw else []
        self.key_index = 0
        self.api_key = self.api_keys[self.key_index] if self.api_keys else None
        self.base_url = config.NIM_BASE_URL
        self.model = config.NIM_MODEL
        self.proxy = config.NIM_PROXY or None

        http_client = None
        if httpx is not None:
            http_client = httpx.Client(
                proxy=self.proxy,
                timeout=httpx.Timeout(120.0, connect=15.0, read=120.0),
            )

        self._client = OpenAI(
            base_url=self.base_url,
            api_key=self.api_key,
            http_client=http_client,
        )

    def _rotate_key(self) -> None:
        if len(self.api_keys) > 1:
            self.key_index = (self.key_index + 1) % len(self.api_keys)
            self.api_key = self.api_keys[self.key_index]
            self._client = OpenAI(
                base_url=self.base_url,
                api_key=self.api_key,
            )
            log.info("rotation de clé NIM -> clé #%d", self.key_index + 1)

    def decide(self, png_bytes: bytes, system: str, user_text: str) -> str:
        """Envoie une capture à Nemotron et renvoie le texte brut de la réponse."""
        if Image is None:
            raise RuntimeError("Pillow n'est pas installé, impossible d'encoder l'image pour Nemotron")
        image = Image.open(io.BytesIO(png_bytes)).convert("RGB")
        # Ajout des repères de coordonnées pour aider Nemotron à se repérer sur l'écran.
        image = _overlay_coords(image)
        buf = io.BytesIO()
        image.save(buf, format="PNG")
        b64 = base64.b64encode(buf.getvalue()).decode("ascii")
        data_url = f"data:image/png;base64,{b64}"

        messages = [
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": user_text},
                    {"type": "image_url", "image_url": {"url": data_url}},
                ],
            },
        ]

        delay_index = 0
        while True:
            try:
                resp = self._client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.6,
                    max_tokens=config.NIM_MAX_TOKENS,
                )
                content = resp.choices[0].message.content or ""
                return content
            except RateLimitError as exc:
                log.warning("Nemotron saturé (503/RateLimit): %s", exc)
                self._rotate_key()
                delay = BACKOFF[delay_index % len(BACKOFF)]
                delay_index += 1
                log.info("rotation vers clé suivante, attente %ds", delay)
                time.sleep(delay)
                continue
            except InternalServerError as exc:
                log.warning("erreur serveur interne Nemotron: %s", exc)
                self._rotate_key()
                delay = BACKOFF[delay_index % len(BACKOFF)]
                delay_index += 1
                log.info("attente %ds avant retry", delay)
                time.sleep(delay)
                continue
            except NotFoundError as exc:
                log.warning("modèle Nemotron non trouvé (404): %s", exc)
                self._rotate_key()
                delay = BACKOFF[delay_index % len(BACKOFF)]
                delay_index += 1
                log.info("attente %ds avant retry", delay)
                time.sleep(delay)
                continue
            except BadRequestError as exc:
                log.error("requête rejetée (400) par Nemotron: %s", exc)
                raise
            except APIConnectionError as exc:
                log.warning("erreur de connexion Nemotron (retry): %s", exc)
                delay = BACKOFF[delay_index % len(BACKOFF)]
                delay_index += 1
                log.info("attente %ds avant retry de connexion", delay)
                time.sleep(delay)
                continue


class _ClaudeClient:
    """Client Anthropic Claude : fallback pour boucles et questions en tableau."""

    def __init__(self) -> None:
        if anthropic is None:
            raise RuntimeError("anthropic n'est pas installé")
        if not config.ANTHROPIC_API_KEY:
            raise RuntimeError("Clé Anthropic manquante : ajoute ANTHROPIC_API_KEY dans .env")
        extra_headers: dict[str, str] = {}
        if config.ANTHROPIC_WORKSPACE_ID:
            extra_headers["anthropic-workspace-id"] = config.ANTHROPIC_WORKSPACE_ID
        self._client = anthropic.Anthropic(
            api_key=config.ANTHROPIC_API_KEY,
            max_retries=0,
            default_headers=extra_headers,
        )
        self._models = [config.CLAUDE_MODEL, *(m for m in config.CLAUDE_FALLBACK_MODELS if m != config.CLAUDE_MODEL)]

    def close(self) -> None:
        self._client.close()

    def decide(self, frame: Frame, system: str, user_text: str) -> str:
        """Envoie une capture à Claude et renvoie le texte brut de la réponse."""
        system_blocks = [{"type": "text", "text": system, "cache_control": {"type": "ephemeral"}}]
        messages: list[dict[str, Any]] = [
            {
                "role": "user",
                "content": [
                    {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": frame.b64}},
                    {"type": "text", "text": user_text},
                ],
            }
        ]
        last_error: Exception | None = None

        for attempt in range(MAX_CALLS):
            model = self._models[attempt % len(self._models)]
            try:
                resp = self._client.messages.create(
                    model=model,
                    max_tokens=config.CLAUDE_MAX_TOKENS,
                    system=system_blocks,
                    messages=messages,
                )
                text = "".join(b.text for b in resp.content if getattr(b, "type", "") == "text")
                return text
            except anthropic.RateLimitError as exc:
                last_error = exc
                self._wait(attempt, model, "limite de débit atteinte")
            except anthropic.APIError as exc:
                last_error = exc
                self._wait(attempt, model, f"erreur API: {exc}")

        raise ModelError(f"aucune réponse valide de Claude après {MAX_CALLS} tentatives: {last_error}")

    @staticmethod
    def _wait(attempt: int, model: str, reason: str) -> None:
        delay = BACKOFF[min(attempt, len(BACKOFF) - 1)]
        log.warning("%s (%s), nouvel essai dans %ds", reason, model, delay)
        time.sleep(delay)


# ---------------------------------------------------------------------------
# VisionModel : orchestration Nemotron principal + Claude fallback
# ---------------------------------------------------------------------------


class VisionModel:
    """Orchestre Nemotron (principal) et Claude (fallback).

    - Nemotron est utilisé pour toutes les étapes normales.
    - Claude prend le relais quand :
      * une boucle est détectée (même action répétée),
      * une question en tableau (multi-actions) est détectée,
      * Nemotron échoue après plusieurs tentatives.
    """

    def __init__(self) -> None:
        # Nemotron : optionnel, ne bloque pas l'initialisation si non configuré.
        self._nemotron: _NemotronClient | None = None
        if config.NIM_API_KEY and OpenAI is not None and Image is not None:
            try:
                self._nemotron = _NemotronClient()
                log.info("Nemotron initialisé comme modèle principal")
            except Exception as exc:  # pragma: no cover - dépend de l'environnement
                log.warning("Nemotron non initialisé: %s", exc)
                self._nemotron = None

        # Claude : fallback.
        self._claude: _ClaudeClient | None = None
        if anthropic is not None and config.ANTHROPIC_API_KEY:
            try:
                self._claude = _ClaudeClient()
                log.info("Claude initialisé comme fallback")
            except Exception as exc:  # pragma: no cover - dépend de l'environnement
                log.warning("Claude non initialisé: %s", exc)
                self._claude = None

        if self._nemotron is None and self._claude is None:
            raise RuntimeError("Aucun modèle disponible : configurez NIM_API_KEY (Nemotron) et/ou ANTHROPIC_API_KEY (Claude)")

        self._rate_limiter = RateLimiter()
        self._consecutive_stuck = 0  # compteur de détection de boucle
        self._claude_remaining = 0  # nombre de requêtes restantes sur Claude avant retour à Nemotron
        self._last_model_used: str | None = None  # "nemotron" ou "claude"

    @property
    def last_model_used(self) -> str | None:
        """Renvoie le modèle utilisé pour la dernière décision."""
        return self._last_model_used

    def _activate_claude_temporary(self, count: int = 6) -> None:
        """Active Claude pour les N prochaines requêtes, puis revient à Nemotron."""
        self._claude_remaining = count
        log.info("basculement temporaire sur Claude pour %d requêtes", count)

    def close(self) -> None:
        if self._claude is not None:
            self._claude.close()

    def _should_use_claude(self, user_text: str) -> bool:
        """Détermine si Claude doit être utilisé pour cette étape.

        Claude est utilisé si :
        - Nemotron n'est pas disponible,
        - le basculement temporaire sur Claude est actif (_claude_remaining > 0),
        - le modèle précédent a détecté une boucle (compteur > 0),
        - la mémoire contient des indices de tableau / multi-actions,
        - ou si USE_NEMOTRON_PRIMARY est désactivé.
        """
        # Si Nemotron n'est pas disponible, on est obligé d'utiliser Claude.
        if self._nemotron is None:
            return True
        if not config.USE_NEMOTRON_PRIMARY:
            return True
        # Basculement temporaire actif (ex: après détection de boucle ou question tableau).
        if self._claude_remaining > 0:
            return True
        if self._consecutive_stuck > 0:
            return True
        # Détecte si l'historique ou la question actuelle mentionne un tableau,
        # une grille, plusieurs cases à cocher, ou une disposition spéciale.
        upper = user_text.upper()
        tableau_keywords = [
            "TABLEAU", "MULTI-ACTIONS", "GRILLE", "COCHER PLUSIEURS",
            "PLUSIEURS CASES", "PLUSIEURS OPTIONS", "QUELLES", "QUELS",
            "WELCHE", "WELCHEN", "MEHRERE", "AUSWÄHLEN", "ANZUKREUZEN",
            "CASES À COCHER", "CASES A COCHER", "OPTIONS MULTIPLES",
            "CHOIX MULTIPLE", "SELECTIONNER PLUSIEURS", "QUELLES OPTIONS",
        ]
        if any(k in upper for k in tableau_keywords):
            return True
        return False

    def _record_stuck(self, is_stuck: bool) -> None:
        if is_stuck:
            self._consecutive_stuck += 1
            # Active le basculement temporaire sur Claude pour les 6 prochaines requêtes.
            if self._claude is not None:
                self._activate_claude_temporary(6)
        else:
            self._consecutive_stuck = 0

    def _is_tableau_response(self, actions: list[dict[str, Any]]) -> bool:
        """Détecte si une action semble indiquer une question en tableau / multi-actions
        non résolue par Nemotron (ex: plusieurs cibles, question au pluriel, etc.)."""
        for action in actions:
            question = str(action.get("question", ""))
            answer = str(action.get("answer", ""))
            upper_q = question.upper()
            # Mots-clés indiquant une sélection multiple / tableau.
            if any(k in upper_q for k in ("QUELLES", "QUELS", "WELCHE", "WELCHEN", "MEHRERE")):
                return True
            # Plusieurs actions de clic distinctes sur la même question = grille/tableau.
            if action.get("action") == "click" and question:
                return True
        return False

    def _run_claude_for(self, frame: Frame, system: str, user_text: str, count: int) -> list[dict[str, Any]]:
        """Exécute `count` requêtes Claude et renvoie les actions du dernier appel."""
        if self._claude is None:
            raise ModelError("Claude n'est pas disponible")
        self._activate_claude_temporary(count)
        text = self._claude.decide(frame, system, user_text)
        self._last_model_used = "claude"
        if self._claude_remaining > 0:
            self._claude_remaining -= 1
        actions = parse_action(text)
        for action in actions:
            if action.get("action") == "done" and action.get("status") == "stuck":
                self._record_stuck(True)
                break
        else:
            self._record_stuck(False)
        return actions

    def _has_disposition(self, actions: list[dict[str, Any]]) -> str | None:
        """Renvoie la valeur de 'disposition' si une action la contient,
        sinon None."""
        for action in actions:
            disp = str(action.get("disposition", "")).strip().lower()
            if disp in ("tableau", "menu_deroulant"):
                return disp
        return None

    def decide(self, frame: Frame, system: str, user_text: str) -> list[dict[str, Any]]:
        """Envoie d'abord la capture à Nemotron, puis bascule sur Claude si besoin.

        Nemotron est toujours sollicité en premier. Le modèle Nemotron n'a aucune
        connaissance de Claude : c'est le code qui décide.

        Claude prend le relais uniquement si :
        - une action de Nemotron contient le champ "disposition": "tableau" ou
          "disposition": "menu_deroulant" (champ retourné par le modèle dans sa réponse JSON),
        - Nemotron répond 'done' avec status 'stuck' (bloqué),
        - le parsage de la réponse Nemotron échoue après toutes les tentatives.

        Quand le bascule a lieu, Claude est sollicité pour
        CLAUDE_TABLEAU_REQUESTS requêtes.
        """
        if self._nemotron is None and self._claude is None:
            raise ModelError("Aucun modèle disponible pour prendre une décision")

        # Pas de Nemotron : on utilise directement Claude.
        if self._nemotron is None:
            self._rate_limiter.wait()
            text = self._claude.decide(frame, system, user_text)
            self._last_model_used = "claude"
            actions = parse_action(text)
            for action in actions:
                if action.get("action") == "done" and action.get("status") == "stuck":
                    self._record_stuck(True)
                    break
            else:
                self._record_stuck(False)
            return actions

        # Respecte la limite de 10 requêtes par minute.
        self._rate_limiter.wait()

        # Décrémenter le compteur de basculement temporaire (pour les boucles précédentes).
        if self._claude_remaining > 0:
            self._claude_remaining -= 1

        last_error: Exception | None = None
        nemotron_actions: list[dict[str, Any]] | None = None

        for attempt in range(MAX_CALLS):
            # Nemotron reçoit l'image brute (png_bytes) + system + user_text.
            png_bytes = base64.b64decode(frame.b64)
            text = self._nemotron.decide(png_bytes, system, user_text)

            # Parsage et validation de la réponse.
            try:
                actions = parse_action(text)
            except InvalidAction as exc:
                last_error = exc
                log.warning("réponse invalide de Nemotron (tentative %d/%d): %s", attempt + 1, MAX_CALLS, exc)
                if attempt < MAX_CALLS - 1:
                    continue  # Retente avec Nemotron
                # Dernier échec : bascule sur Claude une fois.
                if self._claude is not None:
                    log.warning("bascule sur Claude après échec de parsage Nemotron")
                    return self._run_claude_for(frame, system, user_text, 1)
                raise ModelError(f"aucune réponse valide de Nemotron: {last_error}")

            # Parsage réussi : on garde les actions et on sort de la boucle de retry.
            nemotron_actions = actions
            self._last_model_used = "nemotron"
            break

        if nemotron_actions is None:
            raise ModelError(f"aucune réponse valide de Nemotron: {last_error}")

        # Si une action de Nemotron contient disposition=tableau ou menu_deroulant,
        # bascule sur Claude pour CLAUDE_TABLEAU_REQUESTS requêtes.
        disposition = self._has_disposition(nemotron_actions)
        if disposition in ("tableau", "menu_deroulant"):
            if self._claude is not None:
                log.warning("disposition %s detectee dans la reponse Nemotron, bascule sur Claude pour %d requetes",
                            disposition, config.CLAUDE_TABLEAU_REQUESTS)
                return self._run_claude_for(frame, system, user_text, config.CLAUDE_TABLEAU_REQUESTS)

        # Si Nemotron signale 'stuck', bascule sur Claude pour tenter de débloquer.
        for action in nemotron_actions:
            if action.get("action") == "done" and action.get("status") == "stuck":
                log.warning("Nemotron bloqué (stuck), bascule sur Claude")
                return self._run_claude_for(frame, system, user_text, config.CLAUDE_TABLEAU_REQUESTS)

        # Si la réponse de Nemotron indique un tableau / multi-actions non résolu,
        # bascule sur Claude qui est plus robuste pour les grilles.
        if self._is_tableau_response(nemotron_actions):
            if self._claude is not None:
                log.warning("Question tableau détectée, bascule sur Claude")
                return self._run_claude_for(frame, system, user_text, config.CLAUDE_TABLEAU_REQUESTS)

        # Pas de bascule : on retourne la réponse de Nemotron telle quelle.
        # Détection de boucle pour les étapes suivantes.
        for action in nemotron_actions:
            if action.get("action") == "done" and action.get("status") == "stuck":
                self._record_stuck(True)
                break
        else:
            self._record_stuck(False)

        return nemotron_actions
