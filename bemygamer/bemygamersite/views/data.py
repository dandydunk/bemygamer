from django.http import JsonResponse
from bemygamersite import modelHelpers
from bemygamersite.models import *
from bemygamersite.utils import utils
from bemygamersite.utils import googleLocationApi

def getLocationFromZipCode(request, zipCode):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()
        
    d = googleLocationApi.getLocationFromZipCode(zipCode)
    if not d:
        return utils.JsonError("The zip code was not valid.")

    return JsonResponse(d, safe=False)

def getMatch(request):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    modelHelpers.getMatch(request.user.id)
    
    memberMatch = {}

    
    return JsonResponse(memberMatch, safe=False)

def getMembers(request):
    if not request.user.is_authenticated:
        return utils.JsonNoSessionError()

    membersDb = MemberProfile.objects.all()
    membersList = []


    return JsonResponse(membersList, safe=False)