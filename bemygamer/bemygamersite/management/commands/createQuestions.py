from django.core.management.base import BaseCommand, CommandError
from bemygamersite.models import InterestCategory, InterestQuestion, InterestQuestionChoice
import urllib.request
import os
import json
from django.contrib.auth.models import User

class Command(BaseCommand):
    def q1(self):
        c = InterestCategory()
        c.name = "What do you prefer?"
        c.save()

        q = InterestQuestion()
        q.question = "Do you smoke cigareets?"
        q.interestCategory = c
        q.save()

        choices = ["Yes", "No", "Sometimes"]
        for choice in choices:
            x = InterestQuestionChoice()
            x.interestQuestion = q
            x.choice = choice
            x.save()


        ##
        q = InterestQuestion()
        q.question = "Do you drink alcohol?"
        q.interestCategory = c
        q.save()

        choices = ["Yes", "No", "Sometimes"]
        for choice in choices:
            x = InterestQuestionChoice()
            x.interestQuestion = q
            x.choice = choice
            x.save()

    def q2(self):
        c = InterestCategory()
        c.name = "Gamer Type"
        c.save()

        q = InterestQuestion()
        q.question = "What consoles do you play?"
        q.interestCategory = c
        q.formType = 1
        q.save()

        choices = ["PC", "Xbox One", "PlayStation 4", "Wii U", "Nintendo Switch"]
        for choice in choices:
            x = InterestQuestionChoice()
            x.interestQuestion = q
            x.choice = choice
            x.save()

        #####
        q = InterestQuestion()
        q.question = "What genre of video games do you prefer?"
        q.interestCategory = c
        q.formType = 1
        q.save()

        choices = ["First Person Shooter", "RPG", "Adventure", 
                   "Puzzle", "MMORPG", "Horror", "Racing", "Fighting",
                   "Sports"]
        for choice in choices:
            x = InterestQuestionChoice()
            x.interestQuestion = q
            x.choice = choice
            x.save()

        ####
        q = InterestQuestion()
        q.question = "How often do you play?"
        q.interestCategory = c
        q.save()

        choices = ["1-2 Hours Per Week", "3-5 Hours Per Week", "Hardcore Gamer", 
                        "When I Get Free Time"]
        for choice in choices:
            x = InterestQuestionChoice()
            x.interestQuestion = q
            x.choice = choice
            x.save()


    def q3(self):
        c = InterestCategory()
        c.name = "Your entertainment preferences."
        c.save()

        q = InterestQuestion()
        q.question = "What genre of movies do you enjoy?"
        q.interestCategory = c
        q.formType
        q.save()

        choices = ["Action", "Horror", "Science Fiction", "Comedygod", "Nintendo Switch"]
        for choice in choices:
            x = InterestQuestionChoice()
            x.interestQuestion = q
            x.choice = choice
            x.save()

    def q4(self):
        c = InterestCategory()
        c.name = ""
        c.save()

        q = InterestQuestion()
        q.question = "What is your relationship status?"
        q.interestCategory = c
        q.formType = 0
        q.save()

        choices = ["Single", "Married", "Taken", "It's complicated"]
        for choice in choices:
            x = InterestQuestionChoice()
            x.interestQuestion = q
            x.choice = choice
            x.save()

        q = InterestQuestion()
        q.question = "Parent Status?"
        q.interestCategory = c
        q.formType = 0
        q.save()

        choices = ["No kids right now", "I want kids", "I have kids", "I don't want kids"]
        for choice in choices:
            x = InterestQuestionChoice()
            x.interestQuestion = q
            x.choice = choice
            x.save()


    def handle(self, *args, **options):
        self.stdout.write("making questions...")
        self.q1()
        self.q2()
        self.q3()
        self.q4()
        
