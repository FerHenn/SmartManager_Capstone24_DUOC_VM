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

class RecuperarContrasenaSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    nueva_contrasena = serializers.CharField(write_only=True)
    confirmar_contrasena = serializers.CharField(write_only=True)
    contrasena_admin = serializers.CharField(write_only=True)

  
class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Proveedor
        fields='__all__'
        extra_kwargs = {
            'proveedor': {'required': False, 'allow_null': True},
        }
  
class CategoriaSerializer(serializers.ModelSerializer):
    # Cambiar el manejo de la imagen a un ImageField
    imagen = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Categoria
        fields = '__all__'
    
    # Método opcional para obtener la URL de la imagen
    def get_imagen(self, obj):
        if obj.imagen:
            return obj.imagen.url  # Devuelve la URL de la imagen
        return None

    # Método para crear una nueva categoría
    def create(self, validated_data):
        imagen = validated_data.pop('imagen', None)  # Manejo de la imagen si es enviada
        categoria = Categoria.objects.create(**validated_data)
        if imagen:
            categoria.imagen = imagen  # Asignar la imagen al modelo
            categoria.save()
        return categoria

    # Método para actualizar una categoría existente
    def update(self, instance, validated_data):
        imagen = validated_data.pop('imagen', None)  # Manejo de la imagen si es enviada
        for attr, value in validated_data.items():
            setattr(instance, attr, value)  # Actualizar otros campos
        if imagen:
            instance.imagen = imagen  # Actualizar la imagen
        instance.save()
        return instance
    

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
    imagen = serializers.ImageField(required=False)  # Asegura que el campo imagen esté disponible
    proveedor = ProveedorSerializer(read_only=True)  # Incluye el proveedor completo en el GET
    proveedor_id = serializers.PrimaryKeyRelatedField(
        queryset=Proveedor.objects.all(), 
        write_only=True,  # Solo para el POST/PUT
        required=False, 
        allow_null=True
    )
    # Esto mostrará los ingredientes en el GET
    ingredientes = IngredienteSerializer(many=True, read_only=True)
    # Para manejar los IDs de ingredientes al crear o actualizar productos
    ingredientes_ids = serializers.PrimaryKeyRelatedField(
        queryset=Ingrediente.objects.all(), 
        many=True, 
        write_only=True, 
        required=False, 
        allow_null=True
    )
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(), 
        source='categoria', 
        write_only=True
    )

    class Meta:
        model = Producto
        fields = '__all__'
        
    def get_imagen(self, obj):
        if obj.imagen:
            return obj.imagen.url  # Devuelve la ruta relativa
        return None

    # Método para crear un Producto
    def create(self, validated_data):
        # Extraemos los IDs de los ingredientes (pueden ser None)
        ingredientes_data = validated_data.pop('ingredientes_ids', None)
        categoria = validated_data.pop('categoria')
        proveedor = validated_data.pop('proveedor_id', None)  # Proveedor puede ser None
        imagen = validated_data.pop('imagen', None)

        # Creamos el producto
        producto = Producto.objects.create(**validated_data, categoria=categoria, proveedor=proveedor)

        # Asignamos los ingredientes al producto, si existen
        if ingredientes_data:
            producto.ingredientes.set(ingredientes_data) # Asignar los ingredientes
        
        # Asignamos la imagen al producto, si existe
        if imagen:
            producto.imagen = imagen  # Asignamos la imagen si existe
            producto.save()
            
        return producto

    
    # Método para actualizar un Producto
    def update(self, instance, validated_data):
        # Extraemos los IDs de los ingredientes (pueden ser None)
        ingredientes_data = validated_data.pop('ingredientes_ids', None)
        imagen = validated_data.pop('imagen', None)
        
        # Actualizamos los campos del producto
        instance.nombreProducto = validated_data.get('nombreProducto', instance.nombreProducto)
        instance.descripcion = validated_data.get('descripcion', instance.descripcion)
        instance.precio = validated_data.get('precio', instance.precio)
        instance.categoria = validated_data.get('categoria', instance.categoria)
        instance.proveedor = validated_data.pop('proveedor_id', instance.proveedor)  # Proveedor puede ser None
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if imagen:
            instance.imagen = imagen  # Actualizamos la imagen si existe
            
        instance.save()

        # Si hay ingredientes, los actualizamos
        if ingredientes_data:
            instance.ingredientes.set(ingredientes_data) # Actualizar ingredientes

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
