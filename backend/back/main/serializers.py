import time

from rest_framework import serializers

from .models import (
    Article, Competence, Demande, Experience, Partenaire, Projet, ProjetImage, ProjetVideo,
    Service, Stats,
)


class StatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stats
        fields = [
            'projets_realises', 'evenements_organises', 'personnes_formees',
            'annees_experience', 'partenaires', 'distinctions',
            'creations_graphiques', 'conferences',
        ]


class PartenaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partenaire
        fields = ['id', 'nom', 'logo', 'url', 'type']


class ProjetImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjetImage
        fields = ['id', 'image', 'legende', 'ordre']


class ProjetVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjetVideo
        fields = ['id', 'video', 'url_externe', 'legende', 'ordre']


class ProjetListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projet
        fields = [
            'id', 'titre', 'slug', 'nature', 'types',
            'banniere', 'logo', 'resume', 'mis_en_avant', 'ordre',
        ]


class ProjetDetailSerializer(serializers.ModelSerializer):
    galerie_photos = ProjetImageSerializer(many=True, read_only=True)
    galerie_videos = ProjetVideoSerializer(many=True, read_only=True)
    partenaires = PartenaireSerializer(many=True, read_only=True)

    class Meta:
        model = Projet
        fields = [
            'id', 'titre', 'slug', 'nature', 'types',
            'banniere', 'logo', 'resume', 'presentation', 'contexte',
            'objectifs', 'public_cible', 'resultats', 'difficultes', 'solutions',
            'galerie_photos', 'galerie_videos', 'partenaires',
            'mis_en_avant', 'ordre',
        ]


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'groupe', 'titre', 'slug', 'ordre']


class CompetenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competence
        fields = ['id', 'libelle', 'categorie', 'niveau', 'ordre']


class ExperienceSerializer(serializers.ModelSerializer):
    competences = CompetenceSerializer(many=True, read_only=True)

    class Meta:
        model = Experience
        fields = [
            'id', 'groupe', 'periode_debut', 'periode_fin', 'structure', 'poste',
            'missions', 'competences', 'resultats',
        ]


class ArticleListSerializer(serializers.ModelSerializer):
    duree_lecture = serializers.ReadOnlyField()

    class Meta:
        model = Article
        fields = [
            'id', 'titre', 'slug', 'categorie', 'chapo', 'image',
            'auteur', 'date_publication', 'duree_lecture', 'likes',
        ]


class ArticleDetailSerializer(serializers.ModelSerializer):
    duree_lecture = serializers.ReadOnlyField()
    articles_lies = ArticleListSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = [
            'id', 'titre', 'slug', 'categorie', 'chapo', 'corps', 'image',
            'auteur', 'date_publication', 'duree_lecture', 'commentaires_ouverts',
            'articles_lies', 'likes',
        ]


class DemandeSerializer(serializers.ModelSerializer):
    _gotcha = serializers.CharField(required=False, allow_blank=True, write_only=True)
    _rendu_le = serializers.FloatField(write_only=True)

    class Meta:
        model = Demande
        fields = [
            'canal', 'segment', 'nom', 'organisation', 'email', 'telephone',
            'objet', 'service', 'date_souhaitee', 'creneau', 'message',
            '_gotcha', '_rendu_le',
        ]

    def validate__gotcha(self, value):
        if value:
            raise serializers.ValidationError('Requête rejetée.')
        return value

    def validate__rendu_le(self, value):
        elapsed = time.time() - value
        if elapsed < 3 or elapsed > 3600:
            raise serializers.ValidationError('Requête rejetée.')
        return value

    def create(self, validated_data):
        validated_data.pop('_gotcha', None)
        validated_data.pop('_rendu_le', None)
        return Demande.objects.create(**validated_data)
