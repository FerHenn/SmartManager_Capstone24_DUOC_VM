from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db.models import Sum
from .models import Usuario,Proveedor,Categoria,Ingrediente,Producto,MetodoPago,OrdenCompra,Reporte

class UsuarioAdmin(UserAdmin):
    list_display = ('nombreUsuario', 'correo', 'nombre', 'apellido', 'estado_activo', 'usuario_administrador')
    search_fields = ('nombreUsuario', 'correo')
    readonly_fields = ('last_login',)
    
    ordering = ('nombreUsuario',)

    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()
    
class OrdenCompraAdmin(admin.ModelAdmin):
    readonly_fields = ['montoTotal']  # Evitar que el montoTotal se modifique directamente

    def save_model(self, request, obj, form, change):
        # Si es la primera vez que se guarda la orden (no tiene ID aún)
        if not obj.pk:
            obj.montoTotal = 0.00  # Proveer un valor inicial por defecto para evitar el error de "no nulo"
            super().save_model(request, obj, form, change)
        
        # Luego, una vez que la orden tiene un ID, se calcula el monto total basado en los productos asociados
        productos = obj.productos.all()
        obj.montoTotal = productos.aggregate(Sum('precio'))['precio__sum'] or 0.00

        # Guardar nuevamente la orden con el monto total actualizado
        super().save_model(request, obj, form, change)

admin.site.register(Usuario, UsuarioAdmin)

admin.site.register(Proveedor)
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(MetodoPago)
admin.site.register(OrdenCompra, OrdenCompraAdmin)
admin.site.register(Reporte)
admin.site.register(Ingrediente)