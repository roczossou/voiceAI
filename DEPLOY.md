# Déploiement sur Render

| Ressource | Hébergeur | Contenu |
|---|---|---|
| base PostgreSQL | **Neon** (hors Render) | les données, déjà migrées et peuplées |
| `chabel-api` | Render — Web Service (Python) | l'API DRF + le back-office Django (`/admin/`) |
| `chabel-site` | Render — Static Site | le site React compilé (`frontend/dist`) |

Les deux services Render sont décrits dans `render.yaml` (blueprint).

## État de la base Neon

La base est **déjà prête** : migrations appliquées et contenu chargé
(1 projet, 4 articles, 3 formations, 3 expériences, 3 distinctions,
4 partenaires, 25 services, 25 compétences, les indicateurs), plus un compte
back-office `chabel`. Il n'y a donc rien à refaire à l'étape 3 ci-dessous, sauf
si l'on repart d'une base vierge.

La chaîne de connexion vit dans `backend/.env` en local (fichier **non
versionné**) et devra être collée dans `DATABASE_URL` sur Render. C'est
l'endpoint *poolé* de Neon (PgBouncer en mode transaction) : `settings.py`
désactive automatiquement les curseurs côté serveur quand l'URL contient
`pooler`, sans quoi les requêtes `.iterator()` échoueraient.

⚠️ Ce mot de passe a circulé en clair (chat, presse-papiers) : le régénérer
depuis le dashboard Neon avant la mise en ligne publique est une bonne idée —
il suffira alors de mettre à jour `backend/.env` et la variable sur Render.

---

## 0. Prérequis : mettre le projet sur Git

Render déploie depuis un dépôt GitHub/GitLab. Le dossier n'est pas encore un
dépôt Git :

```bash
cd /home/roc/Téléchargements/ChabelPorfolio
git init
git add .
git commit -m "Préparation du déploiement Render"
git remote add origin git@github.com:<compte>/<depot>.git
git push -u origin main
```

Le `.gitignore` à la racine exclut déjà `venv/`, `node_modules/`, `dist/`,
`staticfiles/`, `db.sqlite3` et les fichiers `.env`.

## 1. Créer le blueprint

Sur Render : **New → Blueprint** → choisir le dépôt → Render lit `render.yaml`
et propose les deux services. Il demande les variables marquées `sync: false` :

