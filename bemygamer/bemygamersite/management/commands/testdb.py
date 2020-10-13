from django.core.management.base import BaseCommand, CommandError
from bemygamersite.models import *
import os
import json
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from django.contrib.gis.geos import GEOSGeometry
from bemygamersite import modelHelpers
from bemygamersite.utils import googleLocationApi
import html

#django.middleware.csrf.get_token(request)
class Command(BaseCommand):
    def handle(self, *args, **options):
        self.stdout.write("test db...")
        print(html.escape("<b>hey</b><script>hey</script>"))

    def m():
        u = MemberProfile.objects.all()
        #self.stdout.write("u1 = "+str(u[0].latLong.x))

        m1 = modelHelpers.calculateMatch(u[0], u[1])
        m2 = modelHelpers.calculateMatch(u[1], u[0])
        self.stdout.write("m1 = "+str(m1))
        self.stdout.write("m2 = "+str(m2))
        self.stdout.write("avg = "+str((m1 + m2) / 2))
