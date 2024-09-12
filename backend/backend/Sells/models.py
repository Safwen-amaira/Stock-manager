from django.db import models
from products.models import Product
from commandes.models import Commande

class Sell(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_selled = models.PositiveIntegerField()
    sell_date = models.DateTimeField(auto_now_add=True)

    @property
    def profit(self):
        try:
            commande = Commande.objects.get(product=self.product)
            return (self.product.price_sell - commande.price_buy) * self.quantity_selled
        except Commande.DoesNotExist:
            return 0  

    def __str__(self):
        return f"{self.product.name} - {self.quantity_selled} units"
