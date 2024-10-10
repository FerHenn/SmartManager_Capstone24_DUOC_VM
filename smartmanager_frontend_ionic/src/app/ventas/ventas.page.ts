import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage {
  ventas = [
    { producto: 'Producto A', cantidad: 2, precio: 15 },
    { producto: 'Producto B', cantidad: 1, precio: 30 },
    { producto: 'Producto C', cantidad: 3, precio: 10 },
  ];

  constructor(private alertController: AlertController) {}

  guardarCambios(venta: any) {
    // Aquí podrías agregar lógica para guardar los cambios de venta, por ejemplo, en una API o base de datos
    console.log(`La venta de ${venta.cantidad} unidades de ${venta.producto} ha sido actualizada.`);
  }

  async agregarVenta() {
    const alert = await this.alertController.create({
      header: 'Agregar Venta',
      inputs: [
        {
          name: 'producto',
          type: 'text',
          placeholder: 'Nombre del producto',
        },
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'Cantidad',
          min: 1,
        },
        {
          name: 'precio',
          type: 'number',
          placeholder: 'Precio',
          min: 0,
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
            if (data.producto && data.cantidad > 0 && data.precio >= 0) {
              this.ventas.push({ producto: data.producto, cantidad: data.cantidad, precio: data.precio });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  eliminarVenta(index: number) {
    this.ventas.splice(index, 1);
    console.log(`Venta en el índice ${index} eliminada.`);
  }
}