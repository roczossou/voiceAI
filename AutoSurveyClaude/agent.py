"""Autonomous survey-answering loop for the AutoSurvey agent.

Capture -> Analyze (NVIDIA NIM VLM) -> Decide -> Act (PyAutoGUI), repeated
until the survey is done, the iteration cap is hit, or the failsafe fires.

Two separate files are maintained:

1. User profile (--profile-path): who the user is (name, email, preferences).
   Injected into the VLM prompt so answers stay consistent across surveys.
   Updated when the VLM invents an answer; persists across surveys.

2. Survey memory (--survey-memory-path): history of actions already performed
   in the CURRENT survey only (clicks, typed answers, scrolls). Independent of
   the user profile. Used to resume after an interruption without redoing what
   was already answered. A new survey name means a fresh memory.
"""

from __future__ import annotations

import json
import logging
import os
import re
import time
from collections import Counter
from dataclasses import dataclass

import bot_actions
import profile as profile_mod
import vision

log = logging.getLogger("autosurvey")

# Clé utilisée pour stocker une réponse inventée sous forme "Question -> réponse".
# Pas de préfixe "invented_" : les clés sont écrites telles quelles, en français.
_INVENTED_PREFIX = ""


@dataclass
class LoopConfig:
    max_steps: int = 1000
    action_delay: float = 1.0
    capture_delay: float = 3.0
    dry_run: bool = False
    profile_path: str = "profile.txt"
    screenshot_dir: str | None = None
    survey_memory_path: str = "memoire_sondage.txt"
    fresh_profile: bool = False
    fresh_survey_memory: bool = False
    reasoning_mode: bool = False
    reasoning_steps: int = 0


@dataclass
class LoopResult:
    steps: int
    stopped_reason: str
    actions: list[dict]


