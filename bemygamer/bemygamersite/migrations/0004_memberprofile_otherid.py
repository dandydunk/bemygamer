# Generated by Django 3.1.2 on 2020-10-03 11:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bemygamersite', '0003_auto_20201002_2351'),
    ]

    operations = [
        migrations.AddField(
            model_name='memberprofile',
            name='otherId',
            field=models.CharField(default=123, max_length=255),
            preserve_default=False,
        ),
    ]
