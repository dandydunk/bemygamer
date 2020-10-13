from django.apps import AppConfig
import firebase_admin
from firebase_admin import credentials, auth
import bemygamersite
import os

class BemygamersiteConfig(AppConfig):
    name = 'bemygamersite'
    
    def ready(self):
        p = os.path.dirname(bemygamersite.__file__) + "\\private\\bemygamerdev-firebase-adminsdk-w6a0j-b3777adbdd.json"
        print("Setting up firebase config...")
        cred = credentials.Certificate(p)
        firebase_admin.initialize_app(cred)
