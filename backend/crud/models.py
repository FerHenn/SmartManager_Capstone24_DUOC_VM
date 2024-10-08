from django.db import models

class Usuario(models.Model):
    nombre = models.CharField(max_length=32)
    apellido = models.CharField(max_length=32)
    telefono = models.CharField(max_length=12, unique=True)

class Permiso(models.Model):
    nombrePermiso = models.CharField(max_length=64, unique=True)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombrePermiso


class Rol(models.Model):
    nombreRol = models.CharField(max_length=32, unique=True)
    permisos = models.ManyToManyField(Permiso, related_name="roles")

    def __str__(self):
        return self.nombreRol

class UsuarioEmpresa(Usuario):
    nombreUsuario = models.CharField(max_length=32)
    correo = models.EmailField()
    contrasena = models.CharField(max_length=20)
    estado = models.BooleanField(default=True)
    rol = models.ForeignKey('Rol', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.nombreUsuario
    
class Proveedor(Usuario):
    nombre_contacto_proveedor = models.CharField(max_length=32)
    
    def __str__(self):
        return f"Proveedor {self.nombreContactoProveedor}"

class Cliente(Usuario):
    direccion = models.CharField(max_length=255)

    def __str__(self):
        return f"Cliente {self.nombre} {self.apellido}"
    
class Chatbot(Usuario):
    nombre_chatbot = models.CharField(max_length=32)
    activo = models.BooleanField(default=True)

    def interactuar_con_usuario(self, mensaje):
        # Lógica para interactuar con el usuario a través del bot
        pass

class Interaccion(models.Model):
    cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    chatbot = models.ForeignKey('Chatbot', on_delete=models.CASCADE)
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

class Categoria(models.Model):
    nombreCategoria = models.CharField(max_length=100)
    descripcionCategoria = models.TextField()

    def __str__(self):
        return self.nombreCategoria

class Producto(models.Model):
    nombreProducto = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cantidadMinima = models.IntegerField()
    cantidadActual = models.IntegerField()
    ultimaActualizacion = models.DateTimeField(auto_now=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)  # Asociación (0..* a 1)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.SET_NULL, null=True)  # Agregación: Producto depende del Proveedor

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
    
class Carrito(OrdenCompra):
    estado_carrito = models.BooleanField(default=True)

    def __str__(self):
        return f"Carrito de {self.usuario}"


class Pedido(OrdenCompra):  # Hereda de OrdenCompra
    estadoPedido = models.BooleanField(default=True)
    estadoPago = models.BooleanField(default=True)

    def __str__(self):
        return f"Pedido {self.id}"

class Reporte(models.Model):
    tipoReporte = models.CharField(max_length=100)
    fechaGeneracion = models.DateTimeField(auto_now_add=True)
    orden = models.ForeignKey(OrdenCompra, on_delete=models.CASCADE)  # Composición: Reporte depende de OrdenCompra

    def __str__(self):
        return f"Reporte {self.id}"
