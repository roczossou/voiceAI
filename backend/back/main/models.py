from django.db import models


class Formation(models.Model):
    class Programme(models.TextChoices):
        ANDROCREA = 'androcrea', 'AndroCréa'
        SITE = 'site', 'Site'

    titre = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    programme = models.CharField(max_length=20, choices=Programme.choices)
    duree = models.CharField(max_length=100)
    format = models.CharField(max_length=100)
    public = models.CharField(max_length=255)
    description = models.TextField()
    prochaine_session = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['titre']

    def __str__(self):
        return self.titre


class Competence(models.Model):
    class Categorie(models.TextChoices):
        DIGITALE = 'digitale', 'Digitale'
        GESTION = 'gestion', 'Gestion'
        TECHNIQUE = 'technique', 'Technique'
        SOFT = 'soft', 'Soft skill'

    class Niveau(models.TextChoices):
        MAITRISE = 'maitrise', 'Maîtrise'
        AVANCE = 'avance', 'Avancé'
        OPERATIONNEL = 'operationnel', 'Opérationnel'

    libelle = models.CharField(max_length=255)
    categorie = models.CharField(max_length=20, choices=Categorie.choices)
    niveau = models.CharField(max_length=20, choices=Niveau.choices, null=True, blank=True)
    ordre = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['ordre']

    def __str__(self):
        return self.libelle


class Partenaire(models.Model):
    nom = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='partenaires/', null=True, blank=True)
    url = models.URLField(blank=True)
    type = models.CharField(max_length=100)
    visible = models.BooleanField(default=True)

    class Meta:
        ordering = ['nom']

    def __str__(self):
        return self.nom


class Experience(models.Model):
    class Groupe(models.TextChoices):
        ACADEMIQUE = 'academique', 'Académique'
        PRO = 'pro', 'Professionnel'
        INSTITUTIONNEL = 'institutionnel', 'Institutionnel'

    groupe = models.CharField(max_length=20, choices=Groupe.choices)
    periode_debut = models.DateField()
    periode_fin = models.DateField(null=True, blank=True)
    structure = models.CharField(max_length=255)
    poste = models.CharField(max_length=255)
    missions = models.JSONField(default=list, blank=True)
    competences = models.ManyToManyField(Competence, blank=True, related_name='experiences')
    resultats = models.TextField(blank=True)

    class Meta:
        ordering = ['-periode_debut']

    def __str__(self):
        return f'{self.poste} — {self.structure}'


class Service(models.Model):
    class Groupe(models.TextChoices):
        SERVICES_DIGITAUX = 'services_digitaux', 'Services digitaux'
        GESTION_DE_PROJET = 'gestion_de_projet', 'Gestion de projet'
        EVENEMENTIEL = 'evenementiel', 'Événementiel'
        FORMATION = 'formation', 'Formation'
        CONSEIL = 'conseil', 'Conseil'

    groupe = models.CharField(max_length=20, choices=Groupe.choices)
    titre = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    ordre = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['groupe', 'ordre']

    def __str__(self):
        return self.titre


class Profil(models.Model):
    """Singleton — contenu unique du site (§G promptDesign.txt)."""

    cv_pdf = models.FileField(upload_to='profil/', null=True, blank=True)

    class Meta:
        verbose_name = 'Profil'
        verbose_name_plural = 'Profil'

    def __str__(self):
        return 'Profil'


class Projet(models.Model):
    class Nature(models.TextChoices):
        PROFESSIONNEL = 'professionnel', 'Professionnel'
        ENTREPRENEURIAL = 'entrepreneurial', 'Entrepreneurial'
        INSTITUTIONNEL = 'institutionnel', 'Institutionnel'

    class Type(models.TextChoices):
        IDENTITE_VISUELLE = 'identite_visuelle', 'Identité visuelle'
        LOGO = 'logo', 'Logo'
        AFFICHE = 'affiche', 'Affiche'
        FLYER = 'flyer', 'Flyer'
        BADGE = 'badge', 'Badge'
        MOCKUP = 'mockup', 'Mockup'
        BANNIERE = 'banniere', 'Bannière'
        CAMPAGNE_DIGITALE = 'campagne_digitale', 'Campagne digitale'
        SITE_WEB = 'site_web', 'Site web'
        SUPPORT_EVENEMENTIEL = 'support_evenementiel', 'Support événementiel'
        REALISATION_TECHNIQUE = 'realisation_technique', 'Réalisation technique'
        PHOTOGRAPHIE = 'photographie', 'Photographie'
        VIDEO = 'video', 'Vidéo'

    titre = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    nature = models.CharField(max_length=20, choices=Nature.choices)
    types = models.JSONField(default=list, blank=True)
    banniere = models.ImageField(upload_to='projets/bannieres/', null=True, blank=True)
    logo = models.ImageField(upload_to='projets/logos/', null=True, blank=True)
    resume = models.TextField(blank=True)
    presentation = models.TextField(blank=True)
    contexte = models.TextField(blank=True)
    objectifs = models.JSONField(default=list, blank=True)
    public_cible = models.CharField(max_length=255, blank=True)
    resultats = models.TextField(blank=True)
    difficultes = models.TextField(blank=True)
    solutions = models.TextField(blank=True)
    partenaires = models.ManyToManyField(Partenaire, blank=True, related_name='projets')
    mis_en_avant = models.BooleanField(default=False)
    ordre = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['ordre']

    def __str__(self):
        return self.titre


