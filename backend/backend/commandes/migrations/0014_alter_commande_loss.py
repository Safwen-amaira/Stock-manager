# Generated by Django 5.1 on 2024-09-19 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('commandes', '0013_alter_commande_loss'),
    ]

    operations = [
        migrations.AlterField(
            model_name='commande',
            name='loss',
            field=models.FloatField(blank=True, default=0, null=True),
        ),
    ]
