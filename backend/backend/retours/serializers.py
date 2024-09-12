from rest_framework import serializers
from .models import Retour
from commandes.serializers import CommandeSerializer
class RetourSerializer(serializers.ModelSerializer):
    commande = serializers.PrimaryKeyRelatedField(read_only=True)  
    class Meta:
        model = Retour
        fields = ['commande', 'loses']
