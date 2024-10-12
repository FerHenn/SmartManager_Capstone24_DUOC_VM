from django.urls import path, include
from rest_framework import routers
from crud import views
from crud.views import RegistroUsuario, LoginUsuario, LogoutUsuario, PerfilUsuario, ListaUsuarios

router=routers.DefaultRouter()
router.register(r'usuarios', views.UsuarioViewSet)
router.register(r'proveedores', views.ProveedorViewSet)
router.register(r'categoria', views.CategoriaViewSet)
router.register(r'producto', views.ProductoViewSet)
router.register(r'metodo de pago', views.MetodoPagoViewSet)
router.register(r'orden de compra', views.OrdenCompraViewSet)
router.register(r'reporte', views.ReporteViewSet)
router.register(r'ingrediente', views.IngredienteViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegistroUsuario.as_view(), name='registro'),
    path('login/', LoginUsuario.as_view(), name='login'),
    path('logout/', LogoutUsuario.as_view(), name='logout'),
    path('perfil/', PerfilUsuario.as_view(), name='perfil'),
]
