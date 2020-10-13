from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from bemygamersite.models import Events
from bemygamersite.utils import utils
import datetime

def index(request):
    return render(request, "bemygamersite/events/index.html")

def get(request):
    events = Events.objects.filter(isActive=1)
    eventList = []
    for event in events:
        eventList.append({"id":event.id, "title":event.title, "description":event.description,
                            "startDateTime":utils.FormatDateTime(event.startDateTime),
                            "endDateTime":utils.FormatDateTime(event.endDateTime), 
                            "location":event.location})

    return JsonResponse(eventList, safe=False)

def delete(request, id):
    event = Events.objects.get(id=id)
    if event:
        event.delete()

    return JsonResponse({}, safe=False)

def new(request):
    event = Events()

    event.title = request.GET.get("title", None)
    if utils.IsEmpty(event.title):
        return utils.JsonErrorField("The title is missing.", "title")

    event.title = event.title.strip()

    event.description = request.GET.get("description", None)
    if utils.IsEmpty(event.description):
        return utils.JsonErrorField("The description is missing.", "title")

    event.description = event.description.strip()

    event.location = request.GET.get("location", None)
    event.location = event.location.strip() if event.location is not None else None

    hasStartDate = request.GET.get("hasStartDate", None)
    if utils.IsEmpty(hasStartDate):
        hasStartDate = 0

    try:
        hasStartDate = int(hasStartDate)
    except:
        hasStartDate = 0

    if hasStartDate:
        sMonth = request.GET.get("startMonth", None)
        sYear = request.GET.get("startYear", None)
        sDay = request.GET.get("startDay", None)
        sHour = request.GET.get("startTimeHour", None)
        sMinute = request.GET.get("startTimeMinute", None)
        sAMPM = request.GET.get("startTimeAMPM", None)
        if sAMPM and sAMPM == "pm":
            if sHour is not None:
                sHour = int(sHour)
                sHour = sHour + 12 if sHour != 12 else sHour

        if not sMonth or not sYear or not sDay or not sHour or not sMinute:
            event.startDateTime = None
        else:
            try:
                event.startDateTime = datetime.datetime(int(sYear), int(sMonth), int(sDay), int(sHour), int(sMinute))
            except:
                event.startDateTime = None

        hasEndDate = request.GET.get("hasEndDate", None)
        if utils.IsEmpty(hasEndDate):
            hasEndDate = 0

        try:
            hasEndDate = int(hasEndDate)
        except:
            hasEndDate = 0

        if hasEndDate:
            sMonth = request.GET.get("endMonth", None)
            sYear = request.GET.get("endYear", None)
            sDay = request.GET.get("endDay", None)
            sHour = request.GET.get("endTimeHour", None)
            sMinute = request.GET.get("endTimeMinute", None)
            sAMPM = request.GET.get("endTimeAMPM", None)
            if sAMPM and sAMPM == "pm":
                if sHour is not None:
                    sHour = int(sHour)
                    sHour = sHour + 12 if sHour != 12 else sHour

            if not sMonth or not sYear or not sDay or not sHour or not sMinute:
                event.endDateTime = None
            else:
                try:
                    event.endDateTime = datetime.datetime(int(sYear), int(sMonth), int(sDay), int(sHour), int(sMinute))
                except:
                    event.endDateTime = None
    event.isActive = 1
    event.save()
    return JsonResponse({}, safe=False)