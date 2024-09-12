from django.db.models.signals import post_save
from django.dispatch import receiver
from commandes.models import Commande
from products.models import Product
from stock.models import Stock
from Sells.models import Sell
from retours.models import Retour  

@receiver(post_save, sender=Commande)
def update_stock_and_create_sell(sender, instance, **kwargs):
    # Check if the commande state is 'selled'
    if instance.commande_state == 'verified':
        # Get the related product and stock
        try:
            stock = Stock.objects.get(product=instance.product)
        except Stock.DoesNotExist:
            # Handle case where stock doesn't exist for the product
            return

        # Update the stock quantity
        stock.quantity -= instance.quantity
        stock.save()

        # Create a record in the Sell model
        Sell.objects.create(
            product=instance.product,
            quantity_selled=instance.quantity
        )

    # Check if the commande state is 'retour'
    if instance.commande_state == 'retour':
        # Check if a Retour instance already exists for this Commande
        if not Retour.objects.filter(commande=instance).exists():
            Retour.objects.create(commande=instance, loses=6)  # Set 'loses' as needed
