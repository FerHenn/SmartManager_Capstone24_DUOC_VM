from rest_framework import viewsets
from .serializers import UsuarioSerializer, RolSerializer, PermisoSerializer, UsuarioEmpresaSerializer, ProveedorSerializer, ClienteSerializer, ChatbotSerializer, InteraccionSerializer, CategoriaSerializer, ProductoSerializer, MetodoPagoSerializer, OrdenCompraSerializer, CarritoSerializer, PedidoSerializer, ReporteSerializer     
from .models import Usuario, Rol, Permiso, UsuarioEmpresa, Proveedor, Cliente, Chatbot, Interaccion, Categoria, Producto, MetodoPago, OrdenCompra, Carrito, Pedido, Reporte     

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset=Usuario.objects.all()
    serializer_class=UsuarioSerializer 
    
class RolViewSet(viewsets.ModelViewSet):
    queryset=Rol.objects.all()
    serializer_class=RolSerializer 
    
class PermisoViewSet(viewsets.ModelViewSet):
    queryset=Permiso.objects.all()
    serializer_class=PermisoSerializer 
    
class UsuarioEmpresaViewSet(viewsets.ModelViewSet):
    queryset=UsuarioEmpresa.objects.all()
    serializer_class=UsuarioEmpresaSerializer 
    
class ProveedorViewSet(viewsets.ModelViewSet):
    queryset=Proveedor.objects.all()
    serializer_class=ProveedorSerializer 
    
class ClienteViewSet(viewsets.ModelViewSet):
    queryset=Cliente.objects.all()
    serializer_class=ClienteSerializer 

class ChatbotViewSet(viewsets.ModelViewSet):
    queryset=Chatbot.objects.all()
    serializer_class=ChatbotSerializer 
    
class InteraccionViewSet(viewsets.ModelViewSet):
    queryset=Interaccion.objects.all()
    serializer_class=InteraccionSerializer 

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset=Categoria.objects.all()
    serializer_class=CategoriaSerializer 

class ProductoViewSet(viewsets.ModelViewSet):
    queryset=Producto.objects.all()
    serializer_class=ProductoSerializer 
    
class MetodoPagoViewSet(viewsets.ModelViewSet):
    queryset=MetodoPago.objects.all()
    serializer_class=MetodoPagoSerializer 
    
class OrdenCompraViewSet(viewsets.ModelViewSet):
    queryset=OrdenCompra.objects.all()
    serializer_class=OrdenCompraSerializer 
    
class CarritoViewSet(viewsets.ModelViewSet):
    queryset=Carrito.objects.all()
    serializer_class=CarritoSerializer 
    
class PedidoViewSet(viewsets.ModelViewSet):
    queryset=Pedido.objects.all()
    serializer_class=PedidoSerializer 
    
class ReporteViewSet(viewsets.ModelViewSet):
    queryset=Reporte.objects.all()
    serializer_class=ReporteSerializer 