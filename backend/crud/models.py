from django.db import models
from django.db.models import Sum
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Gestor personalizado para el modelo de Usuario
class UsuarioManager(BaseUserManager):
    # Método para crear un usuario común
    def create_user(self, correo, nombreUsuario, nombre, password=None, role='Cajero'):
        if not correo:
            raise ValueError('El usuario debe tener un correo electrónico')

         # Crear instancia de usuario con los atributos pasados
        usuario = self.model(
            nombreUsuario=nombreUsuario,
            correo=self.normalize_email(correo),
            nombre=nombre,
            role=role
        )
        usuario.set_password(password)  # Asignar contraseña
        usuario.save(using=self._db)  # Guardar el usuario en la base de datos
        return usuario

    # Método para crear un superusuario (Administrador)
    def create_superuser(self, correo, nombreUsuario, nombre, password):
        usuario = self.create_user(
            correo,
            nombreUsuario=nombreUsuario,
            nombre=nombre,
            password=password,
            role='Administrador'
        )
        usuario.usuario_administrador = True  # Definir que es administrador
        usuario.save(using=self._db)
        return usuario

# Modelo para el Usuario personalizado, basado en AbstractBaseUser
class Usuario(AbstractBaseUser):
    ROLE_CHOICES = (
        ('Cajero', 'Cajero'),
        ('Administrador', 'Administrador'),
    )

    nombreUsuario = models.CharField('Nombre de usuario', unique=True, max_length=32)
    correo = models.EmailField('Correo electrónico', max_length=254, unique=True)
    nombre = models.CharField('Nombres', max_length=200, blank=False, null=False)
    apellido = models.CharField('Apellidos', max_length=200, blank=False, null=False)
    numero_telefonico = models.CharField('Número Telefónico', max_length=20, blank=True, null=True) # Campo opcional
    estado_activo = models.BooleanField(default=True) # Define si el usuario está activo
    usuario_administrador = models.BooleanField(default=False) # Define si es administrador
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Cajero')   # Rol del usuario (Cajero/Administrador)

    objects = UsuarioManager() # Asignar el gestor de usuarios personalizado

    USERNAME_FIELD = 'nombreUsuario'  # Campo de login
    REQUIRED_FIELDS = ['correo', 'nombre']  # Campos requeridos

    def __str__(self):
        return self.nombreUsuario

    # Métodos para permisos (modificables según necesidad)
    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    # Propiedad para identificar si es administrador o no
    @property
    def is_staff(self):
        return self.usuario_administrador
    
class Proveedor(models.Model):
    nombre_proveedor = models.CharField(max_length=32)
    numero_telefonico = models.CharField(max_length=12)
    estado_activo = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Proveedor {self.nombre_proveedor}"

class Categoria(models.Model):
    nombreCategoria = models.CharField(max_length=100)
    descripcionCategoria = models.TextField()
    imagen = models.ImageField(upload_to='images/categorias', blank=True, null=True)
    
    def __str__(self):
        return self.nombreCategoria

# Modelo para Ingredientes que pueden componer un Producto
class Ingrediente(models.Model):
    nombreIngrediente = models.CharField(max_length=100)
    cantidadMinima = models.IntegerField()
    cantidadActual = models.IntegerField()
    proveedor = models.ForeignKey(Proveedor, on_delete=models.SET_NULL, null=True, blank=True)  # Proveedor puede ser nulo

    def __str__(self):
        return self.nombreIngrediente

class Producto(models.Model):
    nombreProducto = models.CharField(max_length=100)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='images/productos', blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cantidadMinima = models.IntegerField(null=True, blank=True)
    cantidadActual = models.PositiveIntegerField(default=0)
    ultimaActualizacion = models.DateTimeField(auto_now=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)  
    proveedor = models.ForeignKey(Proveedor, on_delete=models.SET_NULL, null=True, blank=True)
    ingredientes = models.ManyToManyField(Ingrediente, related_name='productos', blank=True) 

    def __str__(self):
        return self.nombreProducto

class MetodoPago(models.Model):
    nombre_metodo_pago = models.CharField(max_length=32)

    def __str__(self):
        return self.nombre_metodo_pago

# Modelo para los Productos dentro de una Orden de Compra
class ProductoOrden(models.Model):
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE)  # Relación con Producto
    orden = models.ForeignKey('OrdenCompra', on_delete=models.CASCADE, related_name='productos_ordenados')  # Relación con Orden de Compra
    cantidad = models.PositiveIntegerField(default=1)  # Cantidad de productos en la orden
    
    def __str__(self):
        return f"{self.cantidad}x {self.producto.nombreProducto} en orden {self.orden.id}"

# Modelo para las Órdenes de Compra
class OrdenCompra(models.Model):
    fechaOrden = models.DateTimeField(auto_now_add=True)  # Fecha de creación de la orden
    montoTotal = models.DecimalField(max_digits=10, decimal_places=2)  # Monto total de la orden
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)  # Usuario que realizó la orden
    metodoPago = models.ForeignKey('MetodoPago', on_delete=models.CASCADE, null=True)  # Método de pago usado
    
    def __str__(self):
        return f"Orden {self.id}"

class Reporte(models.Model):
    tipoReporte = models.CharField(max_length=100)
    fechaGeneracion = models.DateTimeField(auto_now_add=True)
    orden = models.ForeignKey(OrdenCompra, on_delete=models.CASCADE)  # Composición: Reporte depende de OrdenCompra

    def __str__(self):
        return f"Reporte {self.id}"
