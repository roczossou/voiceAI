"""Boucle principale : capture -> décision -> action -> mémoire.

Une seule boucle, sans sous-agents. Elle s'arrête proprement sur : fin de sondage,
blocage signalé par le modèle, limite d'étapes, modèle indisponible, écran noir
persistant, ou failsafe souris.
"""

from __future__ import annotations

import logging
import re
import time
from pathlib import Path
from typing import Any

import pyautogui

from . import actions, config, screen
from .memory import SurveyMemory
from .model import ModelError, VisionModel, system_prompt

log = logging.getLogger("autosurvey")

DONE_MESSAGES = {
    "finished": "sondage terminé",
    "blocked": "arrêt : sondage bloqué",
    "stuck": "arrêt : aucune progression",
}


def load_profile(path: Path) -> str:
    """Lit profile.txt (format 'clé: valeur') et le met en forme pour le prompt."""
    if not path.exists():
        log.warning("profil introuvable: %s", path)
        return "PROFIL UTILISATEUR : aucun."
    lines = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line and not line.startswith("#") and ":" in line:
            key, _, value = line.partition(":")
            lines.append(f"- {key.strip()}: {value.strip()}")
    return "PROFIL UTILISATEUR :\n" + "\n".join(lines) if lines else "PROFIL UTILISATEUR : aucun."


def _signature(entry: dict[str, Any]) -> tuple:
    return (entry.get("action"), entry.get("x"), entry.get("y"), entry.get("question", ""))


