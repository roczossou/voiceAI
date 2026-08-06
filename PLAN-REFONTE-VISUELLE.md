# Plan de refonte visuelle — portfolio Chabel ANANOUNON

Ouvert le 2026-08-03. Prototype validé sur `/a-propos`, à généraliser aux
autres pages Tailwind. Ce fichier est le plan de travail : il liste ce qui est
fait, ce qui reste, et surtout **les règles à ne pas réapprendre à chaque fois**.

---

## 0. Origine

Demande client : « je veux de beaux design, un site en 3D ».
Arbitrage retenu (voir `promptDesign.txt` §C.2 et §C.11, qui interdisent toute
librairie hors GSAP/Lenis et les « illustrations 3D ») :

> **Enrichir dans le système + profondeur en CSS/GSAP.**
> Pas de WebGL, pas de Three.js, aucune dépendance ajoutée.

Retours successifs intégrés :
- « je n'aime pas le style cahier » → trame millimétrée `--grille` retirée
- « j'ai bien aimé les mots écrits en grand transparent » → conservés, mais
  entiers et non tronqués
- « les animations d'entrée c'est vraiment pas ça » → bugs corrigés (§2)
- « pas la même animation à chaque fois » → jeu de variantes
- « plus ample, plus lente, verticale, horizontale, et qui frôle la 3D »
- « ni la section ni les cartes ne s'animent » (Compétences)

---

## 1. Règles acquises — à appliquer d'office

### Tailwind : valeurs arbitraires ambiguës
Ce projet charge Tailwind **sans `preflight`**. Trois pièges, tous silencieux
(ni ESLint ni `npm run build` ne les voient) :

| À ne jamais écrire | Ce que ça produit vraiment | À écrire |
|---|---|---|
| `font-[var(--font-display)]` | `font-weight` → police jamais appliquée | `font-[family-name:var(--font-display)]` |
| `text-[var(--fs-mono)]` | `color` → taille jamais appliquée | `text-[length:var(--fs-mono)]` |
| `border-[var(--bordure)]` | **rien du tout**, la classe disparaît | `border-[color:var(--bordure)]` |

`text-[var(--graphite)]` reste correct : c'est bien une couleur.
Vérification : `grep 'font-size:var\|font-family:var' dist/assets/*.css`.

### Animations
- **Easing** : `power2.inOut`, jamais `expo.out` pour une révélation de section.
  `expo.out` parcourt ~90% de la distance dans le premier quart du temps :
  l'animation paraît instantanée quelle que soit la durée. C'est la cause
  réelle du « pas assez lent », pas la durée.
- **État initial posé tout de suite**, avant d'observer. Sinon le contenu
  s'affiche, puis saute à l'état caché quand l'observateur se déclenche.
- **`RevealMask` pour les titres courts seulement.** Sur un paragraphe entier
  il fait coulisser tout le pavé de 112% de sa hauteur → effet de dalle.
  Pour le texte courant : `RevealRise`.
- **Éléments issus de l'API** : passer `itemCount` à `useRevealStagger`. Au
  premier rendu la liste est vide, le hook ne trouve rien et ne se rejoue
  jamais → cartes visibles sans animation.
- **Jamais deux révélations imbriquées** : l'intérieure se joue pendant que le
  parent est encore invisible.
- **Variantes horizontales** : toujours via `RevealSection`, qui enveloppe dans
  un `overflow-x: clip` (et non `hidden`, qui casserait les `position: sticky`).

### Profondeur
- `useTilt` sur les cartes/plaques (inerte ≤768px et en reduced-motion).
- Plans pleins décalés en parallaxe — **pas** de trame `--grille`, pas d'ombre
  portée (proscrite §C.11).
- Mots géants transparents : `whitespace-nowrap`, centrés, **au-dessus** des
  plans de fond (`z-[1]`) et sous le contenu (`z-10`). S'ils passent derrière
  un plan, ils sont tranchés et se lisent comme un bug.

---

## 2. Primitives ajoutées (`src/motion/`)

| Fichier | Rôle |
|---|---|
| `useTilt.js` | inclinaison 3D au pointeur, sur le ressort partagé |
| `RevealRise.jsx` | enveloppe déclarative de `useRevealRise` (texte courant) |
| `useRevealSection.js` + `RevealSection.jsx` | révélation de section, 7 variantes |
| `useRevealStagger.js` | cascade sur les enfants `[data-reveal-item]` |

Variantes disponibles : `rise` · `slideLeft` · `slideRight` · `tilt3d` ·
`swing` · `zoom` · `wipe`.
`wipe` est interdit sur une section contenant un `useTilt` avec `lift` (le clip
rognerait le soulèvement).

---

## 3. État par page

### `/a-propos` — FAIT (prototype de référence)
- [x] hero de page avec plaque inclinable + plan décalé + mot géant `PROFIL`
- [x] trame « cahier » retirée
- [x] révélations variées : `slideLeft` · `rise` · `tilt3d` · `swing` ·
      `slideRight` · `zoom`
