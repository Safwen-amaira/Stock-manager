from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Commande, Product
from .serializers import CommandeSerializer
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
from stock.models import Stock  
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Commande, Product
from .serializers import CommandeSerializer

from django.contrib.auth.models import User
@api_view(['POST'])

def create_commande(request):

    try:
        product_id = request.data.get('product')
        quantity = request.data.get('quantity')

        if not quantity:
            return Response({"error": "Quantity is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(quantity)
        except ValueError:
            return Response({"error": "Invalid quantity format."}, status=status.HTTP_400_BAD_REQUEST)

        if quantity <= 0:
            return Response({"error": "Quantity must be a positive number."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
            stock = Stock.objects.get(product=product)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_400_BAD_REQUEST)
        except Stock.DoesNotExist:
            return Response({"error": "Stock record not found."}, status=status.HTTP_400_BAD_REQUEST)

        if stock.quantity < quantity:
            return Response({"error": "Not enough stock available."}, status=status.HTTP_400_BAD_REQUEST)

        commande = Commande(
            product=product,
            quantity=quantity,
            client_name=request.data.get('client_name'),
            client_phone=request.data.get('client_phone'),
            client_address=request.data.get('client_address'),
            price_sell=request.data.get('price_sell'),
            commande_state=request.data.get('commande_state', 'Pending'),
            user=request.user,
            loss=request.data.get('loss')
        )
        commande.save()

        stock.quantity -= quantity
        stock.save()

        serializer = CommandeSerializer(commande)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_all_commandes(request):
    commandes = Commande.objects.all()
    serializer = CommandeSerializer(commandes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# View to get a specific commande by ID
@api_view(['GET'])
def get_commande_by_id(request, id):
    try:
        commande = Commande.objects.get(id=id)
        serializer = CommandeSerializer(commande)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Commande.DoesNotExist:
        return Response({"error": "Commande not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_commande(request, id):
    try:
        commande = Commande.objects.get(id=id)
        serializer = CommandeSerializer(commande, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Commande.DoesNotExist:
        return Response({"error": "Commande not found."}, status=status.HTTP_404_NOT_FOUND) 
    
@csrf_exempt
@api_view(['GET', 'POST'])
def facebook_webhook(request):
    if request.method == 'GET':
        # Facebook verification
        if request.GET.get('hub.mode') == 'subscribe' and request.GET.get('hub.verify_token') == settings.FACEBOOK_VERIFY_TOKEN:
            return Response(request.GET.get('hub.challenge'))
        return Response({'error': 'Invalid verification token'}, status=status.HTTP_403_FORBIDDEN)

    elif request.method == 'POST':
        # Handle incoming messages
        data = json.loads(request.body.decode('utf-8'))
        process_message(data)
        return Response({'status': 'ok'})

def process_message(data):
    for entry in data.get('entry', []):
        for messaging_event in entry.get('messaging', []):
            sender_id = messaging_event.get('sender', {}).get('id')
            message_text = messaging_event.get('message', {}).get('text')
            
            # Example: Create a command if a specific message is received
            if message_text and 'order' in message_text.lower():
                create_commande_from_message(sender_id, message_text)

def create_commande_from_message(sender_id, message_text):
    # Example implementation - You need to parse the message and create a Commande
    try:
        # Extract relevant information from the message
        product_id = extract_product_id_from_message(message_text)
        quantity = extract_quantity_from_message(message_text)
        client_name = extract_client_name_from_message(message_text)
        client_phone = extract_client_phone_from_message(message_text)
        client_address = extract_client_address_from_message(message_text)
        price_sell = extract_price_sell_from_message(message_text)
        
        product = Product.objects.get(id=product_id)
        stock = Stock.objects.get(product=product)

        if stock.quantity < quantity:
            # Notify via Facebook or handle the situation
            return
        
        commande = Commande(
            product=product,
            quantity=quantity,
            client_name=client_name,
            client_phone=client_phone,
            client_address=client_address,
            price_sell=price_sell,
            commande_state='En_attente'
        )
        commande.save()

        stock.quantity -= quantity
        stock.save()

    except Product.DoesNotExist:
        # Handle product not found
        pass
    except Stock.DoesNotExist:
        # Handle stock not found
        pass
    except Exception as e:
        # Handle other errors
        pass

def extract_product_id_from_message(message_text):
    # Implement extraction logic
    return 1

def extract_quantity_from_message(message_text):
    # Implement extraction logic
    return 1

def extract_client_name_from_message(message_text):
    # Implement extraction logic
    return 'Client Name'

def extract_client_phone_from_message(message_text):
    # Implement extraction logic
    return '1234567890'

def extract_client_address_from_message(message_text):
    # Implement extraction logic
    return 'Client Address'

def extract_price_sell_from_message(message_text):
    # Implement extraction logic
    return 10.0
