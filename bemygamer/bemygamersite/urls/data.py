from django.urls import path
from bemygamersite.views.data import *

urlpatterns = [
    path("getLocationFromZipCode/<zipCode>/", getLocationFromZipCode)
]