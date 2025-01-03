# Generated by Django 5.1.2 on 2024-10-11 20:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crud', '0002_ingrediente_producto_ingredientes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producto',
            name='cantidadActual',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='producto',
            name='cantidadMinima',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='producto',
            name='imagen',
            field=models.ImageField(max_length=200, null=True, upload_to='', verbose_name='Imagen de producto'),
        ),
    ]
