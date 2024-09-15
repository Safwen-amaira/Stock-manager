from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    path('api/', include('commandes.urls')), 
    path('api/', include('stock.urls')), 
    path('api/', include('Sells.urls')), 
    path('api/', include('retours.urls')), 
    path('api/', include('accounts.urls')),
    path ('api/', include('credits.urls')),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),

    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
