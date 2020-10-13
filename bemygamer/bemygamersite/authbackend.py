from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User
import bemygamersite.utils.firebase
from bemygamersite.models import MemberProfile
from firebase_admin import auth

class AuthBackEnd(BaseBackend):
    def get_user(self, memberId):
        try:
            return User.objects.get(pk=memberId)
        except User.DoesNotExist:
            return None

    def authenticate(self, request, token=None):
        try:
            uid = bemygamersite.utils.firebase.VerifyToken(token)
        except auth.InvalidIdTokenError:
            return None

        if not uid:
            return None
        
        try:
            m = MemberProfile.objects.get(otherId=uid)
            return m.member
        except:
            return None