- [x] bloc Compétences : révélation propre + cascade des 25 cartes
- [x] `useTilt` sur portrait, plaque, blocs Vision/Mission, 12 cellules Valeurs
- [x] vérifié : clair/sombre, 375px sans débordement, console propre

### `/services` — FAIT
- [x] hero de page (fil d'Ariane, mot géant `SERVICES`, plan décalé en parallaxe)
- [x] `RevealSection` par groupe : `slideLeft` · `rise` · `tilt3d` ·
      `slideRight` · `zoom`
- [x] ~~cascade sur les lignes~~ — **écartée volontairement** : le groupe est
      déjà enveloppé dans une `RevealSection`, deux révélations imbriquées se
      neutralisent. La variété vient de la variante, qui change à chaque groupe.
- [x] relief réservé au hero (les lignes sont pleine largeur, un tilt y serait illisible)

### `/contact` — FAIT
- [x] hero de page (mot géant `ÉCHANGE`)
- [x] `RevealSection variant="slideRight"` sur la colonne latérale
- [x] `useTilt` sur la carte des coordonnées, qui gagne un cadre
- [x] champs jamais animés individuellement (gênerait la saisie)

### `/blog` — FAIT
- [x] hero de page (mot géant `JOURNAL`)
- [x] cascade sur la grille de cartes, clé `itemCount` incluant page + filtre
      pour rejouer à chaque nouveau jeu de cartes
- [x] `useTilt` sur les cartes d'article
- [x] état vide conservé (aucun article en base à ce jour)

### `/` — FAIT (2026-08-03)
- [x] trame millimétrée **conservée sur le hero** — décision client : « laisse
      le papier sur le hero, il ne sort pas trop ». Elle n'est retirée que sur
      `/a-propos`.
- [x] révélations variées sur R01–R07 : `tilt3d` · `slideLeft` · `rise` ·
      `swing` · `slideRight` · `rise` · `zoom`
- [x] section de rebond avant le CTA
- [x] `home.css` **non converti** (voir §3 bis)

### `/projets` — FAIT (2026-08-03)
- [x] hero de page en Tailwind (mot géant `ATELIER`, plan décalé)
- [x] section de rebond en fin de page
- [x] **pas** de `RevealSection` autour de la section principale : la barre de
      filtres est en `position: sticky`, et un ancêtre transformé la ferait se
      caler sur lui au lieu de la fenêtre. Vérifié après coup : la barre colle
      toujours à 72px (= 4.5rem, valeur spec).
- [x] `projets.css` / `projet-detail.css` **non convertis** (voir §3 bis).
      Attention `projet-detail.css` contient `.projet-detail > .container >
      section` : y insérer une enveloppe casserait le sélecteur.

---

## 3 bis. Ce qui a été converti en Tailwind — et ce qui ne l'a PAS été

Décision du 2026-08-03, sur consigne « convertis ce qu'il faut convertir ».

**Converti** : tout le markup neuf (heros de `/projets`, sections de rebond).

**Non converti, volontairement** : `home.css` (370 l.), `projets.css` (246 l.),
`projet-detail.css` (69 l.). Les réécrire en classes Tailwind ne changerait
**rien** au rendu — c'est du remaniement pur sur deux pages déjà validées, avec
un risque de régression réel et aucun gain visible. Les améliorations
demandées (révélations, relief, rebond) sont du JS/GSAP : elles s'appliquent
sans toucher au CSS.

Règle qui en découle : **sur `/` et `/projets`, le markup neuf s'écrit en
Tailwind, le CSS existant reste tel quel.** Les deux systèmes cohabitent sur
ces deux pages ; c'est assumé.

---

## 4. Vérification — obligatoire avant de dire que c'est fait

`npm run lint` et `npm run build` ne détectent **aucun** des bugs rencontrés
jusqu'ici. Passer par le navigateur (recette détaillée dans `CLAUDE.md`) :

```bash
SHELL_BIN=~/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell
timeout 30 "$SHELL_BIN" --no-sandbox --disable-gpu --hide-scrollbars \
  --user-data-dir=/tmp/cdp-$RANDOM --window-size=1280,1000 --virtual-time-budget=3000 \
  --screenshot=out.png "http://localhost:5173/services" 2>&1 | grep -iE "CONSOLE|error"
```

À contrôler pour chaque page :
- [x] aucune « Maximum update depth exceeded » en console
- [x] aucun débordement horizontal (`scrollWidth <= innerWidth`)
- [x] aucun élément resté à `opacity: 0` après défilement réel
      (défiler avec de vrais évènements molette : Lenis ignore `window.scrollTo`)
- [x] thème clair **et** sombre
- [x] 375px de large

Dernier passage le 2026-08-03 sur `/services`, `/contact`, `/blog`, `/a-propos` :
débordement 0px, 0 élément resté invisible, 0 boucle, 0 erreur console.

---

## 4 bis. Bloc « étape suivante » — FAIT (sur les 6 pages)

`src/components/ui/ProchaineEtape.jsx`.

**Premier essai rejeté** : un composant `PagesSuivantes` listait toutes les
autres pages en fin de page. Verdict client : « on croirait une autre nav » —
et c'était juste, une liste de liens en pied double le menu au lieu de guider.

**Version retenue** : **une seule destination par page**, traitée en bloc
éditorial pleine largeur (grand titre, une phrase, tout le bloc cliquable,
remplissage jaune au survol). Le parcours forme un anneau :

`/` → À propos → Projets → Services → Contact → Projets…
(et `/blog` → À propos)

- Le registre `ETAPES` **ne pointe que vers des pages réellement construites**.
  Les entrées de navigation qui tombent encore sur le NotFound (`/androcrea`,
  `/digits-crea-awards`, `/leadership`, `/expertise`, `/ressources`,
  `/medias`) en sont volontairement absentes : inviter explicitement à cliquer
  vers une page inexistante serait pire que de ne rien proposer.
  **À compléter au fur et à mesure que ces pages existent.**
- Accroches factuelles, pas de promesse inventée.
- Le composant porte sa propre révélation : ne pas l'envelopper dans une
  `RevealSection`.

---

## 5. Reste à trancher

1. **Trame millimétrée sur l'accueil** : retirée sur `/a-propos` seulement.
   La retirer partout ou la garder sur le hero d'accueil ?
2. **`/` et `/projets`** : faut-il leur appliquer heros/variantes/relief ?
   Ce sont les deux pages en CSS fait main — les convertir demande de décider
   si on les passe à Tailwind ou si on duplique les effets en CSS.
3. ~~Réglages d'animation~~ — **calés** : durées **1,95–2,2s** (resserrées de
   ~25% le 2026-08-03 après « augmenter un peu la vitesse »), amplitudes
   220–280px, easing `power2.inOut`. Tout est centralisé dans `VARIANTS`
   (`src/motion/useRevealSection.js`) : un seul endroit à toucher pour
   réajuster. **Ne pas repasser à `expo.out`** — c'est ce qui donnait
   l'impression d'animations instantanées quelle que soit la durée.

