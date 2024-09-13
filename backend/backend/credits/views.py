from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Credit
from .serializers import CreditSerializers


@api_view(['POST'])
def create_new_credit(request):
    try:
        profitaire = request.data.get('profitaire')
        valeur = int(request.data.get('valeur'))
        is_Money =bool(request.data.get('is_Money'))

        Credit = Credit(
            profitaire=profitaire,
            is_Money=is_Money,
            valeur=request.data.get('valeur'),

        )
        credits.save()

 
        serializer = CreditSerializers(credits)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_all_credits(request):
    credits = Credit.objects.all()
    serializer = CreditSerializers(credits, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# View to get a specific commande by ID
@api_view(['GET'])
def get_credit_byId(request, id):
    try:
        credit = Credit.objects.get(id=id)
        serializer = CreditSerializers(credit)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Credit.DoesNotExist:
        return Response({"error": "Credit is not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_credit(request, id):
    try:
        credit = Credit.objects.get(id=id)
        serializer = CreditSerializers(credit, data=request.data, partial=True)
        if serializer.is_valid():

            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Commande.DoesNotExist:
        return Response({"error": "Credit not found."}, status=status.HTTP_404_NOT_FOUND) 
    
