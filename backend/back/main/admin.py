from django.contrib import admin

from .models import (
    Article,
    Competence,
    Demande,
    Distinction,
    Experience,
    Formation,
    Partenaire,
    Profil,
    Projet,
    ProjetImage,
    ProjetVideo,
    Service,
    Stats,
)


@admin.register(Formation)
class FormationAdmin(admin.ModelAdmin):
    list_display = ('titre', 'programme', 'prochaine_session')
    list_filter = ('programme',)
    prepopulated_fields = {'slug': ('titre',)}


@admin.register(Competence)
class CompetenceAdmin(admin.ModelAdmin):
    list_display = ('libelle', 'categorie', 'niveau', 'ordre')
    list_filter = ('categorie', 'niveau')
    ordering = ('ordre',)


@admin.register(Partenaire)
class PartenaireAdmin(admin.ModelAdmin):
    list_display = ('nom', 'type', 'visible')
    list_filter = ('visible',)


@admin.register(Distinction)
class DistinctionAdmin(admin.ModelAdmin):
    list_display = ('titre', 'structure', 'annee')
    list_filter = ('annee',)


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('poste', 'structure', 'groupe', 'periode_debut', 'periode_fin')
    list_filter = ('groupe',)
    filter_horizontal = ('competences',)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('titre', 'groupe', 'ordre')
    list_filter = ('groupe',)
    prepopulated_fields = {'slug': ('titre',)}
    ordering = ('groupe', 'ordre')


@admin.register(Profil)
class ProfilAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not Profil.objects.exists()


@admin.register(Stats)
class StatsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not Stats.objects.exists()


class ProjetImageInline(admin.TabularInline):
    model = ProjetImage
    extra = 1


class ProjetVideoInline(admin.TabularInline):
    model = ProjetVideo
    extra = 0


@admin.register(Projet)
class ProjetAdmin(admin.ModelAdmin):
    list_display = ('titre', 'nature', 'mis_en_avant', 'ordre')
    list_filter = ('nature', 'mis_en_avant')
    prepopulated_fields = {'slug': ('titre',)}
    filter_horizontal = ('partenaires',)
    inlines = [ProjetImageInline, ProjetVideoInline]


@admin.register(ProjetImage)
class ProjetImageAdmin(admin.ModelAdmin):
    list_display = ('legende', 'contexte', 'projet', 'ordre')
    list_filter = ('contexte',)


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('titre', 'categorie', 'date_publication', 'likes', 'commentaires_ouverts')
    list_filter = ('categorie', 'commentaires_ouverts')
    prepopulated_fields = {'slug': ('titre',)}
    readonly_fields = ('likes',)
    filter_horizontal = ('articles_lies',)


@admin.register(Demande)
class DemandeAdmin(admin.ModelAdmin):
    list_display = ('nom', 'canal', 'objet', 'email', 'recu_le', 'traite')
    list_filter = ('canal', 'traite')
    readonly_fields = (
        'canal', 'segment', 'nom', 'organisation', 'email', 'telephone',
        'objet', 'service', 'date_souhaitee', 'creneau', 'message', 'recu_le',
    )
    ordering = ('-recu_le',)
