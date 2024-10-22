from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import Usuario, Proveedor, Categoria, Producto, MetodoPago, ProductoOrden, OrdenCompra, Reporte, Ingrediente

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model=Usuario
        fields='__all__' # Incluye todos los campos del modelo Usuario
        
class ListaUsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nombreUsuario',
                  'correo',
                  'nombre',
                  'apellido',
                  'numero_telefonico'
                  'estado_activo',
                  'usuario_administrador',
                  'is_staff',
                  'is_superuser']
  
class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Proveedor
        fields='__all__'
        extra_kwargs = {
            'proveedor': {'required': False, 'allow_null': True},
        }
  
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model=Categoria
        fields='__all__'

# Serializer para Ingredientes, permitiendo campos nulos
class IngredienteSerializer(serializers.ModelSerializer):
    proveedor = serializers.PrimaryKeyRelatedField(
        queryset=Proveedor.objects.all(), 
        required=False, 
        allow_null=True
    )    
    
    class Meta:
        model=Ingrediente
        fields='__all__'

# Serializer para Productos, maneja ingredientes y categorías
class ProductoSerializer(serializers.ModelSerializer):
    # Mostramos ingredientes, categoría y proveedor
    ingredientes = IngredienteSerializer(many=True, read_only=True)
    categoria = CategoriaSerializer(read_only=True)
    proveedor = ProveedorSerializer(read_only=True)

    # Permitimos pasar los IDs al crear o actualizar
    ingredientes_ids = serializers.PrimaryKeyRelatedField(
        queryset=Ingrediente.objects.all(),
        many=True,
        write_only=True,
        required=False,
        allow_null=True
    )
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(),
        source='categoria',
        write_only=True
    )
    proveedor_id = serializers.PrimaryKeyRelatedField(
        queryset=Proveedor.objects.all(),
        source='proveedor',
        write_only=True
    )

    class Meta:
        model = Producto
        fields = [
            'id',
            'nombreProducto',
            'descripcion',
            'imagen',
            'precio',
            'cantidadMinima',
            'cantidadActual',
            'ultimaActualizacion',
            'categoria',
            'categoria_id',
            'proveedor',
            'proveedor_id',
            'ingredientes',
            'ingredientes_ids'
        ]

    def create(self, validated_data):
        # Extraemos los ingredientes, categoría y proveedor
        ingredientes_data = validated_data.pop('ingredientes_ids', [])
        categoria = validated_data.pop('categoria')
        proveedor = validated_data.pop('proveedor', None)

        # Creamos el producto
        producto = Producto.objects.create(**validated_data, categoria=categoria, proveedor=proveedor)

        # Asignamos los ingredientes al producto, si existen
        if ingredientes_data:
            producto.ingredientes.set(ingredientes_data)

        return producto

    def update(self, instance, validated_data):
        ingredientes_data = validated_data.pop('ingredientes_ids', [])
        instance.categoria = validated_data.get('categoria', instance.categoria)
        instance.proveedor = validated_data.get('proveedor', instance.proveedor)
        instance.save()

        # Si hay ingredientes, actualizamos
        if ingredientes_data:
            instance.ingredientes.set(ingredientes_data)

        return instance


class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model=MetodoPago
        fields='__all__'
        
#class OrdenCompraSerializer(serializers.ModelSerializer):
#    class Meta:
#        model=OrdenCompra
#        fields='__all__'
        
class ProductoOrdenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoOrden
        fields = ['producto', 'cantidad']

class OrdenCompraSerializer(serializers.ModelSerializer):
    productos_ordenados = ProductoOrdenSerializer(many=True, read_only=True)  # Relación con los productos ordenados

    class Meta:
        model = OrdenCompra
        fields = ['id', 'fechaOrden', 'montoTotal', 'usuario', 'metodoPago', 'productos_ordenados']

class CrearOrdenSerializer(serializers.ModelSerializer):
    productos = serializers.ListField(
        child=serializers.DictField(), 
        write_only=True
    )

    class Meta:
        model = OrdenCompra
        fields = ['metodoPago', 'productos']
        
class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Reporte
        fields='__all__'
