from django.urls import path
from .views import RetourListView, RetourDetailView

urlpatterns = [
    path('retours/', RetourListView.as_view(), name='retour-list'),
    path('retours/<int:id>/', RetourDetailView.as_view(), name='retour-detail'),  # Ensure to use the correct path parameter
]
