from django.urls import path
from .views import create_new_reseau,get_all_reseau,get_reseau_byId,update_reseau

urlpatterns = [
    path('api/reseau/', create_new_reseau , name='create_reseau'),
    path('api/reseau/getall',get_all_reseau ,name='get-all-reseau'),
    path ('api/reseau/getreseaubyid/<int:id>',get_reseau_byId,name='get_reseau_byId'),
    path('api/reseau/update',update_reseau,name='update_reseau'),
    ]
