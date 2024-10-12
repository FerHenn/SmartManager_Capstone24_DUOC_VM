from django.urls import path, include
from rest_framework import routers
from crud import views
from crud.views import RegistroUsuario, LoginUsuario, LogoutUsuario, PerfilUsuario, ListaUsuarios

router=routers.DefaultRouter()
router.register(r'Usuarios', views.UsuarioViewSet)
router.register(r'Proveedores', views.ProveedorViewSet)
router.register(r'Categoria', views.CategoriaViewSet)
router.register(r'Producto', views.ProductoViewSet)
router.register(r'Metodo de pago', views.MetodoPagoViewSet)
router.register(r'Orden de compra', views.OrdenCompraViewSet)
router.register(r'Reporte', views.ReporteViewSet)
router.register(r'Ingrediente', views.IngredienteViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegistroUsuario.as_view(), name='registro'),
    path('login/', LoginUsuario.as_view(), name='login'),
    path('logout/', LogoutUsuario.as_view(), name='logout'),
    path('perfil/', PerfilUsuario.as_view(), name='perfil'),
    path('usuarios/', ListaUsuarios.as_view(), name='lista-usuarios'),
]
