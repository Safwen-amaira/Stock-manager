# Generated by Django 5.1 on 2024-08-22 16:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('commandes', '0002_remove_commande_commande_state_commande_created_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='commande',
            name='commande_state',
            field=models.CharField(default='En_attente', max_length=244),
        ),
    ]
