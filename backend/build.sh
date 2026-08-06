#!/usr/bin/env bash
# Build Render du service Django. Lancé depuis backend/ (rootDir du service).
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

cd back

python manage.py collectstatic --no-input
python manage.py migrate --no-input

# Injection unique du contenu existant (projets, articles, parcours, stats…)
# dans la base PostgreSQL vierge. À ne garder que le temps d'un déploiement :
# la fixture écrase les lignes de même identifiant, donc les modifications
# faites depuis le back-office seraient perdues à chaque build.
if [ "$LOAD_INITIAL_DATA" = "true" ]; then
  python manage.py loaddata contenu
fi

# Crée le compte back-office au premier déploiement si les trois variables
# DJANGO_SUPERUSER_* sont définies (Render n'ouvre pas de shell sur le plan
# gratuit). Ne fait rien si le compte existe déjà.
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py createsuperuser --no-input || true
fi
