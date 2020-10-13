from django.conf import settings

def appSettings(request):
    return {'appVersion': settings.APP_VERSION,
            'template':settings.TEMPLATE_PAGES}