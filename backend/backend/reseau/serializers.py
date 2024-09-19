from rest_framework import serializers
from .models import Reseau

class ReseauSerializers (serializers.ModelSerializer): 
    class Meta : 
        model = Reseau
        fields= '__all__'
