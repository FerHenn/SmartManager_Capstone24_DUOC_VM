from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db.models import Sum
from .models import Usuario, Proveedor, Categoria, Ingrediente, Producto, MetodoPago, OrdenCompra, Reporte

# Personalización del panel de administración para el modelo Usuario
class UsuarioAdmin(UserAdmin):
    list_display = ('nombreUsuario', 'correo', 'nombre', 'apellido', 'estado_activo', 'usuario_administrador')  # Campos que se mostrarán en la lista de usuarios
    search_fields = ('nombreUsuario', 'correo')  # Campos que se pueden buscar
    readonly_fields = ('last_login',)  # Campos que serán solo de lectura
    ordering = ('nombreUsuario',)  # Ordenar por el nombre de usuario
    filter_horizontal = ()  # No se usa ningún filtro horizontal
    list_filter = ()  # No se usa ningún filtro
    fieldsets = ()  # No se usa ninguna sección de campos

# Personalización del panel de administración para el modelo OrdenCompra
class OrdenCompraAdmin(admin.ModelAdmin):
    readonly_fields = ['montoTotal']  # Hace que el campo montoTotal sea solo de lectura en el panel de administración

    # Sobrescribe el método para guardar la orden
    def save_model(self, request, obj, form, change):
        if not obj.pk:  # Si la orden no tiene ID, es una nueva orden
            obj.montoTotal = 0.00  # Asigna un valor inicial al montoTotal
            super().save_model(request, obj, form, change)
        
        # Calcula el monto total basado en los productos asociados a la orden
        productos = obj.productos.all()
        obj.montoTotal = productos.aggregate(Sum('precio'))['precio__sum'] or 0.00  # Suma los precios de los productos

        # Guarda nuevamente la orden con el monto actualizado
        super().save_model(request, obj, form, change)

# Registro de los modelos en el panel de administración
admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Proveedor)
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(MetodoPago)
admin.site.register(OrdenCompra, OrdenCompraAdmin)
admin.site.register(Reporte)
admin.site.register(Ingrediente)