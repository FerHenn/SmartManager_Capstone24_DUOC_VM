from rest_framework import status, viewsets, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.db.models import Sum, Count, F
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponseForbidden
from django.utils import timezone
from decimal import Decimal
from .serializers import UsuarioSerializer, UsuarioSerializer, ProveedorSerializer, CategoriaSerializer, ProductoSerializer, MetodoPagoSerializer, OrdenCompraSerializer, ReporteSerializer, IngredienteSerializer, CrearOrdenSerializer, OrdenCompraSerializer 
from .models import Usuario, Usuario, Proveedor, Categoria, Producto, MetodoPago, ProductoOrden, OrdenCompra, Reporte, Ingrediente

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
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombreCategoria']  # Permite buscar por nombre

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['precio', 'nombre']
    
class MetodoPagoViewSet(viewsets.ModelViewSet):
    queryset=MetodoPago.objects.all()
    serializer_class=MetodoPagoSerializer 
    
class OrdenCompraViewSet(viewsets.ModelViewSet):
    queryset=OrdenCompra.objects.all()
    serializer_class=OrdenCompraSerializer

class CrearOrdenCompra(APIView):
    
    permission_classes = [IsAuthenticated]  # Asegura que solo usuarios autenticados puedan acceder
    
    def post(self, request):
        usuario = request.user  # Este será el usuario autenticado
        
        if not isinstance(usuario, Usuario):  # Asegúrate de que sea una instancia de tu modelo `Usuario`
            return Response({"error": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)

        productos_data = request.data.get('productos', [])
        metodo_pago_id = request.data.get('metodoPago', None)

        # Asegúrate de que el método de pago es un ID válido
        try:
            metodo_pago = MetodoPago.objects.get(id=metodo_pago_id)
        except MetodoPago.DoesNotExist:
            return Response({'error': 'Método de pago no válido'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear una transacción para asegurarse de que todo ocurra correctamente
        with transaction.atomic():
            orden = OrdenCompra.objects.create(
                usuario=usuario,
                montoTotal=Decimal('0.00'),  # Inicializamos el monto total como Decimal
                metodoPago=metodo_pago  # Asegura que el método de pago es correcto
            )

            monto_total = Decimal('0.00')  # Usamos Decimal para el monto total

            # Procesar los productos seleccionados
            for producto_data in productos_data:
                producto_id = producto_data.get('producto_id')
                cantidad = producto_data.get('cantidad', 1)  # Obtener la cantidad, por defecto 1
                producto = Producto.objects.get(id=producto_id)

                # Descontar la cantidad del stock del producto
                if producto.cantidadActual < cantidad:
                    return Response({'error': f'Stock insuficiente para {producto.nombreProducto}'}, status=status.HTTP_400_BAD_REQUEST)

                producto.cantidadActual = F('cantidadActual') - cantidad
                producto.save()

                # Si el producto tiene ingredientes, descontarlos también
                for ingrediente in producto.ingredientes.all():
                    if ingrediente.cantidadActual < cantidad:
                        return Response({'error': f'Stock insuficiente para ingrediente {ingrediente.nombreIngrediente}'}, status=status.HTTP_400_BAD_REQUEST)

                    ingrediente.cantidadActual = F('cantidadActual') - cantidad
                    ingrediente.save()

                # Calcular el monto total de la orden usando Decimal
                monto_total += producto.precio * Decimal(cantidad)

                # Relacionar producto y orden
                ProductoOrden.objects.create(
                    producto=producto,
                    orden=orden,
                    cantidad=cantidad
                )

            # Guardar el monto total en la orden
            orden.montoTotal = monto_total
            orden.save()

        return Response(OrdenCompraSerializer(orden).data, status=status.HTTP_201_CREATED)

     
class ReporteViewSet(viewsets.ModelViewSet):
    queryset=Reporte.objects.all()
    serializer_class=ReporteSerializer 
    
class IngredienteViewSet(viewsets.ModelViewSet):
    queryset=Ingrediente.objects.all()
    serializer_class=IngredienteSerializer 
    
class ResumenInventarioDiario(APIView):
    def get(self, request):
        productos_agotandose = Producto.objects.filter(cantidadActual__lt=F('cantidadMinima'))
        ingredientes_agotandose = Ingrediente.objects.filter(cantidadActual__lt=F('cantidadMinima'))

        productos_serializer = ProductoSerializer(productos_agotandose, many=True)
        ingredientes_serializer = IngredienteSerializer(ingredientes_agotandose, many=True)

        return Response({
            'fecha': timezone.now(),
            'productos_agotandose': productos_serializer.data,
            'ingredientes_agotandose': ingredientes_serializer.data,
        })
        
class ReporteVentasDiario(APIView):
    def get(self, request):
        hoy = timezone.now().date()
        ventas = OrdenCompra.objects.filter(fecha__date=hoy)
        ventas_serializer = OrdenCompraSerializer(ventas, many=True)

        return Response({
            'fecha': hoy,
            'ventas': ventas_serializer.data,
        })
        
class ReporteVentasMensual(APIView):
    def get(self, request):
        mes_actual = timezone.now().month
        ventas = OrdenCompra.objects.filter(fecha__month=mes_actual)
        total_ventas = ventas.aggregate(Sum('montoTotal'))
        total_transacciones = ventas.count()

        return Response({
            'mes': mes_actual,
            'total_ventas': total_ventas['montoTotal__sum'],
            'total_transacciones': total_transacciones,
            'ventas': OrdenCompraSerializer(ventas, many=True).data
        })