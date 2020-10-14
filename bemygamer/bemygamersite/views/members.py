from django.http import JsonResponse
from django.contrib.auth.models import User
from bemygamersite.utils import utils
from django.contrib.auth import authenticate
from django.contrib.auth import login as aLogin
from django.contrib.auth import logout as aLogout
import datetime
from django.views.decorators.csrf import csrf_exempt
import bemygamersite.utils.firebase
import firebase_admin
from bemygamersite import modelHelpers
import json


def getProfileById(request, memberId):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    sessionMemberProfile = modelHelpers.getMemberProfileById(memberId)
    if not sessionMemberProfile:
        return utils.JsonError("the member has no profile.")

    return JsonResponse(modelHelpers.getMemberProfileView(sessionMemberProfile), safe=False)


def getLatestLikedMembers(request):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    sessionMemberProfile = modelHelpers.getMemberProfileById(request.user.id)
    if not sessionMemberProfile:
        return utils.JsonError("the session member has no profile.")

    return JsonResponse(modelHelpers.getLatestLikedMembers(sessionMemberProfile), safe=False)


def getLatestInboxMessages(request):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    sessionMemberProfile = modelHelpers.getMemberProfileById(request.user.id)
    if not sessionMemberProfile:
        return utils.JsonError("the session member has no profile.")

    return JsonResponse(modelHelpers.getLatestInboxMessages(sessionMemberProfile), safe=False)


def getMessages(request, chatMemberId, indexStartId):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    sessionMemberProfile = modelHelpers.getMemberProfileById(request.user.id)
    if not sessionMemberProfile:
        return utils.JsonError("the session member has no profile.")

    otherMemberProfile = modelHelpers.getMemberProfileById(chatMemberId)
    if not otherMemberProfile:
        return utils.JsonError("The member id has no profile")

    return JsonResponse(modelHelpers.getChatMessages(sessionMemberProfile, otherMemberProfile, indexStartId), safe=False)


def publishChatMessage(request, chatMemberId):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    sessionMemberProfile = modelHelpers.getMemberProfileById(request.user.id)
    if not sessionMemberProfile:
        return utils.JsonError("the session member has no profile.")

    otherMemberProfile = modelHelpers.getMemberProfileById(chatMemberId)
    if not otherMemberProfile:
        return utils.JsonError("The member id to inbox doesn't have a profile.")

    modelHelpers.publishChatMessage(sessionMemberProfile, otherMemberProfile)

    return JsonResponse({}, safe=False)


def saveChatMessage(request, chatMemberId, message):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    sessionMemberProfile = modelHelpers.getMemberProfileById(request.user.id)
    if not sessionMemberProfile:
        return utils.JsonError("the session member has no profile.")

    otherMemberProfile = modelHelpers.getMemberProfileById(chatMemberId)
    if not otherMemberProfile:
        return utils.JsonError("The member id to inbox doesn't have a profile.")

    modelHelpers.saveChatMessage(
        message, sessionMemberProfile, otherMemberProfile)

    return JsonResponse({}, safe=False)


def skipMemberAndGetNextMatch(request, memberIdToLike):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    if request.user.id == memberIdToLike:
        return utils.JsonError("You can't skip your own profile.")

    sessionMemberProfile = modelHelpers.getMemberProfileById(request.user.id)
    if not sessionMemberProfile:
        return utils.JsonError("the session member has no profile.")

    otherMemberProfile = modelHelpers.getMemberProfileById(memberIdToLike)
    if not otherMemberProfile:
        return utils.JsonError("The member id to skip doesn't have a profile.")

    modelHelpers.skipMember(sessionMemberProfile, otherMemberProfile)

    sessionMemberProfile = modelHelpers.getMemberProfileById(request.user.id)
    nextMatch = modelHelpers.getNextMatch(sessionMemberProfile)
    return JsonResponse(nextMatch if nextMatch else {}, safe=False)


def likeMemberAndGetNextMatch(request, memberIdToLike):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    if request.user.id == memberIdToLike:
        return utils.JsonError("You can't like your own profile.")

    sessionMemberProfile = modelHelpers.getMemberProfileById(request.user.id)
    if not sessionMemberProfile:
        return utils.JsonError("the session member has no profile.")

    otherMemberProfile = modelHelpers.getMemberProfileById(memberIdToLike)
    if not otherMemberProfile:
        return utils.JsonError("The member id to like doesn't have a profile.")

    modelHelpers.likeMember(sessionMemberProfile, otherMemberProfile)

    sessionMemberProfile = modelHelpers.getMemberProfileById(request.user.id)
    nextMatch = modelHelpers.getNextMatch(sessionMemberProfile)
    return JsonResponse(nextMatch if nextMatch else {}, safe=False)


def getNextMatch(request):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    sessionMemberProfile = modelHelpers.getMemberProfileById(request.user.id)
    if not sessionMemberProfile:
        return utils.JsonError("the session member has no profile.")

    nextMatch = modelHelpers.getNextMatch(sessionMemberProfile)
    return JsonResponse(nextMatch if nextMatch else {}, safe=False)


def logout(request):
    aLogout(request)

    return JsonResponse({}, safe=False)


def saveProfile(request, profile):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    profileJson = json.loads(profile)

    if "isNew" not in profileJson:
        profileJson["isNew"] = False

    ret = modelHelpers.saveProfile(
        profileJson, request.user, profileJson["isNew"])
    return JsonResponse(ret, safe=False)


@csrf_exempt
def savePhotos(request):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    if "photos" not in request.FILES:
        return utils.JsonError("There is not any photos to save.")

    modelHelpers.savePhotos(request.FILES.getlist("photos"), request.user.id)
    return JsonResponse({}, safe=False)


def getSessionMemberPhotos(request):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    photos = modelHelpers.getMemberPhotos(request.user.id)

    return JsonResponse({"photos": photos}, safe=False)


def status(request):
    data = {}
    if request.user.is_authenticated:
        data["isLoggedIn"] = True
        data["profile"] = modelHelpers.getMemberProfileView(
            modelHelpers.getMemberProfileById(request.user.id))

    return JsonResponse(data, safe=False)


def login(request, loginToken):
    user = authenticate(token=loginToken)
    if not user:
        return utils.JsonError("The account could not be found.")

    aLogin(request, user)

    return JsonResponse({"isLoggedIn": True,
                         "profile": modelHelpers.getMemberProfileView(modelHelpers.getMemberProfileById(request.user.id))}, safe=False)


def register(request):
    cleanFields = {}
    ret = utils.ValidateFormFields(request.GET,
                                   {"email": {},
                                    "password": {},
                                    "name": {}},
                                   cleanFields)
    if type(ret) != bool:
        return ret

    try:
        memberId = bemygamersite.utils.firebase.CreateMember(cleanFields)
    except firebase_admin._auth_utils.EmailAlreadyExistsError:
        return utils.JsonErrorField("That email is already registered.", "email")
    except ValueError as err:
        return utils.JsonError("Something went wrong...["+str(err)+"]")

    user = User.objects.create_user(cleanFields["email"],
                                    cleanFields["email"],
                                    cleanFields["password"])
    user.first_name = cleanFields["name"]
    user.save()

    aLogin(request, user)

    return JsonResponse({})
