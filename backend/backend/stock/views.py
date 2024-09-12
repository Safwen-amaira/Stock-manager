from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods
from django.core import serializers
import json

from .models import Stock
from products.models import Product

class StockListCreateView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(require_http_methods(["GET", "POST"]))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        try:
            stock_list = Stock.objects.all()
            stock_data = serializers.serialize('json', stock_list, use_natural_primary_keys=True)
            return JsonResponse({'stock': json.loads(stock_data)}, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            product_id = data.get('productId')
            barcode = data.get('barcode')
            quantity = data.get('quantity')
            price = data.get('price')

            if not all([product_id, barcode, quantity, price]):
                return JsonResponse({'error': 'All fields are required'}, status=400)

            product = Product.objects.get(id=product_id, barcode=barcode)
            stock, created = Stock.objects.get_or_create(product=product)

            if not created:
                stock.quantity += int(quantity)
            else:
                stock.quantity = quantity  # Set the quantity if it's a new stock

            stock.save()

            return JsonResponse({'success': True, 'stockItem': {
                'id': stock.id,
                'product': {
                    'id': product.id,
                    'name': product.name,
                    'barcode': product.barcode,
                    'price': price,
                },
                'quantity': stock.quantity,
                'updated_at': stock.updated_at,
            }})
        except Product.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

class StockUpdateView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(require_http_methods(["PUT"]))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        stock_id = kwargs.get('pk')
        try:
            data = json.loads(request.body)
            quantity = data.get('quantity')
            if quantity is None:
                return JsonResponse({'error': 'Quantity is required'}, status=400)

            stock = Stock.objects.get(pk=stock_id)
            stock.quantity = quantity
            stock.updated_at = data.get('updated_at', stock.updated_at.isoformat())  # Use provided updated_at or current

            stock.save()

            return JsonResponse({
                'id': stock.id,
                'product': {
                    'name': stock.product.name,
                    'barcode': stock.product.barcode
                },
                'quantity': stock.quantity,
                'price_sell': stock.product.price_sell,
                'updated_at': stock.updated_at.isoformat()
            })
        except Stock.DoesNotExist:
            return JsonResponse({'error': 'Stock item not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

class StockDetailView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(require_http_methods(["GET"]))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        stock_id = kwargs.get('pk')
        try:
            stock = Stock.objects.get(pk=stock_id)
            return JsonResponse({
                'id': stock.id,
                'product': {
                    'name': stock.product.name,
                    'barcode': stock.product.barcode
                },
                'quantity': stock.quantity,
                'price_sell': stock.product.price_sell,
                'updated_at': stock.updated_at.isoformat()
            })
        except Stock.DoesNotExist:
            return JsonResponse({'error': 'Stock item not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