class ProjetImage(models.Model):
    class Contexte(models.TextChoices):
        PROJET = 'projet', 'Projet'
        ANDROCREA = 'androcrea', 'AndroCréa'
        DIGITS_CREA_AWARDS = 'digits_crea_awards', "DIGIT'S CRÉA AWARDS"
        GENERAL = 'general', 'Général'

    projet = models.ForeignKey(
        Projet, on_delete=models.CASCADE, related_name='galerie_photos', null=True, blank=True
    )
    contexte = models.CharField(max_length=20, choices=Contexte.choices, default=Contexte.PROJET)
    image = models.ImageField(upload_to='galerie/')
    legende = models.CharField(max_length=255, blank=True)
    ordre = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['ordre']

    def __str__(self):
        return self.legende or f'Photo #{self.pk}'


class ProjetVideo(models.Model):
    projet = models.ForeignKey(
        Projet, on_delete=models.CASCADE, related_name='galerie_videos', null=True, blank=True
    )
    video = models.FileField(upload_to='projets/videos/', null=True, blank=True)
    url_externe = models.URLField(blank=True)
    legende = models.CharField(max_length=255, blank=True)
    ordre = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['ordre']

    def __str__(self):
        return self.legende or f'Vidéo #{self.pk}'


class Article(models.Model):
    class Categorie(models.TextChoices):
        LEADERSHIP = 'leadership', 'Leadership'
        ENTREPRENEURIAT = 'entrepreneuriat', 'Entrepreneuriat'
        INNOVATION = 'innovation', 'Innovation'
        IA = 'intelligence_artificielle', 'Intelligence artificielle'
        COMMUNICATION = 'communication', 'Communication'
        MARKETING = 'marketing', 'Marketing'
        DIGITAL = 'digital', 'Digital'
        DEVELOPPEMENT_PERSONNEL = 'developpement_personnel', 'Développement personnel'
        GESTION_DE_PROJET = 'gestion_de_projet', 'Gestion de projet'
        EVENEMENTIEL = 'evenementiel', 'Événementiel'
        JEUNESSE = 'jeunesse', 'Jeunesse'
        TECHNOLOGIE = 'technologie', 'Technologie'

    titre = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    categorie = models.CharField(max_length=30, choices=Categorie.choices)
    chapo = models.TextField(blank=True)
    corps = models.TextField()
    image = models.ImageField(upload_to='articles/', null=True, blank=True)
    auteur = models.CharField(max_length=255, blank=True)
    date_publication = models.DateField(null=True, blank=True)
    commentaires_ouverts = models.BooleanField(default=False)
    articles_lies = models.ManyToManyField('self', blank=True)
    likes = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-date_publication']

    def __str__(self):
        return self.titre

    @property
    def duree_lecture(self):
        mots = len(self.corps.split())
        return max(1, round(mots / 200))


class Distinction(models.Model):
    titre = models.CharField(max_length=255)
    structure = models.CharField(max_length=255, blank=True)
    annee = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['-annee']

    def __str__(self):
        return self.titre


class Stats(models.Model):
    """Singleton (§F promptDesign.txt) — tous nullables, `null` → affichage `—` sans animation."""

    projets_realises = models.PositiveIntegerField(null=True, blank=True)
    evenements_organises = models.PositiveIntegerField(null=True, blank=True)
    personnes_formees = models.PositiveIntegerField(null=True, blank=True)
    annees_experience = models.PositiveIntegerField(null=True, blank=True)
    partenaires = models.PositiveIntegerField(null=True, blank=True)
    distinctions = models.PositiveIntegerField(null=True, blank=True)
    creations_graphiques = models.PositiveIntegerField(null=True, blank=True)
    conferences = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        verbose_name = 'Statistiques'
        verbose_name_plural = 'Statistiques'

    def __str__(self):
        return 'Statistiques du site'


class Demande(models.Model):
    """Soumissions du formulaire /contact (§F promptDesign.txt) — lecture back-office seule."""

    class Canal(models.TextChoices):
        MESSAGE = 'message', 'Message'
        RDV = 'rdv', 'Rendez-vous'

    canal = models.CharField(max_length=10, choices=Canal.choices)
    segment = models.CharField(max_length=100, blank=True)
    nom = models.CharField(max_length=255)
    organisation = models.CharField(max_length=255, blank=True)
    email = models.EmailField()
    telephone = models.CharField(max_length=50, blank=True)
    objet = models.CharField(max_length=255, blank=True)
    service = models.CharField(max_length=100, blank=True)
    date_souhaitee = models.DateField(null=True, blank=True)
    creneau = models.CharField(max_length=20, blank=True)
    message = models.TextField(blank=True)
    recu_le = models.DateTimeField(auto_now_add=True)
    traite = models.BooleanField(default=False)

    class Meta:
        ordering = ['-recu_le']
        verbose_name = 'Demande'

    def __str__(self):
        return f'{self.get_canal_display()} — {self.nom} ({self.recu_le:%d/%m/%Y})'