| Variable | Valeur au premier déploiement |
|---|---|
| `DATABASE_URL` | la chaîne Neon (celle de `backend/.env`) |
| `CORS_ALLOWED_ORIGINS` | (vide pour l'instant) |
| `CSRF_TRUSTED_ORIGINS` | (vide pour l'instant) |
| `VITE_API_URL` | (vide pour l'instant) |
| `DJANGO_SUPERUSER_*` | inutile — le compte existe déjà dans Neon |

`DJANGO_SECRET_KEY` est générée par Render.

## 2. Recoller les deux services une fois les URL connues

Après le premier déploiement, Render attribue les URL (par ex.
`https://chabel-api.onrender.com` et `https://chabel-site.onrender.com`).
Il faut alors renseigner, **sans slash final** :

- sur `chabel-api` : `CORS_ALLOWED_ORIGINS` et `CSRF_TRUSTED_ORIGINS` =
  l'URL du site statique ;
- sur `chabel-site` : `VITE_API_URL` = l'URL de l'API.

⚠️ `VITE_API_URL` est **inlinée au build** par Vite : après l'avoir changée, il
faut relancer un déploiement du site statique (*Manual Deploy → Clear build
cache & deploy*), un simple redémarrage ne suffit pas.

## 3. Injecter le contenu — déjà fait

Le contenu a été chargé dans Neon depuis
`backend/back/main/fixtures/contenu.json` (71 objets). **Laisser
`LOAD_INITIAL_DATA` à `false`** : la fixture écrase les lignes de même
identifiant, donc la réactiver annulerait les modifications faites depuis le
back-office.

Pour repartir d'une base vierge (nouvelle base Neon, par exemple) :

```bash
cd backend/back
../venv/bin/python manage.py migrate
../venv/bin/python manage.py loaddata contenu
../venv/bin/python manage.py createsuperuser
```

Régénérer la fixture depuis le SQLite local si besoin :

```bash
cd backend/back
../venv/bin/python manage.py dumpdata main --indent 2 -o main/fixtures/contenu.json
```

## 4. Vérifier

- `https://chabel-api.onrender.com/api/services/` → du JSON ;
- `https://chabel-api.onrender.com/admin/` → la connexion au back-office ;
- `https://chabel-site.onrender.com/projets` → la page se charge **et survit à
  un rechargement** (la règle de réécriture SPA de `render.yaml`) ;
- une image de projet s'affiche bien (elle vient de `/media/` côté API).

---

## Points d'attention

### Les fichiers téléversés ne survivent pas aux déploiements (plan gratuit)

Le système de fichiers d'une instance Render est éphémère : tout visuel ajouté
depuis le back-office disparaît au déploiement suivant. Les images déjà
fournies sont versionnées dans `backend/back/media/`, donc elles, elles
restent — mais pas les nouvelles.

Pour y remédier, il faut un **disque persistant**, qui impose un plan payant
(`starter`). Dans `render.yaml` : passer `plan: starter` sur `chabel-api`,
décommenter le bloc `disk:`, ajouter la variable
`DJANGO_MEDIA_ROOT=/var/data/media`, et — comme le disque n'est pas monté
pendant le build — recopier une fois les visuels existants au démarrage :

```yaml
startCommand: >
  mkdir -p "$DJANGO_MEDIA_ROOT" &&
  cp -rn back/media/. "$DJANGO_MEDIA_ROOT"/ 2>/dev/null;
  gunicorn --chdir back back.wsgi:application
```

L'alternative durable, si le volume d'images grandit, est un stockage objet
(S3, Cloudinary) via `django-storages` — à ce moment-là seul le `STORAGES`
`default` de `settings.py` change.

### Mise en veille (plan gratuit)

Un service gratuit s'endort après ~15 min sans trafic : la première visite
attend alors ~50 s le réveil de l'API. Les pages qui chargent des données
(`/projets`, `/services`, `/a-propos`, `/blog`) resteront sur leur état de
chargement pendant ce temps. Le plan `starter` supprime ce comportement.

### Base Neon

Le plan gratuit de Neon met la base en veille après quelques minutes d'inactivité :
la première requête la réveille (moins d'une seconde). Pas d'expiration à 30 jours,
contrairement au PostgreSQL gratuit de Render. Penser tout de même à un export
régulier : `dumpdata` (voir ci-dessus) ou `pg_dump` sur l'endpoint direct
(sans `-pooler`).

### Sécurité

`manage.py check --deploy` signale trois avertissements, tous assumés :

- `SECURE_HSTS_SECONDS` à 0 — à activer (`DJANGO_HSTS_SECONDS=31536000`) une
  fois le domaine définitif branché, la directive étant difficile à révoquer ;
- `SECURE_SSL_REDIRECT` à false — Render redirige déjà `http` → `https` en
  amont, et la redirection applicative ferait échouer le health check interne ;
- `SECRET_KEY` — l'avertissement disparaît avec la clé générée par Render.

Reste ouvert, hors périmètre de cette préparation : l'API est en `AllowAny`
(lecture publique et `POST /api/demandes/` public, protégé seulement par le
honeypot + un throttle `5/hour` **en mémoire**, donc remis à zéro à chaque
redéploiement et non partagé entre instances). Si le formulaire de contact
devient une cible, brancher le throttle sur un cache Redis.

## Domaine personnalisé

Une fois le domaine acheté : l'ajouter sur `chabel-site` (Settings → Custom
Domains) et suivre les enregistrements DNS indiqués. Puis, sur `chabel-api`,
ajouter ce domaine à `CORS_ALLOWED_ORIGINS` et `CSRF_TRUSTED_ORIGINS` (et à
`DJANGO_ALLOWED_HOSTS` si l'API reçoit elle aussi un sous-domaine, par ex.
`api.chabel-ananounon.com`).
