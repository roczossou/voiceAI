"""Exécution des actions souris / clavier avec pyautogui.

Les coordonnées reçues du modèle sont dans le repère de l'image envoyée
(ex. 1024x576). Elles sont converties ici en pixels écran réels.
Le failsafe pyautogui reste actif : souris dans un coin = arrêt immédiat.
"""

from __future__ import annotations

import logging
import time
from typing import Any

import pyautogui
import pyperclip

log = logging.getLogger("autosurvey")

pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.05

_KEY_ALIASES = {"return": "enter", "escape": "esc", "pgdn": "pagedown", "pgup": "pageup"}


class ActionError(Exception):
    """Action impossible à exécuter (renvoyée au modèle comme résultat)."""


def to_screen(x: int, y: int, img_w: int, img_h: int) -> tuple[int, int]:
    """Convertit un point du repère image vers un point écran, borné à l'écran."""
    sw, sh = pyautogui.size()
    sx = round(x * sw / img_w)
    sy = round(y * sh / img_h)
    return min(max(sx, 0), sw - 1), min(max(sy, 0), sh - 1)


def _key(name: str) -> str:
    k = str(name).strip().lower()
    return _KEY_ALIASES.get(k, k)


def _point(action: dict[str, Any], img_w: int, img_h: int, x_key: str = "x", y_key: str = "y") -> tuple[int, int]:
    return to_screen(int(action[x_key]), int(action[y_key]), img_w, img_h)


def _type(text: str, clear: bool) -> None:
    # Presse-papiers + Ctrl+V : gère les accents et les caractères spéciaux,
    # ce que pyautogui.write ne fait pas.
    if clear:
        pyautogui.hotkey("ctrl", "a")
        pyautogui.press("backspace")
    pyperclip.copy(text)
    pyautogui.hotkey("ctrl", "v")


def execute(action: dict[str, Any], img_w: int, img_h: int) -> str:
    """Exécute une action validée et renvoie un court résultat pour la mémoire."""
    kind = action["action"]

    if kind == "click":
        x, y = _point(action, img_w, img_h)
        pyautogui.click(x, y)
    elif kind == "double_click":
        x, y = _point(action, img_w, img_h)
        pyautogui.doubleClick(x, y)
    elif kind == "right_click":
        x, y = _point(action, img_w, img_h)
        pyautogui.rightClick(x, y)
    elif kind == "type":
        _type(str(action["text"]), bool(action.get("clear", False)))
    elif kind == "press":
        pyautogui.press(_key(action["key"]))
    elif kind == "hotkey":
        keys = [_key(k) for k in action["keys"]]
        if not keys:
            raise ActionError("hotkey sans touche")
        pyautogui.hotkey(*keys)
    elif kind == "scroll":
        x, y = _point(action, img_w, img_h)
        pyautogui.moveTo(x, y)
        amount = int(action.get("amount", 300))
        # Forcer un très grand défilement : couvre la quasi-totalité de l'écran.
        amount = max(amount, 450)
        pyautogui.scroll(-amount if str(action.get("direction", "down")).lower() == "down" else amount)
    elif kind == "drag":
        x1, y1 = _point(action, img_w, img_h)
        x2, y2 = _point(action, img_w, img_h, "x2", "y2")
        pyautogui.moveTo(x1, y1)
        pyautogui.dragTo(x2, y2, duration=0.4, button="left")
    elif kind == "wait":
        time.sleep(float(action.get("seconds", 2)))
    else:
        raise ActionError(f"action non gérée: {kind!r}")

    log.info("action %s -> ok", kind)
    return "ok"
