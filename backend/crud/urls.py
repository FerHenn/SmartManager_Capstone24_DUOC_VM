from django.urls import path, include
from rest_framework import routers
from crud import views
from django.conf import settings
from django.conf.urls.static import static

router=routers.DefaultRouter()
router.register(r'usuarios', views.UsuarioViewSet)
router.register(r'proveedores', views.ProveedorViewSet)
router.register(r'categoria', views.CategoriaViewSet, basename='categoria')
router.register(r'producto', views.ProductoViewSet, basename='producto')
router.register(r'metodo de pago', views.MetodoPagoViewSet)
router.register(r'orden de compra', views.OrdenCompraViewSet)
router.register(r'reporte', views.ReporteViewSet)
router.register(r'ingrediente', views.IngredienteViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.RegistroUsuario.as_view(), name='registro'),
    path('login/', views.LoginUsuario.as_view(), name='login'),
    path('logout/', views.LogoutUsuario.as_view(), name='logout'),
    path('perfil/', views.PerfilUsuario.as_view(), name='perfil'),
    path('crear-orden/', views.CrearOrdenCompra.as_view(), name='crear-orden'),
    path('resumen-inventario-diario/', views.ResumenInventarioDiario.as_view(), name='resumen-inventario-diario'),
    path('reporte-ventas-diario/', views.ReporteVentasDiario.as_view(), name='reporte-ventas-diario'),
    path('reporte-ventas-mensual/', views.ReporteVentasMensual.as_view(), name='reporte-ventas-mensual'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
