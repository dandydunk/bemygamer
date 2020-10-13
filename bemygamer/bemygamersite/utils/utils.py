from django.http import JsonResponse
from datetime import date, datetime
from bemygamersite.models import MemberProfile
import json
from django.contrib.gis.geos import GEOSGeometry
import html

def GetJsonFromFile(file):
    with open(file) as json_file:
        return json.load(json_file)

def IsEmpty(e):
    return True if e == None or len(e.strip()) == 0 else False

def IsStrTooLong(e):
    return True if len(e) > (1024 * 20) else False

def ValidateObject(obj, fields, cleanFields):
    for field in fields:
        if not field in obj:
            return JsonErrorField("This field is required.", field)

        f = obj[field]
        if IsEmpty(f):
            return JsonErrorField("This field is required.", field)

        if IsStrTooLong(f):
            return JsonErrorField("This field has too many characters.", field)
        cleanFields[field] = f.strip()
    return True

def ValidateFormFields(request, fields, cleanFields):
    for field in fields:
        f = request.get(field, None)
        if IsEmpty(f):
            return JsonErrorField("This field is required.", field)

        if IsStrTooLong(f):
            return JsonErrorField("This field has too many characters.", field)
        cleanFields[field] = html.escape(f.strip())
    return True

def JsonNoSessionError():
    return JsonResponse({"error":{"id":"nosession"}}, safe=False)

def JsonError(str):
    return JsonResponse({"error":{"msg":str}})

def JsonErrorField(msg, field):
    return JsonResponse({"error":{"field":field, "msg":msg}})


def GetFileExtension(f):
    return f.split(".")[-1]

def HandleUploadedFile(tmpFile, savedFilePath):
    with open(savedFilePath, 'wb+') as destination:
        for chunk in tmpFile.chunks():
            destination.write(chunk)

def CalculateAge(birthDate): 
    today = date.today() 
    age = today.year - birthDate.year - ((today.month, today.day) < (birthDate.month, birthDate.day))
    return age 

def GetYearFromAge(age):
    today = date.today()
    thisYear = today.year
    return thisYear - age

def FormatDateTime(dt):
    if not dt:
        return None
    return dt.strftime("%b %d, %Y, %I:%M:%S %p")

def GetGenderFromInt(g):
    genders = ["Male", "Female"]
    return genders[g]

def GetSexualOrientationFromInt(g):
    o = ["Straight", "Gay"]
    return o[g]

def CalculateDistanceBetweenMembers(member1Point, member2Point):
    pnt = GEOSGeometry('SRID=4326;POINT({x} {y})'
                       .format(x=member1Point.x, y=member1Point.y))
    pnt2 = GEOSGeometry('SRID=4326;POINT({x} {y})'
                        .format(x=member2Point.x, y=member2Point.y))
    return round(pnt.distance(pnt2) * 100)