from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .models import Sell
from .serializers import SellSerializer

class SellListAPIView(APIView):
    def get(self, request):
        sells = Sell.objects.all()
        serializer = SellSerializer(sells, many=True)
        return Response({'sells': serializer.data}, status=status.HTTP_200_OK)


# Retrieve a single sell by ID
class SellDetailAPIView(generics.RetrieveAPIView):
    queryset = Sell.objects.all()
    serializer_class = SellSerializer
