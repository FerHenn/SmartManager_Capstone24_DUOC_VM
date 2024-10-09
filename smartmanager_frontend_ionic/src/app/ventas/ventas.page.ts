import { Component } from '@angular/core';

// Definimos la interfaz Venta
interface Venta {
  producto: string;
  cantidad: number;
  precio: number;
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage {
  // Array de ventas, especificamos el tipo correctamente
  ventas: Venta[] = [];  
  
  // Inicializamos nuevaVenta con valores por defecto que no sean null
  nuevaVenta: Venta = {
    producto: '',
    cantidad: 0,
    precio: 0,
  };

  constructor() {}

  // Método para registrar una nueva venta
  registrarVenta() {
    // Verificar que el producto no sea vacío y que cantidad y precio sean válidos
    if (this.nuevaVenta.producto.trim() && this.nuevaVenta.cantidad > 0 && this.nuevaVenta.precio > 0) {
      // Agregamos una copia de nuevaVenta al array ventas
      this.ventas.push({ ...this.nuevaVenta });

      // Reiniciar nuevaVenta para registrar otra venta
      this.nuevaVenta = {
        producto: '',
        cantidad: 0,
        precio: 0,
      };

      console.log('Venta registrada:', this.ventas);
    } else {
      console.log('Por favor complete todos los campos correctamente.');
    }
  }
}
