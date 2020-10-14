from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

#path('', views.dashboard.index, name='index'),
urlpatterns = [
    path('members/', include('bemygamersite.urls.members')),
    path('data/', include('bemygamersite.urls.data'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)