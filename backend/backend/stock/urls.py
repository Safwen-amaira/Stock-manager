from django.urls import path
from .views import StockListCreateView, StockUpdateView, StockDetailView

urlpatterns = [
    path('stock/', StockListCreateView.as_view(), name='stock-list-create'),
    path('stock/<int:pk>/', StockUpdateView.as_view(), name='stock-update'),  # New URL for updating
    path('stock/<int:pk>/detail/', StockDetailView.as_view(), name='stock-detail'),
]
