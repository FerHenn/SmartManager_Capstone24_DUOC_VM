from rest_framework import status, viewsets, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
from django.db import transaction
from django.db.models import Sum, Count, F
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponseForbidden
from django.utils import timezone
from django.utils.timezone import now, localtime
from django.utils.dateparse import parse_date
from django.db.models.functions import TruncDate
from decimal import Decimal

from .serializers import (
    UsuarioSerializer, UsuarioSerializer, ProveedorSerializer,
    CategoriaSerializer, ProductoSerializer, MetodoPagoSerializer,
    OrdenCompraSerializer, ReporteSerializer, IngredienteSerializer,
    CrearOrdenSerializer, OrdenCompraSerializer )

from .models import (Usuario, Usuario, Proveedor,
                     Categoria, Producto, MetodoPago,
                     ProductoOrden, OrdenCompra, Reporte,
                     Ingrediente)
#----------------Autenticacion de usuario--------------------------------#
# Vista para manejar operaciones CRUD con el modelo Usuario
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()  # Obtiene todos los usuarios
    serializer_class = UsuarioSerializer  # Usa el serializer de Usuario

# Vista para el registro de usuarios
class RegistroUsuario(APIView):
    def post(self, request):
        data = request.data
        data['password'] = make_password(data['password'])  # Hashea la contraseña
        serializer = UsuarioSerializer(data=data) # Serializa los datos del usuario
        if serializer.is_valid():
            serializer.save() # Guarda el usuario si los datos son válidos
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # Retorna errores si el serializer no es válido

# Vista para el inicio de sesión de usuarios
class LoginUsuario(APIView):
    def post(self, request):
        nombreUsuario = request.data.get('nombreUsuario')
        password = request.data.get('password')
        usuario = authenticate(nombreUsuario=nombreUsuario, password=password) # Autentica el usuario
        if usuario is not None:
            token, _ = Token.objects.get_or_create(user=usuario) # Genera o obtiene un token de autenticación
            return Response({'token': token.key}, status=status.HTTP_200_OK)  # Devuelve el token al usuario
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_400_BAD_REQUEST)

# Vista para cerrar sesión
class LogoutUsuario(APIView):
    permission_classes = [IsAuthenticated] # Requiere que el usuario esté autenticado

    def post(self, request):
        request.user.auth_token.delete() # Elimina el token de autenticación del usuario
        return Response(status=status.HTTP_200_OK) # Devuelve una respuesta exitosa

