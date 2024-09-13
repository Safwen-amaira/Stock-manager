from rest_framework import serializers
from .models import Credit

class CreditSerializers (serializers.ModelSerializer): 
    class Meta : 
        model = Credit
        fields= '__all__'
