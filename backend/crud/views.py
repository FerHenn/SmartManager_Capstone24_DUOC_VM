from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.db.models import Sum
from django.http import HttpResponseForbidden
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from .serializers import UsuarioSerializer, UsuarioSerializer, ProveedorSerializer, CategoriaSerializer, ProductoSerializer, MetodoPagoSerializer, OrdenCompraSerializer, ReporteSerializer, IngredienteSerializer, ListaUsuariosSerializer  
from .models import Usuario, Usuario, Proveedor, Categoria, Producto, MetodoPago, OrdenCompra, Reporte, Ingrediente

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset=Usuario.objects.all()
    serializer_class=UsuarioSerializer 
    
class RegistroUsuario(APIView):
    def post(self, request):
        data = request.data
        data['password'] = make_password(data['password'])  # Hashea la contraseña
        serializer = UsuarioSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginUsuario(APIView):
    def post(self, request):
        nombreUsuario = request.data.get('nombreUsuario')
        password = request.data.get('password')
        usuario = authenticate(nombreUsuario=nombreUsuario, password=password)
        if usuario is not None:
            token, _ = Token.objects.get_or_create(user=usuario)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutUsuario(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
    
class PerfilUsuario(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = request.user
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)
    
class ListaUsuarios(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'Administrador':
            return HttpResponseForbidden('No tienes permisos para ver esta lista.')
        
        usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data)
#------------------------------------------------#
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
    
class CrearOrdenCompra(APIView):
    def post(self, request):
        productos_ids = request.data.get('productos', [])
        metodo_pago_id = request.data.get('metodoPago', None)
        usuario = request.user

        productos = Producto.objects.filter(id__in=productos_ids)
        monto_total = productos.aggregate(Sum('precio'))['precio__sum']

        if not productos.exists():
            return Response({'error': 'No se encontraron productos válidos'}, status=status.HTTP_400_BAD_REQUEST)

        orden = OrdenCompra.objects.create(
            usuario=usuario,
            montoTotal=monto_total,
            metodoPago_id=metodo_pago_id
        )
        orden.productos.set(productos)  # Añadir productos a la orden

        return Response(OrdenCompraSerializer(orden).data, status=status.HTTP_201_CREATED)
      
class ReporteViewSet(viewsets.ModelViewSet):
    queryset=Reporte.objects.all()
    serializer_class=ReporteSerializer 
    
class IngredienteViewSet(viewsets.ModelViewSet):
    queryset=Ingrediente.objects.all()
    serializer_class=IngredienteSerializer 