from django.db import migrations
from django.utils.text import slugify

SERVICES = {
    'services_digitaux': [
        'Design graphique', 'Identité visuelle', 'Branding', 'Création de contenu',
        'Communication digitale', 'Supports de communication',
    ],
    'gestion_de_projet': [
        'Élaboration de projets', 'Planification', 'Coordination', 'Suivi', 'Évaluation',
    ],
    'evenementiel': [
        "Organisation d'événements", 'Planification', 'Coordination générale',
        'Gestion logistique', 'Accompagnement',
    ],
    'formation': [
        'Design graphique mobile', 'Communication digitale', 'Gestion de projet',
        'Leadership', 'Créativité',
    ],
    'conseil': [
        'Stratégie de communication', 'Branding', 'Positionnement', 'Développement de projets',
    ],
}

COMPETENCES = {
    'digitale': [
        'Design graphique', 'Branding', 'Communication digitale', 'Création de contenu',
        'Community Management', 'Marketing digital', 'Stratégie digitale',
    ],
    'gestion': [
        'Gestion de projet', "Gestion d'équipe", 'Organisation', 'Planification',
        'Coordination', 'Leadership',
    ],
    'technique': [
        'Maintenance industrielle', 'Électricité industrielle', 'Photovoltaïque',
        'Automatisation', 'Diagnostic industriel',
    ],
    'soft': [
        'Créativité', 'Adaptabilité', 'Résolution de problèmes', "Esprit d'équipe",
        'Communication', 'Prise de parole', "Esprit d'initiative",
    ],
}


def seed(apps, schema_editor):
    Service = apps.get_model('main', 'Service')
    Competence = apps.get_model('main', 'Competence')

    seen_slugs = set()
    for groupe, titres in SERVICES.items():
        for ordre, titre in enumerate(titres):
            base = slugify(f'{groupe}-{titre}')
            slug = base
            suffix = 2
            while slug in seen_slugs:
                slug = f'{base}-{suffix}'
                suffix += 1
            seen_slugs.add(slug)
            Service.objects.create(groupe=groupe, titre=titre, slug=slug, ordre=ordre)

    for categorie, libelles in COMPETENCES.items():
        for ordre, libelle in enumerate(libelles):
            Competence.objects.create(libelle=libelle, categorie=categorie, niveau=None, ordre=ordre)


def unseed(apps, schema_editor):
    apps.get_model('main', 'Service').objects.all().delete()
    apps.get_model('main', 'Competence').objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_demande'),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
