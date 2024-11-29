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
  styleUrls: ['./producto-carrito.component.scss']
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
      this.categorias = data.sort((a: any, b: any) => a.nombreCategoria.localeCompare(b.nombreCategoria));
    });
  }

  seleccionarCategoria(categoria: any) {
    this.categoriaSeleccionada = categoria;
    this.productosService.getProductosByCategoria(categoria.id).subscribe(
      (data) => {
        // Ordenar productos por stock y alfabéticamente
        this.productos = data.sort((a: any, b: any) => {
          if (b.cantidadActual !== a.cantidadActual) {
            return b.cantidadActual - a.cantidadActual; // Ordenar por stock
          }
          return a.nombreProducto.localeCompare(b.nombreProducto); // Ordenar alfabéticamente
        });
      },
      (error) => {
        console.error('Error al cargar productos de la categoría', error);
      }
    );
  }

  agregarAlCarrito(producto: any) {
    if (producto.cantidadActual === 0) {
      console.warn('El producto no tiene stock disponible.');
      return;
    }
    if (this.carrito[producto.id]) {
      if (this.carrito[producto.id].cantidad < producto.cantidadActual) {
        this.carrito[producto.id].cantidad += 1;
      } else {
        console.warn('No puedes agregar más de la cantidad en stock');
      }
    } else {
      this.carrito[producto.id] = { cantidad: 1, producto };
    }
  }

  quitarDelCarrito(producto: any) {
    if (this.carrito[producto.id]) {
      this.carrito[producto.id].cantidad -= 1;
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
    return Object.values(this.carrito);
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
        this.actualizarVista(); // Llamada a la función para actualizar la vista
      },
      (error) => {
        console.error('Error al crear la orden:', error);
        alert(`Error: ${error.error.error || 'No se pudo crear la orden.'}`);
      }
    );
  }
  
  // Método para recargar y actualizar el stock después de crear una orden
actualizarVista() {
  if (this.categoriaSeleccionada) {
    // Si hay una categoría seleccionada, recarga los productos de esa categoría
    this.productosService.getProductosByCategoria(this.categoriaSeleccionada.id).subscribe(
      (data) => {
        // Ordenar productos por stock y alfabéticamente
        this.productos = data.sort((a: any, b: any) => {
          if (b.cantidadActual !== a.cantidadActual) {
            return b.cantidadActual - a.cantidadActual; // Ordenar por stock
          }
          return a.nombreProducto.localeCompare(b.nombreProducto); // Ordenar alfabéticamente
        });
      },
      (error) => {
        console.error('Error al recargar los productos:', error);
      }
    );
  } else {
    // Si no hay categoría seleccionada, recarga las categorías
      this.cargarCategorias();
    }
  }

}
