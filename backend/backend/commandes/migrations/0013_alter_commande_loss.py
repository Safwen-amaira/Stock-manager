# Generated by Django 5.1 on 2024-09-19 18:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('commandes', '0012_alter_commande_loss_alter_commande_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='commande',
            name='loss',
            field=models.FloatField(blank=True, default=0),
        ),
    ]
