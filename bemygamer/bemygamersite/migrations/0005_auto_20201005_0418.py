# Generated by Django 3.1.2 on 2020-10-05 11:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bemygamersite', '0004_memberprofile_otherid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='memberprofile',
            name='educationLevel',
            field=models.CharField(default=None, max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='memberprofile',
            name='gender',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='memberprofile',
            name='sexualOrientation',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='memberprofile',
            name='weight',
            field=models.CharField(max_length=255),
        ),
        migrations.CreateModel(
            name='MemberAttribute',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('value', models.CharField(max_length=255)),
                ('member', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
