"""
URL configuration for back project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import re

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('main.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # Les visuels sont téléversés depuis l'admin *après* le démarrage : WhiteNoise
    # (qui indexe les fichiers au boot) ne peut pas les servir. django.views.static
    # les sert à la demande — acceptable au volume d'un portfolio ; si le trafic
    # image grandit, passer à un stockage objet (S3/Cloudinary) plutôt qu'à autre chose.
    urlpatterns += [
        re_path(
            r'^%s(?P<path>.*)$' % re.escape(settings.MEDIA_URL.lstrip('/')),
            serve,
            {'document_root': settings.MEDIA_ROOT},
        ),
    ]
