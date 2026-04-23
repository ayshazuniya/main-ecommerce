from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, CartItem, Order, OrderItem

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name')
    class Meta:
        model = User
        fields = ['id', 'name', 'email']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='product.name', read_only=True)
    images = serializers.SerializerMethodField()
    price = serializers.IntegerField(source='product.price', read_only=True)
    order_item = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'title', 'price', 'images', 'order_item']

    def get_images(self, obj):
        return [obj.product.image]
    
    def get_order_item(self, obj):
        return {'size': obj.size, 'color': obj.color, 'quantity': obj.quantity}

class OrderSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    totalAmount = serializers.DecimalField(source='total_price', max_digits=10, decimal_places=2, read_only=True)
    products = OrderItemSerializer(many=True, source='items', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'totalAmount', 'status', 'createdAt', 'products']
