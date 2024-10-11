from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UsuarioManager(BaseUserManager):
    def create_user(self,correo,nombreUsuario,nombre,password = None):
        if not correo:
            raise ValueError('El usuario debe tener un correo electronico')
        
        usuario = self.model(
            nombreUsuario=nombreUsuario, 
            correo = self.normalize_email(correo), 
            nombre = nombre
            )
        
        usuario.set_password(password)
        usuario.save()
        return usuario
    
    def create_superuser(self,correo,nombreUsuario,nombre,password):
        usuario = self.create_user(
            correo,
            nombreUsuario=nombreUsuario, 
            nombre = nombre,
            password=password
        )
        usuario.usuario_administrador = True
        usuario.save()
        return usuario

class Usuario(AbstractBaseUser):
    nombreUsuario = models.CharField('Nombre de usuario', unique=True, max_length=32)
    correo = models.EmailField('Correo eletrónico', max_length=254, unique=True)
    nombre = models.CharField('Nombres', max_length=200, blank=False, null=False)
    apellido = models.CharField('Apellidos', max_length=200, blank=False, null=False)
    estado_activo = models.BooleanField(default=True)
    usuario_administrador = models.BooleanField(default=False)
    objects = UsuarioManager()
    
    USERNAME_FIELD = 'nombreUsuario'
    REQUIRED_FIELDS = ['correo', 'nombre']

    def __str__(self):
        return self.nombreUsuario
    
    def has_perm(self,perm,obj = None):
        return True

    def has_module_perms(self,app_label):
        return True
    
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

    def __str__(self):
        return self.nombreCategoria
    
class Ingrediente(models.Model):
    nombreIngrediente = models.CharField(max_length=100)
    cantidadMinima = models.IntegerField()
    cantidadActual = models.IntegerField()
    proveedor = models.ForeignKey(Proveedor, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.nombreIngrediente

class Producto(models.Model):
    nombreProducto = models.CharField(max_length=100)
    descripcion = models.TextField()
    imagen = models.ImageField('Imagen de producto', height_field=None, width_field=None, max_length=200, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cantidadMinima = models.IntegerField(null=True)
    cantidadActual = models.IntegerField(null=True)
    ultimaActualizacion = models.DateTimeField(auto_now=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)  
    proveedor = models.ForeignKey(Proveedor, on_delete=models.SET_NULL, null=True)
    ingredientes = models.ManyToManyField(Ingrediente, related_name='productos') 

    def __str__(self):
        return self.nombreProducto

class MetodoPago(models.Model):
    nombre_metodo_pago = models.CharField(max_length=32)

    def __str__(self):
        return self.nombre_metodo_pago

class OrdenCompra(models.Model):
    fechaOrden = models.DateTimeField(auto_now_add=True)
    montoTotal = models.DecimalField(max_digits=10, decimal_places=2)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    metodoPago = models.ForeignKey('MetodoPago', on_delete=models.CASCADE, null=True)

    def calcular_total(self):
        # Implementación del cálculo de total aquí
        pass

    def __str__(self):
        return f"Orden {self.id}"

class Reporte(models.Model):
    tipoReporte = models.CharField(max_length=100)
    fechaGeneracion = models.DateTimeField(auto_now_add=True)
    orden = models.ForeignKey(OrdenCompra, on_delete=models.CASCADE)  # Composición: Reporte depende de OrdenCompra

    def __str__(self):
        return f"Reporte {self.id}"
