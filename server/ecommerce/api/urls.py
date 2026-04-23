from django.urls import path
from . import views
from .views import create_admin


urlpatterns = [
    path('auth/register/', views.register_user),
    path('auth/login/', views.login_user),
    path('auth/register', views.register_user),
    path('auth/login', views.login_user),
    path('auth/logout', views.logout_user),

    path('orders/', views.order_list_create),
    path('orders', views.order_list_create),
    path('products/', views.get_products),

    path('products/<int:id>/', views.get_product),

    path('create-admin/', create_admin),

]
