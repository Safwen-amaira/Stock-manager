from rest_framework import serializers
from .models import Sell

class SellSerializer(serializers.ModelSerializer):
    profit = serializers.ReadOnlyField()

    class Meta:
        model = Sell
        fields = '__all__'