---

## 6. Enrichissement de l'accueil — FAIT (2026-08-03)

Trois sections ajoutées, **contenu 100 % réel** repris littéralement du dossier.
Écart assumé à la spec §D.1 (qui fige l'accueil en R00–R07), validé par le client.

| Section | Fichier | Source du contenu |
|---|---|---|
| **Le cap** (vision · mission · ambition + proposition de valeur) | `Home/Cap.jsx` | `infos.txt` §4 et §2.4, mot pour mot |
| **Ce que je prends en charge** | `Home/ServicesApercu.jsx` | `/api/services/` — 25 prestations réelles, rien en dur |
| **Avec qui je travaille** | `Home/PublicCible.jsx` | `infos.txt` §5, six familles et leurs sous-catégories |

Ordre de lecture obtenu : qui je suis → mon cap → mes domaines → ce que je
prends en charge → pour qui → mes projets → derniers articles → étape suivante
→ contact.

**`RecentBlog` (R06) branchée sur `/api/articles/`** : elle était figée sur une
collection vide. La règle spec est conservée — aucune entrée ⇒ section absente
du DOM. Elle a aussi reçu son fond et son espacement, `.recent-blog` n'ayant
jamais eu de règle CSS.

**Non retenu** (proposé, écarté par le client) : compétences et parcours
académique sur l'accueil.

---

## 7. Données de démonstration

`python manage.py seed_demo` / `seed_demo --clear`
(`backend/back/main/management/commands/seed_demo.py`)

Remplit les modèles restés vides — Formation, Partenaire, Distinction,
Experience, Article — pour tester l'affichage. **Commande et non migration** :
les migrations s'exécutent au déploiement, de fausses distinctions ou de faux
partenaires partiraient donc en production sans décision humaine. Tout est
préfixé « DÉMO — » sur le champ visible, volontairement voyant.

> **AVANT MISE EN LIGNE : `python manage.py seed_demo --clear`.**
> À ne pas confondre avec la migration `0006_seed_services_competences`, qui
> peut légitimement vivre en migration : son contenu est la taxonomie littérale
> du dossier, pas de l'invention.

Effets de bord constatés (donc corrigés) : l'aplat « visuel manquant » ne
remplissait pas la zone image des cartes — règle ajoutée dans `ui.css`.

---

## 8. À faire ensuite

- **Page « Partenaires & collaborations »** : signalée manquante par le client
  le 2026-08-03. Le modèle `Partenaire` existe (nom, logo, url, type, visible)
  et il n'y a **pas de route ni de page**. Les logos réels ne sont pas fournis
  (§G item 11) : prévoir un rendu qui tienne sans image.
- Supprimer le projet de test « Mon projet » (conservé sur demande du client
  pour ses essais) avant toute mise en ligne.
- Fournir le CV : le lien `/cv/cv-chabel-ananounon.pdf` du menu renvoie un 404
  (`public/` ne contient que les favicons, `Profil.cv_pdf` est vide).

### Défaut repéré, non traité (hors périmètre demandé)
Sur le hero d'accueil, le bouton « ME CONTACTER » est tronqué en « ME CO » —
défaut **préexistant** dans `home.css`, sans rapport avec cette refonte.
À corriger séparément.
