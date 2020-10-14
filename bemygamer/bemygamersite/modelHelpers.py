from bemygamersite.models import *
from django.contrib.gis.geos import GEOSGeometry
from bemygamersite.utils import utils
import html
from datetime import datetime
from django.contrib.gis.geos import Point
from django.conf import settings
import os
from django.utils import timezone
from django.db.models import Q


def getLatestLikedMembers(memberProfile):
    likedMembers = memberProfile.likedMembers
    if not likedMembers or not len(likedMembers):
        return []
        
    count = 0
    ret = []
    for likedMember in likedMembers:
        profile = getMemberProfileById(likedMember)
        if not profile:
            continue
        ret.append(getMemberProfileViewLimited(profile))
        count = count + 1
        if count >= 10:
            break
    return ret


def getLatestInboxMessages(memberProfile):
    messages = InboxMessage.objects.filter(
        (Q(inbox__memberOne__id=memberProfile.member_id) |
         Q(inbox__memberTwo__id=memberProfile.member_id))
        & Q(isPublished=True)).order_by("fromMember_id", "-id")\
        .exclude(fromMember_id=memberProfile.member_id)\
        .distinct("fromMember_id")
    messageList = []
    for message in messages:
        mp = getMemberProfileById(message.fromMember.id)
        mpv = getMemberProfileView(mp)
        messageList.append({"dateTimeSent": message.dateTimeSent,
                            "fromMemberName": message.fromMember.first_name,
                            "fromMemberId": message.fromMember.id,
                            "message": message.message,
                            "profilePhoto": mpv["photos"][0],
                            "id": message.id})
    return messageList


def publishChatMessage(fromMember, otherMember):
    m = getInbox(fromMember, otherMember)
    if not m:
        return

    msg = InboxMessage.objects.filter(
        inbox__id=m.id, fromMember__id=fromMember.member_id, isPublished=False)
    if not len(msg):
        return

    msg = msg[0]
    msg.isPublished = True
    msg.dateTimeSent = timezone.now()
    msg.save()


def getChatMessages(fromMember, otherMember, startId):
    m = getInbox(fromMember, otherMember)
    if not m:
        return []

    messages = InboxMessage.objects.filter(
        inbox__id=m.id, isPublished=True, id__gt=startId).order_by("id")
    messageList = []
    for message in messages:
        messageList.append({"dateTimeSent": message.dateTimeSent,
                            "fromMemberName": message.fromMember.first_name,
                            "fromMemberId": message.fromMember.id,
                            "message": message.message,
                            "id": message.id})
    return messageList


def saveChatMessage(message, fromMember, otherMember):
    if utils.IsEmpty(message):
        return

    message = html.escape(message)
    m = getInbox(fromMember, otherMember)
    if not m:
        m = Inbox()
        m.memberOne = fromMember.member
        m.memberTwo = otherMember.member
        m.save()

    msg = InboxMessage()
    msg.inbox = m
    msg.fromMember = fromMember.member
    msg.message = message
    msg.isPublished = True
    msg.dateTimeSent = timezone.now()
    msg.save()


def getInbox(memberOne, memberTwo):
    m = Inbox.objects.filter(
        memberOne__id=memberOne.member_id, memberTwo__id=memberTwo.member_id)
    if not len(m):
        m = Inbox.objects.filter(
            memberTwo__id=memberOne.member_id, memberOne__id=memberTwo.member_id)
        if not len(m):
            m = None
        else:
            m = m[0]
    else:
        m = m[0]

    return m


def getMemberPhotos(memberId):
    memberDirPath = os.path.join(settings.MEMBERS_DIR, str(memberId))
    memberDirPath = os.path.join(memberDirPath, "photos")
    if not os.path.isdir(memberDirPath):
        return None
    return os.listdir(memberDirPath)


