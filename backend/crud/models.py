from django.db import models

class Usuario(models.Model):
    nombre = models.CharField(max_length=32)
    apellido = models.CharField(max_length=32)
    telefono = models.CharField(max_length=12, unique=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


