# Generated by Django 5.1.2 on 2024-11-23 20:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crud', '0016_remove_categoria_imagen_path_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='categoria',
            name='imagen',
            field=models.ImageField(blank=True, null=True, upload_to='images/categorias'),
        ),
        migrations.AlterField(
            model_name='producto',
            name='imagen',
            field=models.ImageField(blank=True, null=True, upload_to='images/productos'),
        ),
    ]