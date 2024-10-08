from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import Usuario, Rol, Permiso, UsuarioEmpresa, Proveedor, Cliente, Chatbot, Interaccion, Categoria, Producto, MetodoPago, OrdenCompra, Carrito, Pedido, Reporte

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model=Usuario
        #fields=('nombre','apellido','telefono')
        fields='__all__'

class PermisoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Permiso
        fields='__all__'

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model=Rol
        fields='__all__'
        
class UsuarioEmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model=UsuarioEmpresa
        fields='__all__'
        
class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Proveedor
        fields='__all__'

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Cliente
        fields='__all__'

class ChatbotSerializer(serializers.ModelSerializer):
    class Meta:
        model=Chatbot
        fields='__all__'

class InteraccionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Interaccion
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
        
class CarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Carrito
        fields='__all__'
        
class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Pedido
        fields='__all__'
        
class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Reporte
        fields='__all__'

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']