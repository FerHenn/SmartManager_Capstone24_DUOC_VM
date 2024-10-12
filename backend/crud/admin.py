from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario,Proveedor,Categoria,Ingrediente,Producto,MetodoPago,OrdenCompra,Reporte

class UsuarioAdmin(UserAdmin):
    list_display = ('nombreUsuario', 'correo', 'nombre', 'apellido', 'estado_activo', 'usuario_administrador')
    search_fields = ('nombreUsuario', 'correo')
    readonly_fields = ('last_login',)
    
    ordering = ('nombreUsuario',)

    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()

admin.site.register(Usuario, UsuarioAdmin)

admin.site.register(Proveedor)
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(MetodoPago)
admin.site.register(OrdenCompra)
admin.site.register(Reporte)
admin.site.register(Ingrediente)