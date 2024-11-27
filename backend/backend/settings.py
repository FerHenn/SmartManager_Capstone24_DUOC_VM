"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 4.2.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
import dj_database_url
import os

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-4a6pjyw3!3jf-vyg&+v3)#%edirom@j5*0y3&@!-=u)xh43p*r'

# SECURITY WARNING: don't run with debug turned on in production!
# Debug debe estar desactivado en producción para evitar fugas de información sensible
DEBUG = True

# Hosts permitidos para acceder a la aplicación
ALLOWED_HOSTS = [
    'smartmanager-capstone24-duoc-vm.onrender.com',
    '0.0.0.0',
    '127.0.0.1'   #agregado solo para trabajar localmente si no eliminar.
]

# Confianza para orígenes CSRF (protección contra ataques Cross-Site Request Forgery)
CSRF_TRUSTED_ORIGINS = ['https://smartmanager-capstone24-duoc-vm.onrender.com']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',  # Django REST framework para crear APIs
    'rest_framework.authtoken',  # Soporte para autenticación con tokens
    'corsheaders',  # Para permitir solicitudes entre dominios (CORS)
    'coreapi',  # Documentación de APIs
    'crud',  # Aplicación personalizada para gestión de datos
    'django_filters',  # Soporte para filtros en las APIs
]

# Middleware para manejar diversas operaciones HTTP y seguridad
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Para manejar CORS
    'django.middleware.security.SecurityMiddleware',  # Seguridad general
    'django.contrib.sessions.middleware.SessionMiddleware',  # Manejo de sesiones
    'django.middleware.common.CommonMiddleware',  # Operaciones generales
    'django.middleware.csrf.CsrfViewMiddleware',  # Protección CSRF
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # Manejo de autenticación
    'django.contrib.messages.middleware.MessageMiddleware',  # Manejo de mensajes
    'django.middleware.clickjacking.XFrameOptionsMiddleware',  # Protección contra Clickjacking
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Manejo de archivos estáticos en producción
    
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# Configuración de la base de datos de azure
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # Motor PostgreSQL
        'NAME': 'smartmanagerdb',  # Nombre de la base de datos
        'USER': 'tipopipo',  # Usuario de la base de datos
        'PASSWORD': 'Pipo_1234',  # Contraseña de la base de datos
        'HOST': 'dbsmartmanagertp.postgres.database.azure.com',  # Host del servidor
        'PORT': '5432',  # Puerto de PostgreSQL
        'OPTIONS': {
            'sslmode': 'require',  # Usa conexión segura
        },
    }
}

# # Configuración adicional de la base de datos para entorno de despliegue
# DATABASES = {
#     'default': dj_database_url.config(
#         default=os.getenv('DATABASE_URL'),
#         conn_max_age=600,  # Optimiza la reutilización de conexiones
#         ssl_require=True,
#     )
# }




# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Especifica el modelo de usuario personalizado
AUTH_USER_MODEL = 'crud.Usuario'

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'es-es'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

# Configuración de CORS para permitir solicitudes desde el frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",  # Permite el frontend local (Angular)
]

CORS_ALLOW_ALL_ORIGINS = True # Permite solicitudes de cualquier origen (desactivar en producción)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Configuración de archivos estáticos y medios
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configuración del framework REST
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "rest_framework.schemas.coreapi.AutoSchema",
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework.authentication.TokenAuthentication'],
}

# Agrega barra al final de las URLs si es necesario
APPEND_SLASH = False

# Configuración del almacenamiento de archivos estáticos en producción
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'