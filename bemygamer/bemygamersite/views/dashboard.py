from django.shortcuts import render
from bemygamersite.customAuth import login_required_plus
from django.conf import settings

def index(request):
    return render(request, settings.TEMPLATE_PAGES+"landing.html")

def dashboard(request):
    return render(request, settings.TEMPLATE_PAGES+"dashboard.html")