class SurveyAgent:
    def __init__(self, profile_path: Path, *, fresh: bool = False, dry_run: bool = False) -> None:
        self.memory = SurveyMemory()
        if fresh:
            self.memory.reset()
        self.profile_path = profile_path
        self.profile_text = load_profile(profile_path)
        self.dry_run = dry_run
        self.model = VisionModel()

    def _save_profile_entry(self, key: str, value: str) -> None:
        """Ajoute ou met à jour une entrée clé: valeur dans le fichier de profil."""
        data: dict[str, str] = {}
        if self.profile_path.exists():
            for raw in self.profile_path.read_text(encoding="utf-8").splitlines():
                line = raw.strip()
                if line and not line.startswith("#") and ":" in line:
                    k, _, v = line.partition(":")
                    data[k.strip()] = v.strip()
        data[key] = value
        lines = [f"{k}: {v}" for k, v in data.items()]
        self.profile_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        # Rafraîchit le texte du profil pour les prochains prompts.
        self.profile_text = load_profile(self.profile_path)

    def _profile_keys(self) -> set[str]:
        """Renvoie l'ensemble des clés déjà présentes dans le profil."""
        keys: set[str] = set()
        if self.profile_path.exists():
            for raw in self.profile_path.read_text(encoding="utf-8").splitlines():
                line = raw.strip()
                if line and not line.startswith("#") and ":" in line:
                    k, _, _ = line.partition(":")
                    keys.add(k.strip())
        return keys


    def _update_profile_from_action(self, action: dict[str, Any]) -> None:
        """Met à jour le profil si l'action apporte une information nouvelle.

        Toute action (click, type, press, scroll, drag) qui associe une question
        à une réponse peut ajouter une entrée 'invented_<question>' dans le profil,
        à condition que cette clé n'y figure pas déjà.
        """
        answer = str(action.get("answer", "")).strip()
        question = str(action.get("question", "")).strip()
        if not answer or not question:
            return

        key = re.sub(r"[^a-zA-Z0-9éèêàùâôîûëïüç _-]", "", question).strip().lower()
        key = re.sub(r"\s+", "_", key)[:60] or "reponse"
        # Pas de préfixe "invented_" : la clé est écrite telle quelle, en français.
        full_key = key

        if full_key in self._profile_keys():
            return

        self._save_profile_entry(full_key, answer)
        log.info("profil mis à jour : %s = %r", full_key, answer)

    def run(self, max_steps: int = config.MAX_STEPS) -> str:
        try:
            return self._loop(max_steps)
        except pyautogui.FailSafeException:
            return "arrêt : souris dans un coin de l'écran (failsafe)"
        finally:
            self.model.close()

    # ------------------------------------------------------------------ boucle

    def _loop(self, max_steps: int) -> str:
        invalid_streak = 0
        blank_streak = 0
        system = None

        for _ in range(max_steps):
            time.sleep(config.CAPTURE_DELAY)
            frame = screen.capture()

            if frame.brightness < config.BLANK_BRIGHTNESS:
                blank_streak += 1
                if blank_streak > 20:
                    return "arrêt : écran noir persistant"
                log.info("écran noir/vide, attente")
                time.sleep(2)
                continue
            blank_streak = 0

            if system is None:
                system = system_prompt(frame.width, frame.height, self.profile_text)

            try:
                actions = self.model.decide(frame, system, self._user_text())
            except ModelError as exc:
                invalid_streak += 1
                log.error("modèle indisponible (%d/%d): %s", invalid_streak, config.MAX_INVALID_RESPONSES, exc)
                if invalid_streak >= config.MAX_INVALID_RESPONSES:
                    return "arrêt : modèle indisponible"
                time.sleep(5)
                continue
            invalid_streak = 0

            log.info("décision: %s", actions)

            # Si le modèle signale "stuck" (bloqué), tenter une action de récupération
            # au lieu d'arrêter immédiatement : cliquer sur "Suivant" pour contourner
            # le blocage, ou re-cliquer sur le champ de la question pour le remplir à nouveau.
            recovery_attempts = 0
            for action in actions:
                if action["action"] == "done" and action.get("status") == "stuck":
                    recovery_attempts += 1
                    if recovery_attempts <= 2:
                        log.warning("Modèle bloqué (stuck), tentative de récupération : clic Suivant")
                        action = {
                            "action": "click", "x": 500, "y": 860,
                            "question": "", "answer": "",
                            "reason": "Récupération : clic forcé sur Suivant pour contourner le blocage",
                            "prochaine_action": "passer_a_la_suivante",
                        }
                    else:
                        log.warning("Récupération échouée après 2 tentatives, arrêt définitif.")
                        status = action.get("status", "stuck")
                        self.memory.record(action, status)
                        reason = action.get("reason", "")
                        return f"{DONE_MESSAGES.get(status, status)} {reason}".strip()

                # Mise à jour du profil si l'action apporte une information nouvelle.
                self._update_profile_from_action(action)

                # Détection de boucle sur la dernière action effectuée.
                if self._trailing_count(action) >= 2 * config.REPEAT_LIMIT and action["action"] != "scroll":
                    log.warning("boucle détectée sur %s, défilement forcé", action["action"])
                    action = {
                        "action": "scroll", "x": frame.width // 20, "y": frame.height // 2,
                        "direction": "down", "amount": 5, "question": "", "answer": "",
                        "reason": "boucle détectée : défilement forcé",
                    }

                if action["action"] == "done":
                    status = action.get("status", "stuck")
                    self.memory.record(action, status)
                    reason = action.get("reason", "")
                    return f"{DONE_MESSAGES.get(status, status)} {reason}".strip()

                # Dé-normalisation 0-1000 -> pixels écran : Nemotron retourne du 0-1000,
                # Claude retourne du 0-largeur/0-hauteur (frame.width/frame.height).
                if self.model.last_model_used == "nemotron":
                    img_w, img_h = 1000, 1000
                else:
                    img_w, img_h = frame.width, frame.height
                result = self._act(action, frame, img_w, img_h)
                self.memory.record(action, result)
                time.sleep(config.ACTION_DELAY)

        return "arrêt : limite d'étapes atteinte"

    # ------------------------------------------------------------------ helpers

    def _act(self, action: dict[str, Any], frame: screen.Frame, img_w: int = 1000, img_h: int = 1000) -> str:
        if self.dry_run:
            log.info("[dry-run] %s", action)
            return "dry-run"
        try:
            return actions.execute(action, img_w, img_h)
        except actions.ActionError as exc:
            log.warning("action refusée: %s", exc)
            return f"erreur: {exc}"
        except pyautogui.FailSafeException:
            raise
        except Exception as exc:  # une erreur d'action ne doit pas tuer le sondage
            log.exception("échec de l'action %s", action.get("action"))
            return f"erreur: {exc}"

    def _trailing_count(self, ref: dict[str, Any]) -> int:
        """Nombre d'actions identiques à `ref` consécutives en fin d'historique."""
        target = _signature(ref)
        count = 0
        for entry in reversed(self.memory.recent):
            if _signature(entry) != target:
                break
            count += 1
        return count

    def _user_text(self) -> str:
        parts = [self.memory.answered_text(), self.memory.history_text()]
        if self.memory.recent:
            last = self.memory.recent[-1]
            repeats = self._trailing_count(last)
            if repeats >= config.REPEAT_LIMIT:
                parts.append(
                    f"ATTENTION : la même action a déjà été faite {repeats} fois de suite sans effet. "
                    "Essaie autre chose : un autre élément, un défilement, une attente ou la fermeture d'une fenêtre."
                )
        parts.append("Décide la prochaine action.")
        return "\n\n".join(parts)
