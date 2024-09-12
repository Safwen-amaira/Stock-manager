from rest_framework import serializers
from .models import Stock

class StockSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True) 
    product_barcode = serializers.CharField(source='product.barcode', read_only=True) 

    class Meta:
        model = Stock
        fields = ['id', 'product', 'product_name', 'product_barcode', 'quantity']
