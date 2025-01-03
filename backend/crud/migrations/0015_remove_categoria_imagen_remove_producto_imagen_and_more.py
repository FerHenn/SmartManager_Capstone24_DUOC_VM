# Generated by Django 5.1.2 on 2024-11-23 00:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crud', '0014_categoria_imagen'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='categoria',
            name='imagen',
        ),
        migrations.RemoveField(
            model_name='producto',
            name='imagen',
        ),
        migrations.AddField(
            model_name='categoria',
            name='imagen_path',
            field=models.CharField(blank=True, null=True, verbose_name='Imagen de categoría'),
        ),
        migrations.AddField(
            model_name='producto',
            name='imagen_path',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Imagen de producto'),
        ),
    ]
