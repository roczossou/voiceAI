"""Données de DÉMONSTRATION pour tester l'affichage des modèles encore vides.

    python manage.py seed_demo            # crée les entrées de démo
    python manage.py seed_demo --clear    # les supprime toutes

POURQUOI UNE COMMANDE ET PAS UNE MIGRATION
------------------------------------------
Les migrations s'exécutent automatiquement au déploiement. De fausses
distinctions, de faux partenaires ou de fausses expériences professionnelles
sur le site d'une personne réelle partiraient donc en production sans que
personne ne l'ait décidé — exactement ce que le cahier des charges cherche à
éviter (« un faux chiffre qu'un journaliste ou un bailleur pourrait relever »,
promptDesign.txt §G). Une commande, elle, ne part jamais toute seule.

À NE PAS CONFONDRE avec la migration 0006_seed_services_competences : celle-ci
peut légitimement vivre en migration, car son contenu (services, compétences)
est la taxonomie littérale imposée par le dossier — du vrai contenu, pas de
l'invention.

CONVENTION
----------
Tout ce qui est créé ici est préfixé « DÉMO — » sur son champ visible
principal. C'est volontairement voyant : personne ne doit pouvoir confondre ces
entrées avec du contenu réel, et un simple coup d'œil au site suffit à repérer
qu'il en reste. Les textes ont en revanche des longueurs réalistes, pour que
les grilles et les fiches soient testées dans des conditions crédibles.

AVANT MISE EN LIGNE : lancer `python manage.py seed_demo --clear`.
"""

import datetime

from django.core.management.base import BaseCommand
from django.db import transaction

from main.models import Article, Competence, Distinction, Experience, Formation, Partenaire

PREFIXE = 'DÉMO — '


