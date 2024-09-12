from django.urls import path
from .views import create_commande, get_all_commandes, get_commande_by_id, update_commande, facebook_webhook

urlpatterns = [
    path('api/commandes/', create_commande, name='create_commande'),
    path('commandes/<int:id>/', get_commande_by_id, name='get_commande_by_id'),
    path('commandes/', get_all_commandes, name='get_all_commandes'),
    path('commandes/update/<int:id>/', update_commande, name='update_commande'),
    path('facebook/webhook/', facebook_webhook, name='facebook_webhook'),

]
