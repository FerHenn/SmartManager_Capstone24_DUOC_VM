import json
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
from rest_framework import serializers
from .serializers import (
    UsuarioSerializer, UsuarioSerializer, ProveedorSerializer,
    CategoriaSerializer, ProductoSerializer, MetodoPagoSerializer,
    OrdenCompraSerializer, ReporteSerializer, IngredienteSerializer,
    CrearOrdenSerializer, OrdenCompraSerializer, OrdenCompraSerializer,
    ProductoOrdenSerializer )

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

    def create(self, request, *args, **kwargs):
        ingredientes_ids = request.data.get('ingredientes', [])
        if ingredientes_ids:
            ingredientes_ids = json.loads(ingredientes_ids)  # Convertir JSON a lista

        producto = Producto.objects.create(
            nombreProducto=request.data['nombreProducto'],
            descripcion=request.data['descripcion'],
            precio=request.data['precio'],
            cantidadMinima=request.data['cantidadMinima'],
            cantidadActual=request.data['cantidadActual'],
            categoria_id=request.data['categoria_id'],
            proveedor_id=request.data['proveedor_id'],
        )

        # Relacionar ingredientes con el producto
        if ingredientes_ids:
            producto.ingredientes.set(ingredientes_ids)

        producto.save()
        serializer = ProductoSerializer(producto)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
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
                try:
                    producto = Producto.objects.get(id=producto_id)
                except Producto.DoesNotExist:
                    return Response({'error': f'Producto con id {producto_id} no existe'}, status=status.HTTP_400_BAD_REQUEST)

                # Descontar la cantidad del stock del producto
                if producto.cantidadActual < cantidad:
                    return Response({'error': f'Stock insuficiente para {producto.nombreProducto}'}, status=status.HTTP_400_BAD_REQUEST)

                producto.cantidadActual = F('cantidadActual') - cantidad
                producto.save()
                
                # Relacionar producto y orden
                ProductoOrden.objects.create(
                    producto=producto,
                    orden=orden,
                    cantidad=cantidad
                )                

                # Si el producto tiene ingredientes, descontarlos también
                for ingrediente in producto.ingredientes.all():
                    if ingrediente.cantidadActual < cantidad:
                        return Response({'error': f'Stock insuficiente para ingrediente {ingrediente.nombreIngrediente}'}, status=status.HTTP_400_BAD_REQUEST)

                    ingrediente.cantidadActual = F('cantidadActual') - cantidad
                    ingrediente.save()

                # Calcular el monto total de la orden usando Decimal
                monto_total += producto.precio * Decimal(cantidad)

            # Guardar el monto total en la orden
            orden.montoTotal = monto_total
            orden.save()
            
            # Serializar la orden incluyendo los productos
        serializer = OrdenCompraSerializer(orden)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

     
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
            # Obtener la fecha desde el parámetro de la URL o usar la fecha actual como predeterminada
            fecha_str = request.GET.get('fecha')
            if fecha_str:
                fecha = parse_date(fecha_str)
                if not fecha:
                    return Response({"error": "Formato de fecha no válido. Usa AAAA-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                fecha = timezone.now().date()

            # Filtrar las ventas por fecha
            ventas = OrdenCompra.objects.filter(fechaOrden__date=fecha)

            if not ventas.exists():
                return Response({
                    'fecha': fecha,
                    'mensaje': 'No hay ventas registradas para esta fecha.',
                    'ventas': [],
                    'total_ventas': 0
                }, status=status.HTTP_200_OK)

            # Preparar datos extendidos para cada venta
            ventas_data = []
            for venta in ventas:
                productos_ordenados = ProductoOrden.objects.filter(orden=venta).annotate(
                    nombre_producto=F("producto__nombreProducto")
                ).values("producto", "nombre_producto", "cantidad")

                ventas_data.append({
                    "id": venta.id,
                    "fechaOrden": venta.fechaOrden,
                    "montoTotal": venta.montoTotal,
                    "metodoPago": venta.metodoPago.nombre_metodo_pago,
                    "productos_ordenados": list(productos_ordenados),
                })

            # Calcular el monto total de ventas diarias
            total_ventas = ventas.aggregate(total=Sum('montoTotal'))['total'] or 0

            return Response({
                'fecha': fecha,
                'total_ventas': total_ventas,
                'ventas': ventas_data,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Vista para generar un reporte de ventas mensual
class ReporteVentasMensual(APIView):
    def get(self, request):
        try:
            mes_anio_str = request.GET.get('mes')
            if mes_anio_str:
                try:
                    mes, anio = map(int, mes_anio_str.split('/'))
                except ValueError:
                    return Response({"error": "Formato de mes no válido. Usa MM/YYYY"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Usa el mes y año actuales si no se proporcionan
                fecha_actual = timezone.now()
                mes = fecha_actual.month
                anio = fecha_actual.year

            # Filtrar las ventas por el mes y año proporcionados
            ventas = (
                OrdenCompra.objects.filter(fechaOrden__month=mes, fechaOrden__year=anio)
                .annotate(dia=TruncDate("fechaOrden"))  # Agrupar por día
                .values("dia")
                .annotate(total_vendido=Sum("montoTotal"))  # Sumar el monto total por día
                .order_by("dia")
            )

            # Calcular el total de ventas y transacciones
            total_ventas = sum(item["total_vendido"] for item in ventas)  # Total ventas del mes
            total_transacciones = OrdenCompra.objects.filter(fechaOrden__month=mes, fechaOrden__year=anio).count()

            return Response({
                'mes': f"{mes:02}/{anio}",  # Devolver mes/año en el formato solicitado
                'total_ventas': total_ventas,
                'total_transacciones': total_transacciones,
                'ventas': ventas,  # Ventas agrupadas por día
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