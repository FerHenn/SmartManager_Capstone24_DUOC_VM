from rest_framework import viewsets
from .serializers import UsuarioSerializer, UsuarioSerializer, ProveedorSerializer, CategoriaSerializer, ProductoSerializer, MetodoPagoSerializer, OrdenCompraSerializer, ReporteSerializer, IngredienteSerializer    
from .models import Usuario, Usuario, Proveedor, Categoria, Producto, MetodoPago, OrdenCompra, Reporte, Ingrediente
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view
def login(request):
    return Response({})

@api_view
def register(request):
    return Response({})

@api_view
def profile(request):
    return Response({})

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset=Usuario.objects.all()
    serializer_class=UsuarioSerializer 
    
class ProveedorViewSet(viewsets.ModelViewSet):
    queryset=Proveedor.objects.all()
    serializer_class=ProveedorSerializer 

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
      
class ReporteViewSet(viewsets.ModelViewSet):
    queryset=Reporte.objects.all()
    serializer_class=ReporteSerializer 
    
class IngredienteViewSet(viewsets.ModelViewSet):
    queryset=Ingrediente.objects.all()
    serializer_class=IngredienteSerializer 