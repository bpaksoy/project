# Generated by Django 5.1 on 2024-11-25 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collegetracker', '0004_user_image_user_major'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='country',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]