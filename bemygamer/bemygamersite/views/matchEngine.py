from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from bemygamersite.models import MemberProfile
from django.shortcuts import render
from bemygamersite.customAuth import login_required_plus
import json
from django.utils.dateparse import parse_date
from django.db import transaction
from django.contrib.auth.models import User
from bemygamersite.utils import utils
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os