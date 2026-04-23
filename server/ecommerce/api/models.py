from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):

    CATEGORY_CHOICES = [
        ("Casual", "Casual"),
        ("Formal", "Formal"),
        ("Party", "Party"),
        ("Gym", "Gym"),
        ("New Arrivals", "New Arrivals"),
        ("Top Selling", "Top Selling"),
        ("General", "General"),
    ]

    name = models.CharField(max_length=200)
    price = models.IntegerField()
    old_price = models.IntegerField(null=True, blank=True)
    description = models.TextField()
    image = models.URLField()
    rating = models.FloatField(default=0)
    # ✅ choices കൊടുത്തതിനാൽ admin-ൽ dropdown ആകും
    category = models.CharField(
        max_length=100,
        choices=CATEGORY_CHOICES,
        default="General"
    )

    def __str__(self):
        return self.name


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, default="Processing")
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Order {self.id} - {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    size = models.CharField(max_length=50, null=True, blank=True)
    color = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"