def getNextMatch(sessionMemberProfile):
    memberProfiles = MemberProfile.objects.exclude(
        member_id=sessionMemberProfile.member_id)
    memberProfileDb = None
    for memberProfile in memberProfiles:
        if not sessionMemberProfile.likedMembers:
            memberProfileDb = memberProfile
            break
        elif not str(memberProfile.member_id) in sessionMemberProfile.likedMembers.keys():
            memberProfileDb = memberProfile
            break

    profileView = None
    if memberProfileDb:
        profileView = getMemberProfileView(memberProfileDb)
        profileView["distance"] = utils.CalculateDistanceBetweenMembers(
            sessionMemberProfile.latLong, memberProfileDb.latLong)
        profileView["distance"] = str(profileView["distance"])+" Miles Away"
        profileView["matchPercentage"] = calculateMatch(
            sessionMemberProfile, memberProfileDb)
        profileView["matchPercentage"] = str(
            profileView["matchPercentage"])+"% Compatibility Match"
    return profileView


def likeMember(sessionMemberProfileDb, memberToLikeProfile):
    if not sessionMemberProfileDb.likedMembers:
        sessionMemberProfileDb.likedMembers = {}

    if not memberToLikeProfile.membersWhoLikeYou:
        memberToLikeProfile.membersWhoLikeYou = {}

    sessionMemberProfileDb.likedMembers[memberToLikeProfile.member_id] = {
        "like": True}
    sessionMemberProfileDb.save()

    memberToLikeProfile.membersWhoLikeYou[sessionMemberProfileDb.member_id] = {
        "like": True}
    memberToLikeProfile.save()


def skipMember(sessionMemberProfileDb, memberToLikeProfile):
    if not sessionMemberProfileDb.likedMembers:
        sessionMemberProfileDb.likedMembers = {}

    sessionMemberProfileDb.likedMembers[memberToLikeProfile.member_id] = {
        "like": False}
    sessionMemberProfileDb.save()


def getMemberProfileById(memberId):
    mp = MemberProfile.objects.filter(member_id=memberId)
    return mp[0] if len(mp) else None


def getMemberProfileViewLimited(memberProfileDb):
    if not memberProfileDb:
        return None
    data = {}
    data["name"] = memberProfileDb.member.first_name
    data["gender"] = memberProfileDb.gender
    data["sexualOrientation"] = memberProfileDb.sexualOrientation
    data["memberId"] = memberProfileDb.member_id
    data["age"] = utils.CalculateAge(memberProfileDb.birthDate)
    data["city&state&country"] = memberProfileDb.city+", " + \
        memberProfileDb.state+", "+memberProfileDb.country

    memberDirPath = os.path.join(
        settings.MEMBERS_DIR, str(memberProfileDb.member_id))
    memberDirPath = os.path.join(memberDirPath, "photos")

    data["memberProfilePhoto"] = settings.FILE_SERVER+"members/{memberId}/photos/{photoName}"\
    .format(memberId=memberProfileDb.member_id,
            photoName=os.listdir(memberDirPath)[0])

    return data


def getMemberProfileView(memberProfileDb, sessionMemberProfileDb = None):
    if not memberProfileDb:
        return None
    data = {}
    data["name"] = memberProfileDb.member.first_name
    data["gender"] = memberProfileDb.gender
    data["sexualOrientation"] = memberProfileDb.sexualOrientation
    data["height"] = str(memberProfileDb.heightFeet) + \
        "'" + str(memberProfileDb.heightInches)
    data["weight"] = str(memberProfileDb.weight)+" Pounds"
    data["memberId"] = memberProfileDb.member_id
    data["age"] = utils.CalculateAge(memberProfileDb.birthDate)
    data["city&state&country"] = memberProfileDb.city+", " + \
        memberProfileDb.state+", "+memberProfileDb.country
    data["smokeTabacco"] = "Smokes Tabacco" if memberProfileDb.smokeTabacco else ""
    data["drinkAlcohol"] = "Drinks Alcohol" if memberProfileDb.drinkAlcohol else ""
    data["smokeWeed"] = "Smokes Weed" if memberProfileDb.smokeWeed else ""
    data["haveBodyArt"] = "Has Body Art/Tattoos" if memberProfileDb.haveBodyArt else ""
    data["haveChildren"] = "Has Children" if memberProfileDb.haveChildren else ""
    data["wantChildren"] = "Wants Children" if memberProfileDb.wantChildren else ""
    data["educationLevel"] = "Education Level; "+memberProfileDb.educationLevel
    data["party"] = "Likes to Party" if memberProfileDb.party else ""

    memberDirPath = os.path.join(
        settings.MEMBERS_DIR, str(memberProfileDb.member_id))
    memberDirPath = os.path.join(memberDirPath, "photos")
    photos = []
    for photo in os.listdir(memberDirPath):
        photos.append(settings.FILE_SERVER+"members/{memberId}/photos/{photoName}"
                      .format(memberId=memberProfileDb.member_id, photoName=photo))
    data["photos"] = photos

    if sessionMemberProfileDb:
        data["distance"] = utils.CalculateDistanceBetweenMembers(
            sessionMemberProfileDb.latLong, memberProfileDb.latLong)
        data["distance"] = str(data["distance"])+" Miles Away"
        data["matchPercentage"] = calculateMatch(sessionMemberProfileDb, memberProfileDb)
        data["matchPercentage"] = str(data["matchPercentage"])+"% Compatibility Match"

    return data


