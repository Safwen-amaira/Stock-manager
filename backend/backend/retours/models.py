from django.db import models
from commandes.models import Commande  
class Retour(models.Model):
    commande = models.ForeignKey(Commande, on_delete=models.CASCADE, related_name='retours')
    loses = models.FloatField(default=6.0)  

    def __str__(self):
        return f"Retour for Commande {self.commande.id}"
