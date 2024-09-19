from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Reseau
from .serializers import ReseauSerializers


@api_view(['POST'])
def create_new_reseau(request):
    try:
        nom = request.data.get('nom')
        relation = request.data.get('relation')
        is_contract=bool(request.data.get(' is_contract'))
        num_tel = request.data.get('num_tel')
        num_fax = request.data.get('num_fax')
        email = request.data.get('email')
        adresse = request.data.get('adresse')
        webSite = request.data.get('webSite')
        conctract_begin = request.data.get('conctract_begin')
        contract_end = request.data.get('contract_end')
        reseau = Reseau(
            nom=nom,
            is_contract=is_contract,
            relation=relation, 
            num_tel = num_tel, 
            num_fax = num_fax, 
            email = email , 
            adresse = adresse, 
            webSite = webSite, 
            contract_end = contract_end, 
            conctract_begin = conctract_begin , 


        )
        reseau.save()

 
        serializer = ReseauSerializers(reseau)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def get_all_reseau(request):
    reseau = Reseau.objects.all()
    serializer = ReseauSerializers(reseau, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['GET'])
def get_reseau_byId(request, id):
    try:
        reseau = Reseau.objects.get(id=id)
        serializer = ReseauSerializers(reseau)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except reseau.DoesNotExist:
        return Response({"error": "Reseau is not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_reseau (request, id):
    try:
        reseau = Reseau.objects.get(id=id)
        serializer = ReseauSerializers(reseau, data=request.data, partial=True)
        if serializer.is_valid():

            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except reseau.DoesNotExist:
        return Response({"error": "reseau not found."}, status=status.HTTP_404_NOT_FOUND) 
    
