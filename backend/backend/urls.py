from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import include_docs_urls  # Incluye documentación de API
from crud import views  # Importa las vistas de la app CRUD

# Definición de rutas principales del proyecto
urlpatterns = [
    path('admin/', admin.site.urls),  # Ruta para acceder al panel de administración de Django
    path('api/', include('crud.urls')),  # Incluye las URLs de la app CRUD para la API
    path('docs/', include_docs_urls(title='Crud documentation')),  # Documentación de la API con coreapi
]
if settings.DEBUG:  # Serve media files only in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)