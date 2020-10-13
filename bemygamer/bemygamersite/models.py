from django.db import models
from django.contrib.auth.models import User
from django.contrib.gis.db import models

class MemberProfile(models.Model):
    member = models.OneToOneField(User, on_delete=models.CASCADE)
    otherId = models.CharField(max_length=255)
    birthDate = models.DateTimeField()
    gender = models.CharField(max_length=255)
    heightFeet = models.IntegerField()
    heightInches = models.IntegerField()
    sexualOrientation = models.CharField(max_length=255)
    weight = models.IntegerField()
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip = models.CharField(max_length=25)
    latLong = models.PointField()
    smokeTabacco = models.BooleanField()
    drinkAlcohol = models.BooleanField()
    smokeWeed = models.BooleanField()
    haveBodyArt = models.BooleanField()
    havePiercings = models.BooleanField()
    haveChildren = models.BooleanField()
    wantChildren = models.BooleanField()
    educationLevel = models.CharField(max_length=255)
    party = models.BooleanField()
    ###
    ageOlderDesired = models.BooleanField(null=True)
    weightDesired = models.BooleanField(null=True)
    isTallerDesired = models.IntegerField(null=True)
    distanceDesired = models.FloatField(null=True)
    smokeTabaccoDesired = models.BooleanField(null=True)
    drinkAlcoholDesired = models.BooleanField(null=True)
    smokeWeedDesired = models.BooleanField(null=True)
    haveBodyArtDesired = models.BooleanField(null=True)
    havePiercingsDesired = models.BooleanField(null=True)
    haveChildrenDesired = models.BooleanField(null=True)
    wantChildrenDesired = models.BooleanField(null=True)
    educationLevelDesired = models.CharField(null=True, max_length=255)
    partyDesired = models.BooleanField(null=True)

    photos = models.JSONField(null=True)
    likedMembers = models.JSONField(null=True)
    membersWhoLikeYou = models.JSONField(null=True)
    attributes = models.JSONField(null=True)

class Inbox(models.Model):
    memberOne = models.ForeignKey(User, on_delete=models.CASCADE)
    memberTwo = models.ForeignKey(User, on_delete=models.CASCADE, related_name="memberTwo")

class InboxMessage(models.Model):
    inbox = models.ForeignKey(Inbox, on_delete=models.CASCADE)
    message = models.TextField()
    fromMember = models.ForeignKey(User, on_delete=models.CASCADE)
    dateTimeSent = models.DateTimeField()
    isPublished = models.BooleanField()

class System(models.Model):
    name = models.CharField(max_length=255)

class MemberAuthorization(models.Model):
    member = models.ForeignKey(User, on_delete=models.CASCADE)
    system = models.ForeignKey(System, on_delete=models.CASCADE)

class Event(models.Model):
    startDateTime = models.DateTimeField(null=True)
    endDateTime = models.DateTimeField(null=True)
    description = models.TextField()
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255, null=True)
    isActive = models.BooleanField()

class BlogPost(models.Model):
    publishedDateTime = models.DateTimeField()
    title = models.CharField(max_length=255)
    content = models.TextField()
    isActive = models.BooleanField()