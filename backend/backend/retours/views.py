from rest_framework import generics
from .models import Retour
from .serializers import RetourSerializer

class RetourListView(generics.ListCreateAPIView):
    serializer_class = RetourSerializer

    def get_queryset(self):
        queryset = Retour.objects.all()
        # Filter by Commande state 'retour'
        return queryset.filter(commande__state='retour')

class RetourDetailView(generics.RetrieveAPIView):
    queryset = Retour.objects.all()
    serializer_class = RetourSerializer
    lookup_field = 'id'  