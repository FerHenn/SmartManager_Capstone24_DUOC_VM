from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import Usuario, Proveedor, Categoria, Producto, MetodoPago, OrdenCompra, Reporte, Ingrediente

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model=Usuario
        #fields=('nombre','apellido','telefono')
        fields='__all__'
        
class ListaUsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nombreUsuario', 'correo', 'nombre', 'apellido', 'estado_activo', 'usuario_administrador']
  
class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Proveedor
        fields='__all__'
  
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model=Categoria
        fields='__all__'

class IngredienteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Ingrediente
        fields='__all__'
        
class ProductoSerializer(serializers.ModelSerializer):
     # Esto mostrará los ingredientes en el GET
    ingredientes = IngredienteSerializer(many=True, read_only=True)
    # Para manejar los IDs de ingredientes al crear o actualizar productos
    ingredientes_ids = serializers.PrimaryKeyRelatedField(queryset=Ingrediente.objects.all(), many=True, write_only=True)
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all(), source='categoria', write_only=True)
    
        
    class Meta:
        model=Producto
        fields=[
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
            'ingredientes',
            'ingredientes_ids'
        ]
        
    def create(self, validated_data):
        # Extraemos los IDs de los ingredientes
        ingredientes_data = validated_data.pop('ingredientes_ids')
        categoria = validated_data.pop('categoria')
        
        # Creamos el producto
        producto = Producto.objects.create(**validated_data, categoria=categoria)
        
        # Asignamos los ingredientes al producto
        producto.ingredientes.set(ingredientes_data)
        
        return producto

    def update(self, instance, validated_data):
        # Extraemos los IDs de los ingredientes
        ingredientes_data = validated_data.pop('ingredientes_ids', None)
        
        # Actualizamos los campos del producto
        instance.nombreProducto = validated_data.get('nombreProducto', instance.nombreProducto)
        instance.descripcion = validated_data.get('descripcion', instance.descripcion)
        instance.precio = validated_data.get('precio', instance.precio)
        instance.categoria = validated_data.get('categoria', instance.categoria)
        instance.save()

        # Si hay ingredientes, los actualizamos
        if ingredientes_data:
            instance.ingredientes.set(ingredientes_data)
        
        return instance

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
