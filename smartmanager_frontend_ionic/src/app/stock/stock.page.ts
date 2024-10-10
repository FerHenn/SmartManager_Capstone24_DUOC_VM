import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
})
export class StockPage {
  productos = [
    { nombre: 'Producto A', stock: 10 },
    { nombre: 'Producto B', stock: 5 },
    { nombre: 'Producto C', stock: 20 },
  ];

  constructor(private alertController: AlertController) {}

  guardarCambios(producto: any) {
    // Aquí podrías agregar lógica para guardar los cambios de stock, por ejemplo, en una API o base de datos
    console.log(`El producto ${producto.nombre} ha sido actualizado con ${producto.stock} unidades.`);
  }

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
}


