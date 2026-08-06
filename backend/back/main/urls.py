from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ArticleViewSet,
    CompetenceViewSet,
    DemandeCreateView,
    ExperienceViewSet,
    ProjetViewSet,
    ServiceViewSet,
    StatsView,
)

router = DefaultRouter()
router.register('projets', ProjetViewSet, basename='projet')
router.register('articles', ArticleViewSet, basename='article')
router.register('services', ServiceViewSet, basename='service')
router.register('competences', CompetenceViewSet, basename='competence')
router.register('experiences', ExperienceViewSet, basename='experience')

urlpatterns = router.urls + [
    path('stats/', StatsView.as_view(), name='stats'),
    path('demandes/', DemandeCreateView.as_view(), name='demande-create'),
]
