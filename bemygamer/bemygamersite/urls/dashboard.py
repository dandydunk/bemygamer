from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls import url
from bemygamersite.views.dashboard import index, dashboard

urlpatterns = [
    path('', index),
    path('dashboard/', dashboard)
]