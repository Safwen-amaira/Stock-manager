# Generated by Django 5.1 on 2024-08-18 14:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('commandes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Retour',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('loses', models.FloatField(default=0.0)),
                ('commande', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='retours', to='commandes.commande')),
            ],
        ),
    ]