def savePhotos(photos, memberId):
    pSaveDir = os.path.join(settings.MEMBERS_DIR, str(memberId))
    if not os.path.isdir(pSaveDir):
        os.mkdir(pSaveDir)

    pSaveDir = os.path.join(pSaveDir, "photos")
    if not os.path.isdir(pSaveDir):
        os.mkdir(pSaveDir)

    for photo in photos:
        r = photo.name.rfind(".")
        if r == -1:
            continue

        photoExtension = photo.name[r+1:]
        nameNoExt = photo.name[0:r]
        count = 1
        photoName = "{name}_{count}.{extension}".format(
            name=nameNoExt, count=count, extension=photoExtension)
        while os.path.isfile(photoName):
            count = count + 1
            photoName = "{name}_{count}.{extension}".format(
                name=nameNoExt, count=count, extension=photoExtension)
        savePath = os.path.join(pSaveDir, photoName)
        utils.HandleUploadedFile(photo, savePath)


def getMemberProfileById(id):
    member = MemberProfile.objects.filter(member_id=id)
    if member:
        return member[0]
    return None


def saveProfile(profile, member, isNew):
    values = ["smokeWeed",
              "weight",
              "heightFeet",
              "heightInches",
              "zip",
              "smokeTabacco",
              "drinkAlcohol",
              "havePiercings",
              "wantChildren",
              "haveBodyArt",
              "haveChildren",
              "party",
              "smokeTabaccoDesired",
              "drinkAlcoholDesired",
              "smokeWeedDesired",
              "havePiercingsDesired",
              "wantChildrenDesired",
              "haveBodyArtDesired",
              "partyDesired",
              "ageOlderDesired",
              "weightDesired",
              "isTallerDesired",
              "distanceDesired",
              "city",
              "state",
              "country",
              "gender",
              "sexualOrientation",
              "educationLevelDesired",
              "educationLevel",
              "birthDate",
              "latLong"]

    print("cleaning the request...")
    for p in profile:
        # print("checking["+p+"]["+str(profile[p])+"]")
        if profile[p] and not isinstance(profile[p], (bool, int, float)):
            profile[p] = html.escape(str(profile[p]))

    print("hasprofile = "+str(hasProfile(member.id)))
    if isNew and hasProfile(member.id):
        return {"error": "profile exists"}

    memberProfile = None
    if not isNew:
        memberProfile = getMemberProfileById(member.id)
    else:
        memberProfile = MemberProfile()
        memberProfile.member = member

    print("checking for a name...")
    if "name" in profile and not utils.IsEmpty(profile["name"]):
        member.first_name = profile["name"]
        member.save()

    print("checking for a birthday...")
    if "rangeBirthDay" in profile and not utils.IsEmpty(profile["rangeBirthDay"]) and "rangeBirthYear" in profile and not utils.IsEmpty(profile["rangeBirthYear"]) and "rangeBirthYear" in profile and not utils.IsEmpty(profile["birthMonth"]):
        profile["birthDate"] = datetime(month=int(profile["birthMonth"]),
                                        year=int(profile["rangeBirthYear"]), day=int(profile["rangeBirthDay"]))

    print("checking for a latitude...")
    if "latitude" in profile and not utils.IsEmpty(profile["latitude"]) and "longitude" in profile and not utils.IsEmpty(profile["longitude"]):
        profile["latLong"] = Point(
            float(profile["latitude"]), float(profile["longitude"]))

    # check if profile object is not corrupted
    print("checking if the profile is corrupted...")
    if isNew:
        for value in values:
            if value not in profile:
                return {"error": "invalid profile object; ["+value+"] is missing"}
    # BooleanField
    print("creating the profile objeect..")
    for value in values:
        if value in profile:
            setattr(memberProfile, value, profile[value])

    print("saving the profile...")
    memberProfile.save()
    return {"success": True}


