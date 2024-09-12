from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView

from . import views

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('add_user/', views.add_user, name='add_user'),
    path('list_users/', views.list_users, name='list_users'),
    path('user_details/<int:user_id>/', views.user_details, name='user_details'),
    path('update_user/<int:pk>/', views.update_user, name='update_user'),

]
