# Generated by Django 5.1 on 2024-08-18 15:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('retours', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='retour',
            name='loses',
            field=models.FloatField(default=6.0),
        ),
    ]
