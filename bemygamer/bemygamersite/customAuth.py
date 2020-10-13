from django.http import HttpResponseRedirect
from .models import MemberProfile
from django.conf import settings

def login_required_plus(f):
    def wrap(request, *args, **kwargs):
            if not request.user.is_authenticated:
                    return HttpResponseRedirect(settings.LOGIN_URL)
            a = MemberProfile.objects.filter(member_id=request.user.id)
            if len(a) == 0:
                return HttpResponseRedirect("/members/questionsWizard/")
            return f(request, *args, **kwargs)
    wrap.__doc__=f.__doc__
    wrap.__name__=f.__name__
    return wrap