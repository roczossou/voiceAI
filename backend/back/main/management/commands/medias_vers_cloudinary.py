"""Téléverse sur Cloudinary les fichiers encore stockés en local.

À lancer une fois, après avoir défini CLOUDINARY_URL :

    ../venv/bin/python manage.py medias_vers_cloudinary --dry-run
    ../venv/bin/python manage.py medias_vers_cloudinary

Pourquoi mettre la base à jour plutôt que simplement copier les fichiers :
Cloudinary attribue lui-même le public_id définitif (il peut suffixer un nom
déjà pris), et c'est cette valeur que le champ doit contenir. La commande
téléverse donc via le stockage du champ et réécrit la valeur retournée.

Idempotente : un champ dont la valeur commence déjà par le préfixe Cloudinary
est ignoré, on peut donc relancer sans risque de doublon.
"""

from pathlib import Path

from django.apps import apps
from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand, CommandError
from django.db import models


class Command(BaseCommand):
    help = 'Téléverse les fichiers médias locaux vers Cloudinary et met la base à jour.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run', action='store_true',
            help="N'envoie rien, affiche seulement ce qui serait fait.",
        )

    def handle(self, *args, **options):
        if not settings.USE_CLOUDINARY:
            raise CommandError(
                'CLOUDINARY_URL absent : le stockage local est actif, il n\'y a rien à migrer. '
                'Définir la variable (backend/.env) puis relancer.'
            )

        dry_run = options['dry_run']
        prefix = settings.MEDIA_URL.lstrip('/')
        media_root = Path(settings.MEDIA_ROOT)
        envoyes = ignores = introuvables = 0

        for model in apps.get_app_config('main').get_models():
            champs = [
                f for f in model._meta.get_fields()
                if isinstance(f, models.FileField)
            ]
            if not champs:
                continue

            for objet in model.objects.all():
                for champ in champs:
                    valeur = getattr(objet, champ.name)
                    if not valeur:
                        continue
                    if valeur.name.startswith(prefix):
                        ignores += 1
                        continue

                    chemin = media_root / valeur.name
                    if not chemin.is_file():
                        introuvables += 1
                        self.stderr.write(
                            f'  introuvable en local : {model.__name__}#{objet.pk} '
                            f'{champ.name} → {valeur.name}'
                        )
                        continue

                    if dry_run:
                        self.stdout.write(
                            f'  [simulation] {model.__name__}#{objet.pk} {champ.name} : '
                            f'{valeur.name} ({chemin.stat().st_size // 1024} Ko)'
                        )
                        envoyes += 1
                        continue

                    with chemin.open('rb') as fichier:
                        nouveau_nom = valeur.storage.save(valeur.name, File(fichier))
                    setattr(objet, champ.name, nouveau_nom)
                    objet.save(update_fields=[champ.name])
                    envoyes += 1
                    self.stdout.write(
                        f'  {model.__name__}#{objet.pk} {champ.name} : '
                        f'{valeur.name} → {nouveau_nom}'
                    )

        verbe = 'à envoyer' if dry_run else 'envoyés'
        self.stdout.write(self.style.SUCCESS(
            f'{envoyes} fichier(s) {verbe}, {ignores} déjà sur Cloudinary, '
            f'{introuvables} introuvable(s) en local.'
        ))
