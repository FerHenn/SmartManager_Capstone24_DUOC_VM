import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
})
export class StockPage {
  // Lista de productos inicial
  productos = [
    { nombre: 'Producto A', stock: 10 },
    { nombre: 'Producto B', stock: 5 },
    { nombre: 'Producto C', stock: 20 },
  ];

  constructor(private alertController: AlertController) {}

  // Función para agregar un nuevo producto
  async agregarProducto() {
    const alert = await this.alertController.create({
      header: 'Agregar Producto',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del producto',
        },
        {
          name: 'stock',
          type: 'number',
          placeholder: 'Cantidad en stock',
          min: 0
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.nombre && data.stock >= 0) {
              this.productos.push({ nombre: data.nombre, stock: data.stock });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Función para guardar cambios en el stock de un producto
  guardarCambios(producto: any) {
    console.log(`El producto ${producto.nombre} ha sido actualizado con ${producto.stock} unidades.`);
  }

  // Función para eliminar un producto
  eliminarProducto(producto: any) {
    const index = this.productos.indexOf(producto);
    if (index > -1) {
      this.productos.splice(index, 1);
    }
  }
}
