from django.db import models
from django.contrib.auth.models import User
from products.models import Product

class Commande(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    client_name = models.CharField(max_length=255)
    client_phone = models.CharField(max_length=20)
    client_address = models.TextField()
    price_sell = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now=True)
    commande_state = models.CharField(max_length=244, default='En_attente')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)  # Updated field type
    loss = models.FloatField(blank=True,default=0,null=True)
    profit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def calculate_profit_or_loss(self):
        if self.commande_state == 'payed':
            product = self.product
            cost_price = product.price_buy
            self.profit = (self.price_sell - (cost_price * self.quantity))
            self.loss = None
        elif self.commande_state == 'retour':
            self.loss = self.loss  # Should be set manually by the user
            self.profit = None
        else:
            self.profit = None
            self.loss = None

    def save(self, *args, **kwargs):
        self.calculate_profit_or_loss()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Commande {self.id} - {self.product.name} ({self.quantity} pcs)"
