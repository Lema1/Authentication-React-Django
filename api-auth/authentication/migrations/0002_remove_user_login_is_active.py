# Generated by Django 3.2.9 on 2021-11-25 17:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user_login',
            name='is_active',
        ),
    ]
