"""Sélection du stockage fichier par champ.

Cloudinary sépare ses ressources en trois types — image, video, raw — et sert
chacune sur une URL différente. Le stockage par défaut (settings.STORAGES) ne
couvre donc que les images ; les deux fonctions ci-dessous sont passées en
`storage=` sur les champs qui n'en sont pas.

Ce sont des callables, pas des instances : ils sont évalués à chaque accès au
champ, donc le repli sur le disque local reste effectif en développement quand
CLOUDINARY_URL n'est pas défini, sans qu'une migration soit nécessaire.
"""

from django.conf import settings
from django.core.files.storage import FileSystemStorage


def video_storage():
    """Vidéos de projet (ressource Cloudinary de type « video »)."""
    if not settings.USE_CLOUDINARY:
        return FileSystemStorage()
    from cloudinary_storage.storage import VideoMediaCloudinaryStorage
    return VideoMediaCloudinaryStorage()


def raw_storage():
    """Documents — le CV PDF (ressource Cloudinary de type « raw »)."""
    if not settings.USE_CLOUDINARY:
        return FileSystemStorage()
    from cloudinary_storage.storage import RawMediaCloudinaryStorage
    return RawMediaCloudinaryStorage()
