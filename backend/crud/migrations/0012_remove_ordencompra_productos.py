# Generated by Django 5.1.2 on 2024-10-15 00:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crud', '0011_alter_producto_cantidadactual_productoorden'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ordencompra',
            name='productos',
        ),
    ]