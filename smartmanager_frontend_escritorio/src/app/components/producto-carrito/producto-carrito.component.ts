import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductoService } from '../../services/producto.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-producto-carrito',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './producto-carrito.component.html',
  styleUrl: './producto-carrito.component.scss'
})

export class ProductoCarritoComponent implements OnInit {
  categorias: any[] = [];
  productos: any[] = [];
  carrito: { [productoId: number]: { cantidad: number, producto: any } } = {};
  categoriaSeleccionada: any = null;
  metodosPago: any[] = [];  // Almacena los métodos de pago disponibles
  metodoPagoSeleccionado: number | null = null;
  carritoVisible = false;

  constructor(private productosService: ProductoService) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarMetodosPago();
  }

  cargarCategorias() {
    this.productosService.getCategorias().subscribe((data) => {
      this.categorias = data.sort((a, b) => a.nombreCategoria.localeCompare(b.nombreCategoria));
    });
  }

  seleccionarCategoria(categoria: any) {
    this.categoriaSeleccionada = categoria;
    this.productosService.getProductosByCategoria(categoria.id).subscribe(
      (data) => {
        this.productos = data;  // Cargar los productos de la categoría
      },
      (error) => {
        console.error('Error al cargar productos de la categoría', error);  // Registrar si hay errores
      }
    );
  }

  agregarAlCarrito(producto: any) {
    // Verifica si el producto ya está en el carrito
    if (this.carrito[producto.id]) {
      // Solo agrega si no excede el stock disponible
      if (this.carrito[producto.id].cantidad < producto.cantidadActual) {
        this.carrito[producto.id].cantidad += 1;
      } else {
        console.warn('No puedes agregar más de la cantidad en stock');
      }
    } else {
      // Si no está en el carrito, agrégalo con cantidad inicial de 1
      this.carrito[producto.id] = { cantidad: 1, producto };
    }
  }

  quitarDelCarrito(producto: any) {
    if (this.carrito[producto.id]) {
      // Disminuye la cantidad del producto en el carrito
      this.carrito[producto.id].cantidad -= 1;
      
      // Si la cantidad es 0 o menor, elimina el producto del carrito
      if (this.carrito[producto.id].cantidad <= 0) {
        delete this.carrito[producto.id];
      }
    }
  }

  retroceder() {
    this.categoriaSeleccionada = null;
    this.productos = [];
  }

  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }

  getCarritoItems() {
    return Object.values(this.carrito); // Devuelve los elementos del carrito
  }

  calcularTotal() {
    return this.getCarritoItems().reduce((total, item) => {
      return total + item.cantidad * item.producto.precio;
    }, 0);
  }

  vaciarCarrito() {
    this.carrito = {};
  }

  cargarMetodosPago() {
    this.productosService.getMetodosPago().subscribe(
      (metodos) => {
        this.metodosPago = metodos;
      },
      (error) => {
        console.error('Error al cargar métodos de pago:', error);
      }
    );
  }

  crearOrden() {
    if (!this.metodoPagoSeleccionado) {
      alert('Seleccione un método de pago.');
      return;
    }

    const productos = this.getCarritoItems().map((item) => ({
      producto_id: item.producto.id,
      cantidad: item.cantidad
    }));

    this.productosService.crearOrden(productos, this.metodoPagoSeleccionado).subscribe(
      (response) => {
        alert('Orden creada con éxito.');
        this.vaciarCarrito();
      },
      (error) => {
        console.error('Error al crear la orden:', error);
        alert(`Error: ${error.error.error || 'No se pudo crear la orden.'}`);
      }
    );
  }
}