"""Point d'entrée : python run_autosurvey.py

Mets le sondage au premier plan pendant le compte à rebours : la souris et le
clavier pilotent l'écran principal. Un seul fichier de mémoire (memoire.json)
est utilisé pour le sondage en cours.
"""

from __future__ import annotations

import argparse
import logging
import sys
import time
from pathlib import Path

from autosurvey import config
from autosurvey.agent import SurveyAgent


def main() -> int:
    parser = argparse.ArgumentParser(description="Remplit un sondage à l'écran.")
    parser.add_argument("--profile", type=Path, default=config.PROFILE_PATH, help="fichier profil (clé: valeur)")
    parser.add_argument("--max-steps", type=int, default=config.MAX_STEPS)
    parser.add_argument("--fresh", action="store_true", help="efface la mémoire avant de commencer")
    parser.add_argument("--dry-run", action="store_true", help="le modèle décide, aucune action n'est exécutée")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

    # Un seul fichier de mémoire pour le sondage en cours.
    # On demande si le sondage est nouveau ou s'il faut continuer l'existant.
    reponse = input("Le sondage actuel est-il nouveau ? (o/n) : ").strip().lower()
    nouveau = reponse in {"o", "oui", "y", "yes"}
    fresh = args.fresh or nouveau

    print(f"Démarrage dans {config.START_COUNTDOWN}s : mets le sondage au premier plan. "
          "Souris dans un coin de l'écran = arrêt d'urgence.")
    time.sleep(config.START_COUNTDOWN)

    agent = SurveyAgent(args.profile, fresh=fresh, dry_run=args.dry_run)
    try:
        result = agent.run(args.max_steps)
    except KeyboardInterrupt:
        result = "arrêt manuel (Ctrl+C)"
    print(f"\nRésultat : {result}")
    print(f"Étapes enregistrées : {agent.memory.steps}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
