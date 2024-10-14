# Generated by Django 5.1.2 on 2024-10-14 19:10

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crud', '0008_alter_producto_ingredientes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingrediente',
            name='proveedor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='crud.proveedor'),
        ),
    ]
