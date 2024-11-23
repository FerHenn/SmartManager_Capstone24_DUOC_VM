import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carrito: Producto[] = [];
  total: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    // Simulación de datos iniciales en el carrito
    this.carrito = [
      { id: 1, nombre: 'Producto A', precio: 1500, cantidad: 1 },
      { id: 2, nombre: 'Producto B', precio: 2500, cantidad: 2 },
    ];
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce(
      (suma, item) => suma + item.precio * item.cantidad,
      0
    );
  }

  cambiarCantidad(producto: Producto, nuevaCantidad: number): void {
    producto.cantidad = nuevaCantidad;
    this.calcularTotal();
  }

  eliminarProducto(id: number): void {
    this.carrito = this.carrito.filter((producto) => producto.id !== id);
    this.calcularTotal();
  }

  realizarCompra(): void {
    console.log('Compra realizada:', this.carrito);
    alert('¡Compra realizada con éxito!');
    this.carrito = []; // Vacía el carrito tras la compra
    this.calcularTotal();
    this.router.navigate(['/home']); // Redirige a la página principal
  }
}

