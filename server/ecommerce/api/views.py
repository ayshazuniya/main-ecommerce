from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import IntegrityError
from .models import Product, Order, OrderItem
from .serializers import ProductSerializer, UserSerializer, OrderSerializer


# ================== ORDERS (PROTECTED) ==================
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])   # ✅ keep protected
def order_list_create(request):
    if request.method == 'GET':
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    if request.method == 'POST':
        data = request.data
        items = data.get('items', [])
        total_price = data.get('totalAmount')

        if not items:
            return Response({"message": "No items in order"}, status=400)

        order = Order.objects.create(
            user=request.user,
            total_price=total_price
        )

        for item in items:
            try:
                product = Product.objects.get(id=item['productId'])
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item['quantity'],
                    size=item.get('size'),
                    color=item.get('color')
                )
            except Product.DoesNotExist:
                continue
        
        return Response(OrderSerializer(order).data, status=201)


# ================== AUTH ==================
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return Response({"message": "Email and password are required"}, status=400)

    try:
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name if name else ""
        )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "user": UserSerializer(user).data
        }, status=201)

    except IntegrityError:
        return Response({"message": "User already exists"}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    user = authenticate(username=email, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "user": UserSerializer(user).data
        })
    return Response({"message": "Invalid credentials"}, status=401)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    request.user.auth_token.delete()
    return Response({"message": "Logged out"})


# ================== PRODUCTS (PUBLIC) ==================
@api_view(['GET'])
@permission_classes([AllowAny])   # ✅ FIXED
def get_products(request):
    category = request.query_params.get('category')
    min_price = request.query_params.get('min_price')
    max_price = request.query_params.get('max_price')

    products = Product.objects.all()

    if category:
        products = products.filter(category__iexact=category.replace('-', ' '))

    if min_price:
        products = products.filter(price__gte=min_price)

    if max_price:
        products = products.filter(price__lte=max_price)

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])   # ✅ FIXED
def get_product(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    serializer = ProductSerializer(product)
    return Response(serializer.data)
from django.contrib.auth.models import User

@api_view(['GET'])
@permission_classes([AllowAny])
def create_admin(request):
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser(
            username="admin",
            email="admin@gmail.com",
            password="admin123"
        )
        return Response({"message": "Admin created"})
    
    return Response({"message": "Admin already exists"})