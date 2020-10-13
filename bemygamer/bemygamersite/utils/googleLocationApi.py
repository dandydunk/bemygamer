import urllib.request
import json

def getLocationFromZipCode(zipCode):
    response = urllib.request.urlopen("https://maps.googleapis.com/maps/api/geocode/json?address={zip}&key=AIzaSyDiitErwfzUOUE-2jWJE0-lMoJb3L6bTLk"
                                        .format(zip=zipCode))
    data = json.loads(response.read())
    if data["status"] != "OK":
        return None

    ret = {}
    for result in data["results"][0]["address_components"]:
        for type in result["types"]:
            if type == "locality":
                ret["city"] = result["long_name"]
                break

            elif type == "administrative_area_level_1":
                ret["state"] = result["long_name"]
                break

            elif type == "country":
                ret["country"] = result["long_name"]
                break

    ret["longitude"] = data["results"][0]["geometry"]["location"]["lng"]
    ret["latitude"] = data["results"][0]["geometry"]["location"]["lat"]
    return ret