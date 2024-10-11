from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import Usuario, Proveedor, Categoria, Producto, MetodoPago, OrdenCompra, Reporte

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model=Usuario
        #fields=('nombre','apellido','telefono')
        fields='__all__'
  
class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Proveedor
        fields='__all__'
  
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model=Categoria
        fields='__all__'

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Producto
        fields='__all__'

class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model=MetodoPago
        fields='__all__'
        
class OrdenCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model=OrdenCompra
        fields='__all__'
        
class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Reporte
        fields='__all__'

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']