def calculateMatch(memberInit, memberTwo):
    sessionMemberDb = memberInit
    memberMatchDb = memberTwo
    matchPoints = 0

    if sessionMemberDb.partyDesired is not None and memberMatchDb.party is sessionMemberDb.partyDesired:
        matchPoints = matchPoints + 1

    if sessionMemberDb.educationLevelDesired is not None and memberMatchDb.educationLevel.lower() == sessionMemberDb.educationLevelDesired.lower():
        matchPoints = matchPoints + 1

    if sessionMemberDb.wantChildrenDesired is not None and memberMatchDb.wantChildren is sessionMemberDb.wantChildrenDesired:
        matchPoints = matchPoints + 1

    # children
    if sessionMemberDb.haveChildrenDesired is not None and memberMatchDb.haveChildren is sessionMemberDb.haveChildrenDesired:
        matchPoints = matchPoints + 1

    # piercings
    if sessionMemberDb.havePiercingsDesired is not None and memberMatchDb.havePiercings is sessionMemberDb.havePiercingsDesired:
        matchPoints = matchPoints + 1

    # body art
    if sessionMemberDb.haveBodyArtDesired is not None and memberMatchDb.haveBodyArt is sessionMemberDb.haveBodyArtDesired:
        matchPoints = matchPoints + 1

    # smoke weed point
    if sessionMemberDb.smokeWeedDesired is not None and memberMatchDb.smokeWeed is sessionMemberDb.smokeWeedDesired:
        matchPoints = matchPoints + 1

    # alcohol point
    if sessionMemberDb.drinkAlcoholDesired is not None and memberMatchDb.drinkAlcohol is sessionMemberDb.drinkAlcoholDesired:
        matchPoints = matchPoints + 1

    # tabacco point
    if sessionMemberDb.smokeTabaccoDesired is not None and memberMatchDb.smokeTabacco is sessionMemberDb.smokeTabaccoDesired:
        matchPoints = matchPoints + 1

    # weight point
    if sessionMemberDb.weightDesired is not None:
        if sessionMemberDb.weightDesired and memberMatchDb.weight > sessionMemberDb.weightDesired:
            matchPoints = matchPoints + 1
        elif not sessionMemberDb.weightDesired and memberMatchDb.weight < sessionMemberDb.weightDesired:
            matchPoints = matchPoints + 1

    # height point
    if sessionMemberDb.isTallerDesired is not None:
        st = sessionMemberDb.heightFeet + sessionMemberDb.heightInches
        mt = memberMatchDb.heightFeet + memberMatchDb.heightInches
        if sessionMemberDb.isTallerDesired and mt > st:
            matchPoints = matchPoints + 1
        elif not sessionMemberDb.isTallerDesired and mt < st:
            matchPoints = matchPoints + 1

    # distance point
    distance = utils.CalculateDistanceBetweenMembers(
        sessionMemberDb.latLong, memberMatchDb.latLong)
    if sessionMemberDb.distanceDesired is not None and distance > sessionMemberDb.distanceDesired:
        matchPoints = matchPoints + 1

    # age point, older or younger
    if sessionMemberDb.ageOlderDesired is not None:
        sessionMemberAge = utils.CalculateAge(sessionMemberDb.birthDate)
        memberMatchAge = utils.CalculateAge(memberMatchDb.birthDate)
        if sessionMemberDb.ageOlderDesired and memberMatchAge > sessionMemberAge:
            matchPoints = matchPoints + 1
        elif not sessionMemberDb.ageOlderDesired and memberMatchAge < sessionMemberAge:
            matchPoints = matchPoints + 1

    return round(matchPoints / 13 * 100)


def hasProfile(memberId):
    a = MemberProfile.objects.filter(member_id=memberId)
    if len(a):
        return True
    return False