class AutoSurveyAgent:
    """Runs the capture/analyze/act loop with separate profile and survey memory."""

    def __init__(
        self,
        vision_client: vision.VisionClient | None = None,
        config: LoopConfig | None = None,
    ) -> None:
        self.vision = vision_client or vision.VisionClient()
        self.config = config or LoopConfig()
        self.actions: list[dict] = []

        # 1. Profil utilisateur (qui est l'utilisateur) - injecte dans le prompt VLM.
        self.profile = profile_mod.SurveyProfile(path=self.config.profile_path)

        # 2. Memoire de sondage (historique des actions dans ce sondage uniquement).
        self.survey_memory = profile_mod.SurveyProfile(path=self.config.survey_memory_path)

    def run(self, max_steps: int | None = None) -> LoopResult:
        # Charger le profil utilisateur.
        if self.config.fresh_profile:
            self.profile.data = {}
            log.info("profil utilisateur vierge (fresh-profile) pour %s", self.config.profile_path)
        else:
            self.profile.load()
            log.info("profil utilisateur charge depuis %s (%d entree%s)",
                     self.config.profile_path, len(self.profile.data),
                     "s" if len(self.profile.data) > 1 else "")

        # Charger la memoire de sondage (actions deja faites dans CE sondage).
        if self.config.fresh_survey_memory:
            self.survey_memory.data = {}
            self.actions = []
            log.info("memoire de sondage vierge (fresh-survey-memory) pour %s",
                     self.config.survey_memory_path)
        else:
            self.survey_memory.load()
            self._actions_from_memory()
            log.info("memoire de sondage chargee depuis %s (%d action%s restauree%s)",
                     self.config.survey_memory_path, len(self.actions),
                     "s" if len(self.actions) > 1 else "",
                     "s" if len(self.actions) > 1 else "")

        limit = max_steps if max_steps is not None else self.config.max_steps
        stopped_reason = "iteration cap reached"

        try:
            for step in range(1, limit + 1):
                log.info("=== step %d/%d ===", step, limit)

                # Attendre que la page soit chargee avant de capturer l'ecran.
                time.sleep(self.config.capture_delay)

                # 1. Capture
                image = bot_actions.take_screenshot()
                png_bytes = bot_actions.screenshot_to_png_bytes(image)

                # Enregistrer la capture sur disque si un repertoire est configure.
                if self.config.screenshot_dir:
                    os.makedirs(self.config.screenshot_dir, exist_ok=True)
                    shot_path = os.path.join(self.config.screenshot_dir, f"step_{step:03d}.png")
                    bot_actions.save_screenshot(image, shot_path)

                # 2. Analyze / decide (profile context + survey memory injected)
                history = self._recent_actions_history()
                decisions = self.vision.decide(
                    png_bytes,
                    self.profile.context(),
                    history=history,
                    reasoning_mode=self.config.reasoning_mode,
                )
                log.info("decision: %s", decisions)

                # NIM desactive : si le VLM ne peut pas repondre, utiliser le
                # moteur de fallback (Claude) pour prendre une action logique
                # basee sur l'historique des actions deja effectuees.
                if (len(decisions) == 1
                        and decisions[0].get("action") == "done"
                        and decisions[0].get("_parse_failed")):
                    fallback = self._fallback_decide()
                    log.info("fallback decision: %s", fallback)
                    decisions = [fallback]

                # Detecter une boucle : si la meme action se repete trop de fois,
                # activer le mode raisonnement du modele pour quelques etapes.
                self._detect_and_break_loop(decisions)

                # 3. Act sur chaque decision (une ou plusieurs actions)
                survey_done = False
                for decision in decisions:
                    action = decision.get("action", "done")
                    question = decision.get("question", "")

                    if action == "done":
                        if decision.get("_parse_failed"):
                            stopped_reason = "VLM unparseable, continuing"
                            log.warning(
                                "VLM response unparseable (%s), continuing to next step",
                                decision.get("reason"),
                            )
                            self.actions.append({"step": step, **decision})
                            continue
                        stopped_reason = "VLM reported done"
                        survey_done = True
                        break

                    # Mise a jour du profil utilisateur quand on tape une reponse.
                    if action == "type":
                        answer = str(decision.get("text", "")).strip()
                        if answer and question:
                            key = self._profile_key_for(question)
                            self.profile.set(key, answer)
                            log.info("profil mis a jour : %s = %r", key, answer)

                    self.actions.append({"step": step, **decision})

                    # Executer l'action (sauf en dry-run).
                    if self.config.dry_run:
                        log.info("[dry-run] would perform: %s", decision)
                    else:
                        self._perform(decision)

                    time.sleep(self.config.action_delay)

                # Gestion du mode raisonnement : actif pendant 5 etapes apres detection de boucle.
                if self.config.reasoning_mode:
                    self.config.reasoning_steps += 1
                    log.info(
                        "mode raisonnement actif (etape %d/5)", self.config.reasoning_steps
                    )
                    if self.config.reasoning_steps >= 5:
                        self.config.reasoning_mode = False
                        self.config.reasoning_steps = 0
                        log.info("mode raisonnement desactive après 5 etapes")
                else:
                    self.config.reasoning_steps = 0

                if survey_done:
                    break
        except Exception:
            log.exception("agent loop interrupted by an error")
            stopped_reason = "error: " + stopped_reason
            raise
        finally:
            # Sauvegarder les deux fichiers, quoi qu'il arrive.
            self._memory_from_actions()
            self.profile.save()
            log.info("profil utilisateur sauvegarde dans %s (%d entree%s)",
                     self.config.profile_path, len(self.profile.data),
                     "s" if len(self.profile.data) > 1 else "")
            self.survey_memory.save()
            log.info("memoire de sondage sauvegardee dans %s (%d action%s)",
                     self.config.survey_memory_path, len(self.actions),
                     "s" if len(self.actions) > 1 else "")

        return LoopResult(steps=step, stopped_reason=stopped_reason, actions=self.actions)

    def _detect_and_break_loop(self, decisions: list[dict]) -> None:
        """Detecte si la meme action se repete trop et force un changement de strategie.

        Si la meme action (clic aux memes coordonnees sur la meme question) a ete
        executee 3 fois ou plus sans progres, on force un scroll ou un clic sur
        'Suivant' pour debloquer la situation.
        """
        if len(self.actions) < 3:
            return

        # Compter les repetitions de la meme action sur les 5 dernieres actions.
        recent = self.actions[-5:]
        signatures = []
        for entry in recent:
            sig = (
                entry.get("action"),
                entry.get("question", ""),
                entry.get("x"),
                entry.get("y"),
            )
            signatures.append(sig)

        counts = Counter(signatures)
        most_common = counts.most_common(1)[0]
        sig, count = most_common

        if count >= 3:
            action, question, x, y = sig
            log.warning(
                "Boucle detectee : action %s repetee %d fois sur question '%s'. "
                "Activation du mode raisonnement du modele pour reflechir.",
                action, count, question,
            )
            # Activer le mode raisonnement pour aider le modele a sortir de la boucle.
            self.config.reasoning_mode = True
            self.config.reasoning_steps = 0

    def _profile_key_for(self, question: str) -> str:
        """Construit une cle de profil a partir d'une question."""
        safe = re.sub(r"[^a-zA-Z0-9éèêàùâôîûëïüç _-]", "", question).strip().lower()
        safe = re.sub(r"\s+", "_", safe)[:60]
        if not safe:
            safe = "reponse"
        return f"{_INVENTED_PREFIX}{safe}"

    def _memory_key_for(self, step: int, action: dict) -> str:
        """Construit une cle de memoire de sondage pour une action donnee."""
        q = action.get("question", "")
        safe = re.sub(r"[^a-zA-Z0-9éèêàùâôîûëïüç _-]", "", q).strip().lower()
        safe = re.sub(r"\s+", "_", safe)[:60]
        if not safe:
            safe = "action"
        return f"step_{step:04d}_{action.get('action','?')}_{safe}"

    def _actions_from_memory(self) -> None:
        """Reconstruit la liste des actions depuis le fichier de memoire de sondage."""
        self.actions = []
        for key, value in self.survey_memory.data.items():
            if key.startswith("step_"):
                try:
                    if isinstance(value, dict):
                        self.actions.append(value)
                    elif isinstance(value, str):
                        self.actions.append(json.loads(value))
                except Exception:
                    log.warning("impossible de restaurer l'action depuis la memoire: %s", key)

    def _memory_from_actions(self) -> None:
        """Ecrit les actions dans le fichier de memoire de sondage."""
        self.survey_memory.data = {}
        for entry in self.actions:
            step = entry.get("step", 0)
            key = self._memory_key_for(step, entry)
            self.survey_memory.data[key] = entry

    def _recent_actions_history(self, n: int = 5) -> str:
        """Renvoie un resume textuel des dernieres actions deja effectuees."""
        if not self.actions:
            return "Aucune action precedente."
        lines = []
        for entry in self.actions[-n:]:
            step = entry.get("step", "?")
            action = entry.get("action", "")
            question = entry.get("question", "")
            reason = entry.get("reason", "")
            detail = ""
            if action == "type":
                detail = f" texte='{entry.get('text', '')}'"
            elif action == "click":
                detail = f" a ({entry.get('x')},{entry.get('y')})"
            elif action == "scroll":
                detail = f" {entry.get('direction')} a ({entry.get('x')},{entry.get('y')})"
            elif action == "press":
                detail = f" touche '{entry.get('key')}'"
            prochaine = entry.get("prochaine_action", "")
            prochaine_str = f" | prochaine_action={prochaine}" if prochaine else ""
            lines.append(f"- etape {step}: {action}{detail} | question='{question}' | {reason}{prochaine_str}")
        return "\n".join(lines)

    def _fallback_decide(self) -> dict:
        """Moteur de decision de secours quand NIM est desactive.

        Base sa decision sur l'historique des actions deja effectuees pour
        faire progresser le sondage page par page (clic Suivant / Entrée en
        alternance) en l'absence d'analyse visuelle.
        """
        if not self.actions:
            return {
                "action": "click",
                "x": 495,
                "y": 860,
                "reason": "cliquer Suivant (fallback, demarrage)",
                "question": "",
            }

        last = self.actions[-1]
        action = last.get("action", "")
        prochaine = last.get("prochaine_action", "")

        # Alterne clic Suivant et Entree pour avancer page par page.
        if action == "click" and prochaine == "cliquer_suivant":
            return {
                "action": "press",
                "key": "enter",
                "reason": "valider la page (fallback, Entree apres Suivant)",
                "question": "",
            }
        if action == "press":
            return {
                "action": "click",
                "x": 495,
                "y": 860,
                "reason": "cliquer Suivant (fallback, page suivante)",
                "question": "",
            }
        # Par defaut : cliquer Suivant.
        return {
            "action": "click",
            "x": 495,
            "y": 860,
            "reason": "cliquer Suivant (fallback, defaut)",
            "question": "",
        }

    def _perform(self, decision: dict) -> None:
        action = decision["action"]
        try:
            if action == "click":
                bot_actions.click_at(
                    int(decision["x"]), int(decision["y"]), delay=self.config.action_delay
                )
            elif action == "type":
                bot_actions.type_text(str(decision.get("text", "")), delay=self.config.action_delay)
            elif action == "press":
                bot_actions.press_key(str(decision.get("key", "enter")), delay=self.config.action_delay)
            elif action == "drag":
                bot_actions.drag_from_to(
                    int(decision["x"]),
                    int(decision["y"]),
                    int(decision["x2"]),
                    int(decision["y2"]),
                    delay=self.config.action_delay,
                )
            elif action == "scroll":
                bot_actions.scroll_at(
                    int(decision.get("x", 0)),
                    int(decision.get("y", 0)),
                    str(decision.get("direction", "down")),
                    delay=self.config.action_delay,
                )
            else:
                log.warning("unknown action %r, skipping", action)
        except Exception:
            log.exception("failed to perform action %s", action)
            raise
