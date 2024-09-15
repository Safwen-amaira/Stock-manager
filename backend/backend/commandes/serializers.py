from rest_framework import serializers
from .models import Commande

class CommandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commande
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
