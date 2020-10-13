import utils.firebase
import firebase_admin
from firebase_admin import credentials, auth

print("Making a user...")

member = {"email":"email@g.com", "name":"marcus mack", "password":"pass123"}

cred = credentials.Certificate("C:\\Users\\macol\\OneDrive\\clients\\bemygamer\\bemygamer\\bemygamersite\\private\\bemygamerdev-firebase-adminsdk-w6a0j-b3777adbdd.json")
firebase_admin.initialize_app(cred)
try:
    utils.firebase.CreateMember(member)
except firebase_admin._auth_utils.EmailAlreadyExistsError:
    print("User exists")
