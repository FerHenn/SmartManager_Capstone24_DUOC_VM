from django.urls import path, include
from rest_framework import routers
from crud import views

router=routers.DefaultRouter()
router.register(r'Usuarios', views.UsuarioViewSet)
router.register(r'Proveedores', views.ProveedorViewSet)
router.register(r'Categoria', views.CategoriaViewSet)
router.register(r'Producto', views.ProductoViewSet)
router.register(r'MetodoPago', views.MetodoPagoViewSet)
router.register(r'OrdenCompra', views.OrdenCompraViewSet)
router.register(r'Reporte', views.ReporteViewSet)

urlpatterns = [
    path('', include(router.urls))
]
