from django.urls import path
from .views import create_new_credit,get_all_credits,get_credit_byId,update_credit

urlpatterns = [
    path('api/credits/', create_new_credit , name='create_commande'),
    path('api/credits/getall',get_all_credits ,name='get-all-credits'),
    path ('api/credits/getcreditbyid/<int:id>',get_credit_byId,name='get_credit_by_id'),
    path('api/credits/update',update_credit,name='update_credit'),
    ]