class Command(BaseCommand):
    help = "Crée (ou supprime avec --clear) des données de démonstration pour les modèles vides."

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Supprime toutes les entrées de démonstration au lieu de les créer.',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options['clear']:
            self._clear()
            return
        self._seed()

    def _clear(self):
        total = 0
        for modele, champ in [
            (Formation, 'titre'), (Partenaire, 'nom'), (Distinction, 'titre'),
            (Experience, 'structure'), (Article, 'titre'),
        ]:
            nb, _ = modele.objects.filter(**{f'{champ}__startswith': PREFIXE}).delete()
            total += nb
        self.stdout.write(self.style.SUCCESS(f'{total} objet(s) de démonstration supprimé(s).'))

    def _seed(self):
        cree = 0

        # --- Formations (catalogue AndroCréa) ---
        formations = [
            ('Design graphique sur mobile', 'androcrea', '4 semaines', 'Présentiel', 'Débutants et créatifs'),
            ('Communication digitale', 'androcrea', '3 semaines', 'Hybride', 'Entrepreneurs et associations'),
            ('Gestion de projet', 'site', '5 jours', 'Distanciel', 'Porteurs de projets'),
        ]
        for titre, programme, duree, format_, public in formations:
            _, ok = Formation.objects.get_or_create(
                slug=f'demo-{titre.lower().replace(" ", "-").replace("é", "e")}',
                defaults={
                    'titre': PREFIXE + titre,
                    'programme': programme,
                    'duree': duree,
                    'format': format_,
                    'public': public,
                    'description': (
                        'Contenu de démonstration destiné à vérifier la mise en page du '
                        'catalogue de formations. Il ne décrit aucune formation réelle.'
                    ),
                    'prochaine_session': datetime.date.today() + datetime.timedelta(days=45),
                },
            )
            cree += int(ok)

        # --- Partenaires (logos non fournis : le rendu doit tenir sans image) ---
        for nom, type_ in [
            ('Structure partenaire A', 'Institution'),
            ('Structure partenaire B', 'Entreprise'),
            ('Structure partenaire C', 'Organisation internationale'),
            ('Structure partenaire D', 'Association'),
        ]:
            _, ok = Partenaire.objects.get_or_create(
                nom=PREFIXE + nom,
                defaults={'type': type_, 'visible': True, 'url': ''},
            )
            cree += int(ok)

        # --- Distinctions ---
        for titre, structure, annee in [
            ('Distinction de démonstration', 'Organisme de démonstration', 2024),
            ('Reconnaissance de démonstration', 'Institution de démonstration', 2023),
            ('Mention de démonstration', 'Programme de démonstration', 2022),
        ]:
            _, ok = Distinction.objects.get_or_create(
                titre=PREFIXE + titre,
                defaults={
                    'structure': structure,
                    'annee': annee,
                    'description': (
                        'Entrée de démonstration servant à valider l’affichage des '
                        'distinctions. Aucune distinction réelle n’est décrite ici.'
                    ),
                },
            )
            cree += int(ok)

        # --- Expériences professionnelles (timeline de /a-propos#parcours) ---
        experiences = [
            ('pro', datetime.date(2022, 1, 1), None, 'Structure de démonstration', 'Poste de démonstration'),
            ('pro', datetime.date(2019, 6, 1), datetime.date(2021, 12, 1), 'Autre structure de démonstration', 'Poste précédent de démonstration'),
            ('institutionnel', datetime.date(2021, 3, 1), None, 'Mandat de démonstration', 'Fonction de démonstration'),
        ]
        competences = list(Competence.objects.all()[:4])
        for groupe, debut, fin, structure, poste in experiences:
            exp, ok = Experience.objects.get_or_create(
                structure=PREFIXE + structure,
                defaults={
                    'groupe': groupe,
                    'periode_debut': debut,
                    'periode_fin': fin,
                    'poste': poste,
                    'missions': [
                        'Mission de démonstration destinée à tester la liste à puces.',
                        'Seconde mission de démonstration, un peu plus longue, pour vérifier '
                        'le retour à la ligne dans la colonne de droite.',
                    ],
                    'resultats': (
                        'Résultats de démonstration : ce texte n’a qu’un but de mise en page.'
                    ),
                },
            )
            if ok:
                exp.competences.set(competences)
                cree += 1

        # --- Articles de blog ---
        articles = [
            ('Premier article de démonstration', 'leadership'),
            ('Deuxième article de démonstration', 'entrepreneuriat'),
            ('Troisième article de démonstration', 'innovation'),
            ('Quatrième article de démonstration', 'digital'),
        ]
        corps = '\n\n'.join([
            'Ce texte est un contenu de démonstration. Il sert uniquement à vérifier '
            'la lisibilité du corps d’article : longueur de ligne, interlignage, et '
            'comportement de la colonne de lecture.',
            'Un deuxième paragraphe permet de contrôler l’espacement vertical entre '
            'les blocs, ainsi que le calcul automatique de la durée de lecture, qui '
            'se base sur le nombre de mots à raison de deux cents mots par minute.',
            'Un troisième paragraphe complète l’ensemble afin que la fiche article '
            'soit testée avec un volume de texte proche d’une publication réelle.',
        ])
        for i, (titre, categorie) in enumerate(articles):
            _, ok = Article.objects.get_or_create(
                slug=f'demo-article-{i + 1}',
                defaults={
                    'titre': PREFIXE + titre,
                    'categorie': categorie,
                    'chapo': (
                        'Chapô de démonstration : une ou deux phrases qui résument '
                        'l’article et testent l’affichage de la carte.'
                    ),
                    'corps': corps,
                    'auteur': 'Chabel ANANOUNON',
                    'date_publication': datetime.date.today() - datetime.timedelta(days=7 * i),
                },
            )
            cree += int(ok)

        self.stdout.write(self.style.SUCCESS(f'{cree} objet(s) de démonstration créé(s).'))
        self.stdout.write(self.style.WARNING(
            'Rappel : lancer « manage.py seed_demo --clear » avant toute mise en ligne.'
        ))
