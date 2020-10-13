import firebase_admin
from firebase_admin import credentials, auth

def VerifyToken(token):
    decoded_token = auth.verify_id_token(token)
    return decoded_token['uid']

def CreateMember(member):
    user = auth.create_user(
                    email=member["email"],
                    email_verified=True,
                    password=member["password"],
                    display_name=member["name"],
                    disabled=False)
    return user.uid
    #print('Sucessfully created new user: {0}'.format(user.uid))