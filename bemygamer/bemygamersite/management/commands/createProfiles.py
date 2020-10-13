from django.core.management.base import BaseCommand, CommandError
from bemygamersite.models import *
import urllib.request
import os
import json
from django.contrib.auth.models import User
from random import randint
from django.conf import settings
from django.contrib.gis.geos import Point
from django.utils import timezone
import firebase_admin
import bemygamersite.utils.firebase
from bemygamersite.utils.utils import GetJsonFromFile, HandleUploadedFile
from shutil import copyfile


class Command(BaseCommand):
    cDb = None

    def geta(self, category):
        dbs = self.cDb[category]
        k = []
        d = []
        for i in range(randint(1, len(dbs)-1)):
            randomIndex = 0
            while True:
                randomIndex = randint(0, len(dbs)-1)
                if randomIndex not in k:
                    break
            k.append(randomIndex)
            d.append({"category": category, "value": dbs[randomIndex]})
        return d

    def handle(self, *args, **options):
        if not os.path.isfile(settings.DB_PATH):
            raise Exception("The db was not found.")

        if not os.path.isdir(settings.MEMBERS_DIR):
            raise Exception("The photo save path does not exists.")

        self.cDb = GetJsonFromFile(settings.DB_PATH)
        print("db version["+self.cDb["version"]+"]")

        self.stdout.write("making profiles...")
        response = urllib.request.urlopen(
            "https://randomuser.me/api/?results=20")
        accounts = json.loads(response.read())
        # self.stdout.write("# accounts ["+str(len(data["results"]))+"]")
        for account in accounts["results"]:
            memberInfo = {
                "email": account["email"], "password": "pass12345", "name": account["name"]["first"]}

            memberId = 0
            try:
                memberId = bemygamersite.utils.firebase.CreateMember(
                    memberInfo)
            except firebase_admin._auth_utils.EmailAlreadyExistsError:
                print("User exists...skipping...")
                continue

            print("Make firebase user["+memberId+"]")
            user = User.objects.filter(email=account["email"])
            if user:
                continue
            user = User()
            user.first_name = memberInfo["name"]
            user.last_name = ""
            user.email = memberInfo["email"]
            user.username = memberInfo["email"]
            user.password = memberInfo["password"]
            user.save()
            self.stdout.write("Adding user["+account["email"]+"]...\r\n")

            # profile
            bools = [True, False]
            profile = MemberProfile()
            profile.otherId = memberId
            profile.gender = account["gender"]
            profile.birthDate = account["dob"]["date"]
            profile.heightInches = randint(0, 11)
            profile.sexualOrientation = self.cDb["sexualOrientations"][randint(
                0, len(self.cDb["sexualOrientations"])-1)]
            profile.weight = randint(120, 200)
            profile.heightFeet = randint(4, 7)
            profile.heightInches = randint(0, 11)
            profile.smokeTabacco = bools[randint(0, len(bools)-1)]
            profile.drinkAlcohol = bools[randint(0, len(bools)-1)]
            profile.smokeWeed = bools[randint(0, len(bools)-1)]
            profile.haveBodyArt = bools[randint(0, len(bools)-1)]
            profile.havePiercings = bools[randint(0, len(bools)-1)]
            profile.smokeWeed = bools[randint(0, len(bools)-1)]
            profile.haveChildren = bools[randint(0, len(bools)-1)]
            profile.wantChildren = bools[randint(0, len(bools)-1)]

            ###
            profile.educationLevelDesired = self.cDb["educationLevels"][randint(
                0, len(self.cDb["educationLevels"])-1)]
            profile.ageOlderDesired = bools[randint(0, len(bools)-1)]
            profile.weightDesired = bools[randint(0, len(bools)-1)]
            profile.isTallerDesired = bools[randint(0, len(bools)-1)]
            profile.smokeTabaccoDesired = bools[randint(0, len(bools)-1)]
            profile.drinkAlcoholDesired = bools[randint(0, len(bools)-1)]
            profile.smokeWeedDesired = bools[randint(0, len(bools)-1)]
            profile.haveBodyArtDesired = bools[randint(0, len(bools)-1)]
            profile.havePiercingsDesired = bools[randint(0, len(bools)-1)]
            profile.smokeWeedDesired = bools[randint(0, len(bools)-1)]
            profile.haveChildrenDesired = bools[randint(0, len(bools)-1)]
            profile.wantChildrenDesired = bools[randint(0, len(bools)-1)]
            profile.partyDesired = bools[randint(0, len(bools)-1)]

            profile.party = bools[randint(0, len(bools)-1)]
            profile.member = user
            profile.educationLevel = self.cDb["educationLevels"][randint(
                0, len(self.cDb["educationLevels"])-1)]
            profile.country = account["location"]["country"]
            profile.city = account["location"]["city"]
            profile.state = account["location"]["state"]
            profile.zip = account["location"]["postcode"]
            profile.latLong = Point(float(account["location"]["coordinates"]["longitude"]),
                                    float(account["location"]["coordinates"]["latitude"]))

            profile.attributes = [self.geta("MovieGenres"),
                                  self.geta("gameConsoles"),
                                  self.geta("Sports"),
                                  self.geta("BookGenres"),
                                  self.geta("Food"),
                                  self.geta("Entertainment"),
                                  self.geta("MusicGenres")]

            ###

            pictureUrl = account["picture"]["large"]
            picName = "piowhji."+pictureUrl[pictureUrl.rfind(".")+1:]

            pSaveDir = settings.MEMBERS_DIR
            if not os.path.isdir(pSaveDir):
                os.mkdir(pSaveDir)

            # self.PhotoSavePath + str(user.id) + "\\"
            pSaveDir = os.path.join(pSaveDir, str(user.id))
            if not os.path.isdir(pSaveDir):
                os.mkdir(pSaveDir)

            # self.PhotoSavePath + str(user.id) + "\\"
            pSaveDir = os.path.join(pSaveDir, "photos")
            if not os.path.isdir(pSaveDir):
                os.mkdir(pSaveDir)

            pSavePath = os.path.join(pSaveDir, picName)  # pSaveDir+picName
            self.stdout.write("Downloading pic...")
            picData = urllib.request.urlopen(pictureUrl).read()

            self.stdout.write("Saving pic...")
            pic = open(pSavePath, "wb")
            pic.write(picData)
            pic.close()

            otherPicsDir = settings.OTHER_PICS_DIR

            picPaths = []
            for i in range(10):
                picPath = ""
                while True:
                    picPath = str(randint(1, 101))+".png"
                    if picPath not in picPaths:
                        break
                picPaths.append(picPath)

            for picPath in picPaths:
                pSavePath = os.path.join(pSaveDir, picPath)
                self.stdout.write(pSavePath)
                copyfile(otherPicsDir+picPath, pSavePath)

            picPaths.append(picName)

            photoList = []
            for picPath in picPaths:
                photoList.append({"name": picPath,
                                  "dateTimeUploaded": str(timezone.now()),
                                  "priority": 1 if picPath == picName else 2,
                                  "caption": "poewjer ofiw hjp",
                                  "isEnabled": True})
            profile.photos = photoList
            profile.save()
