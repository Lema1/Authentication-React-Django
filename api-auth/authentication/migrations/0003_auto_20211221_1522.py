# Generated by Django 3.2.9 on 2021-12-21 18:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_remove_user_login_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='user_login',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user_login',
            name='is_verified',
            field=models.BooleanField(default=False),
        ),
    ]