# Vista para obtener el perfil del usuario autenticado   
class PerfilUsuario(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = request.user # Obtiene el usuario autenticado
        serializer = UsuarioSerializer(usuario) # Serializa los datos del usuario
        return Response(serializer.data)

# Vista para obtener una lista de todos los usuarios (solo para administradores)
class ListaUsuarios(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'Administrador': # Verifica si el usuario es administrador
            return HttpResponseForbidden('No tienes permisos para ver esta lista.')
        
        usuarios = Usuario.objects.all() # Obtiene todos los usuarios
        serializer = UsuarioSerializer(usuarios, many=True) # Serializa todos los usuarios
        return Response(serializer.data)
    
# Vista para recuperar cuenta de usuario (solo para administradores)

class RecuperarContrasenaView(APIView):
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados

    def post(self, request):
        try:
            nombre_usuario = request.data.get('nombreUsuario')
            nueva_contrasena = request.data.get('nuevaContrasena')
            confirmar_contrasena = request.data.get('confirmarContrasena')
            contrasena_admin = request.data.get('contrasenaAdmin')

            # Validación de campos
            if not all([nombre_usuario, nueva_contrasena, confirmar_contrasena, contrasena_admin]):
                return Response({'error': 'Todos los campos son requeridos.'}, status=status.HTTP_400_BAD_REQUEST)

            if nueva_contrasena != confirmar_contrasena:
                return Response({'error': 'Las contraseñas no coinciden.'}, status=status.HTTP_400_BAD_REQUEST)

            administrador = request.user
            if not administrador.check_password(contrasena_admin) or administrador.role != 'Administrador':
                return Response({'error': 'Contraseña de administrador incorrecta o usuario no autorizado.'},
                                status=status.HTTP_403_FORBIDDEN)

            # Buscar el usuario por nombre de usuario
            usuario = Usuario.objects.get(nombreUsuario=nombre_usuario)
            usuario.password = make_password(nueva_contrasena)
            usuario.save()

            return Response({'mensaje': 'Contraseña actualizada correctamente.'}, status=status.HTTP_200_OK)
        
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            # Registrar el error para más detalles
            print("Error en la vista de recuperar contraseña:", e)
            return Response({'error': 'Error interno en el servidor.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
#--------------------Manejo y automatización del CRUD--------------------------#

class ProveedorViewSet(viewsets.ModelViewSet):
    queryset=Proveedor.objects.all()
    serializer_class=ProveedorSerializer 

# Vista para manejar operaciones CRUD con el modelo Categoria
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset=Categoria.objects.all()
    serializer_class=CategoriaSerializer 
    filter_backends = [filters.SearchFilter] # Agrega filtros de búsqueda
    search_fields = ['nombreCategoria']  # Permite buscar por nombre de categoría

# Vista para manejar operaciones CRUD con el modelo Producto
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['categoria']  # Permitir el filtro por categoría
    search_fields = ['nombre', 'descripcion'] # Campos por los que se puede buscar
    ordering_fields = ['precio', 'nombre'] # Campos permitidos para ordenar los resultados

# Vista para manejar operaciones CRUD con el modelo MetodoPago
class MetodoPagoViewSet(viewsets.ModelViewSet):
    queryset=MetodoPago.objects.all()
    serializer_class=MetodoPagoSerializer 

# Vista para manejar operaciones CRUD con el modelo OrdenCompra   
class OrdenCompraViewSet(viewsets.ModelViewSet):
    queryset=OrdenCompra.objects.all()
    serializer_class=OrdenCompraSerializer

# Vista personalizada para crear una orden de compra
class CrearOrdenCompra(APIView):
    
    permission_classes = [IsAuthenticated]  # Asegura que solo usuarios autenticados puedan acceder
    
    def post(self, request):
        usuario = request.user  # Este será el usuario autenticado
        
        if not isinstance(usuario, Usuario):  # Asegúrate de que sea una instancia de tu modelo `Usuario`
            return Response({"error": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)

        productos_data = request.data.get('productos', []) # Obtén los productos de la solicitud
        metodo_pago_id = request.data.get('metodoPago', None) # Obtén el método de pago de la solicitud

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

# Vista para manejar operaciones CRUD con el modelo Ingrediente    
class IngredienteViewSet(viewsets.ModelViewSet):
    queryset=Ingrediente.objects.all()
    serializer_class=IngredienteSerializer 

# Vista para generar un resumen del inventario diario  
class ResumenInventarioDiario(APIView):
    def get(self, request):
        productos_agotandose = Producto.objects.filter(cantidadActual__lt=F('cantidadMinima')) # Filtra los productos por cantidad mínima
        ingredientes_agotandose = Ingrediente.objects.filter(cantidadActual__lt=F('cantidadMinima')) # Filtra los ingredientes por cantidad mínima

        productos_serializer = ProductoSerializer(productos_agotandose, many=True)
        ingredientes_serializer = IngredienteSerializer(ingredientes_agotandose, many=True)

        return Response({
            'fecha': timezone.now(),
            'productos_agotandose': productos_serializer.data,
            'ingredientes_agotandose': ingredientes_serializer.data,
        })
        
# Vista para generar un reporte de ventas diarias
class ReporteVentasDiario(APIView):
    def get(self, request):
        try:
            # Obtén la fecha desde el parámetro de la URL o usa la fecha actual como predeterminada
            fecha_str = request.GET.get('fecha')
            if fecha_str:
                fecha = parse_date(fecha_str)
                if not fecha:
                    return Response({"error": "Formato de fecha no válido. Usa AAAA-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                fecha = localtime(now()).date()  # Fecha actual si no se proporciona ninguna

            # Filtra las ventas por fecha
            ventas = OrdenCompra.objects.filter(fechaOrden__date=fecha)

            # Serializa las ventas
            ventas_serializer = OrdenCompraSerializer(ventas, many=True)

            # Si no hay ventas, retorna un mensaje
            if not ventas.exists():
                return Response({
                    'fecha': fecha,
                    'mensaje': 'No hay ventas registradas para esta fecha.',
                    'ventas': []
                }, status=status.HTTP_200_OK)

            # Calcula el monto total de ventas diarias
            total_ventas = ventas.aggregate(total=Sum('montoTotal'))['total'] or 0

            return Response({
                'fecha': fecha,
                'total_ventas': total_ventas,  # Incluye el monto total de las ventas
                'ventas': ventas_serializer.data,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Vista para generar un reporte de ventas mensual
class ReporteVentasMensual(APIView):
    def get(self, request):
        try:
            mes_actual = timezone.now().month  # Obtiene el mes actual
            anio_actual = timezone.now().year  # Obtiene el año actual
            ventas = (
                OrdenCompra.objects.filter(fechaOrden__month=mes_actual, fechaOrden__year=anio_actual)
                .annotate(dia=TruncDate("fechaOrden"))  # Agrupa por día
                .values("dia")
                .annotate(total_vendido=Sum("montoTotal"))  # Suma el monto total por día
                .order_by("dia")
            )

            total_ventas = sum(item["total_vendido"] for item in ventas)  # Calcula el total de ventas del mes
            total_transacciones = OrdenCompra.objects.filter(fechaOrden__month=mes_actual, fechaOrden__year=anio_actual).count()

            return Response({
                'mes': mes_actual,
                'total_ventas': total_ventas,
                'total_transacciones': total_transacciones,
                'ventas': ventas,  # Devuelve las ventas agrupadas por día
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ProductosVendidosPorDia(APIView):
    def get(self, request):
        try:
            hoy = timezone.now().date()
            productos_vendidos = (
                ProductoOrden.objects.filter(orden__fechaOrden__date=hoy)
                .values("producto__nombreProducto")
                .annotate(total_vendidos=Sum("cantidad"))
                .order_by("-total_vendidos")
            )

            return Response(productos_vendidos, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class FechasConVentas(APIView):
    def get(self, request):
        fechas = (
            OrdenCompra.objects
            .annotate(fecha=TruncDate("fechaOrden"))
            .values("fecha")
            .annotate(ventas=Count("id"))
            .filter(ventas__gt=0)
            .order_by("fecha")
        )
        fechas_list = [str(f["fecha"]) for f in fechas]
        return Response(fechas_list, status=200)