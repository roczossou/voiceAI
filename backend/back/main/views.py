from rest_framework import viewsets
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.throttling import AnonRateThrottle

from .models import Article, Competence, Experience, Projet, Service, Stats
from .serializers import (
    ArticleDetailSerializer,
    ArticleListSerializer,
    CompetenceSerializer,
    DemandeSerializer,
    ExperienceSerializer,
    ProjetDetailSerializer,
    ProjetListSerializer,
    ServiceSerializer,
    StatsSerializer,
)


class ProjetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Projet.objects.all().prefetch_related(
        'galerie_photos', 'galerie_videos', 'partenaires'
    )
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjetDetailSerializer
        return ProjetListSerializer


class StatsView(RetrieveAPIView):
    serializer_class = StatsSerializer

    def get_object(self):
        return Stats.objects.first() or Stats.objects.create()


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class CompetenceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Competence.objects.all()
    serializer_class = CompetenceSerializer


class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Experience.objects.all().prefetch_related('competences')
    serializer_class = ExperienceSerializer


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.all().prefetch_related('articles_lies')
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ArticleDetailSerializer
        return ArticleListSerializer


class DemandeThrottle(AnonRateThrottle):
    scope = 'demande'


class DemandeCreateView(CreateAPIView):
    serializer_class = DemandeSerializer
    throttle_classes = [DemandeThrottle]
