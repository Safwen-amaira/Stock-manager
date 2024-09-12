from django.urls import path
from .views import SellListAPIView, SellDetailAPIView

urlpatterns = [
    path('sells/', SellListAPIView.as_view(), name='sell-list'),
    path('sells/details/<int:pk>/', SellDetailAPIView.as_view(), name='sell-detail'),
]
