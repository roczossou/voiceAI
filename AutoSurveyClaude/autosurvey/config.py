"""Réglages centraux. Tout le reste du package lit ici."""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

# --- Modèle vision (API Anthropic / Claude) -----------------------------------
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_WORKSPACE_ID = os.getenv("ANTHROPIC_WORKSPACE_ID", "")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-haiku-5-5")
CLAUDE_FALLBACK_MODELS = [m.strip() for m in os.getenv("CLAUDE_FALLBACK_MODELS", "").split(",") if m.strip()]
CLAUDE_MAX_TOKENS = 2600
CLAUDE_TEMPERATURE = 0.2

# --- NVIDIA NIM (Nemotron) - modèle principal ---------------------------------
NIM_API_KEY = os.getenv("NIM_API_KEY", "")
NIM_BASE_URL = os.getenv("NIM_BASE_URL", "https://integrate.api.nvidia.com/v1")
NIM_MODEL = os.getenv("NIM_MODEL", "nvidia/nemotron-3.5-super-vl-120b-a12b")
NIM_PROXY = os.getenv("NIM_PROXY", "")
NIM_MAX_TOKENS = int(os.getenv("NIM_MAX_TOKENS", "5000"))
USE_NEMOTRON_PRIMARY = os.getenv("USE_NEMOTRON_PRIMARY", "true").lower() == "true"

# --- Capture ------------------------------------------------------------------
# Écran 1366x768 réduit en 1024x576 (même ratio 16:9) : ~800 tokens d'image
# au lieu d'environ 2000 pour le plein écran. JPEG qualité 60 : texte encore lisible.
CAPTURE_WIDTH = 1024
CAPTURE_HEIGHT = 576
JPEG_QUALITY = 60
BLANK_BRIGHTNESS = 4  # luminosité moyenne (0-255) sous laquelle l'écran est considéré vide/noir

# --- Boucle -------------------------------------------------------------------
MAX_STEPS = 300
CAPTURE_DELAY = 3.0  # attente avant chaque capture (la page doit être stable)
ACTION_DELAY = 0.8  # attente après chaque action
MAX_INVALID_RESPONSES = 3  # échecs modèle consécutifs avant arrêt
REPEAT_LIMIT = 3  # même action N fois de suite -> avertissement au modèle
HISTORY_SIZE = 8  # nombre d'actions récentes envoyées au modèle
ANSWERS_IN_PROMPT = 40  # nombre de réponses déjà données envoyées au modèle
START_COUNTDOWN = 3  # secondes avant de piloter la souris (temps de mettre le sondage au premier plan)

# --- Chemins ------------------------------------------------------------------
PROFILE_PATH = ROOT / "profile.txt"
MEMORY_FILE = ROOT / "memoire.json"
MEMORY_JOURNAL = ROOT / "memoire.jsonl"
