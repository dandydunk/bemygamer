# Generated by Django 3.1.2 on 2020-10-03 06:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bemygamersite', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='memberprofile',
            old_name='latitude',
            new_name='latLong',
        ),
        migrations.RemoveField(
            model_name='memberprofile',
            name='longitude',
        ),
    ]
