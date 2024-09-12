from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)  
    product_category = models.CharField(max_length=255)
    price_buy = models.FloatField()
    price_sell = models.FloatField()
    product_description = models.CharField(max_length=5000)
    barcode = models.CharField(max_length=100, unique=True)  
    product_image1 = models.ImageField(upload_to='product_images/', blank=True, null=True)
    product_image2 = models.ImageField(upload_to='product_images/', blank=True, null=True)
    product_image3 = models.ImageField(upload_to='product_images/', blank=True, null=True)
    product_image4 = models.ImageField(upload_to='product_images/', blank=True, null=True)
    product_image5 = models.ImageField(upload_to='product_images/', blank=True, null=True)
    
    def __str__(self):
        return self.name
