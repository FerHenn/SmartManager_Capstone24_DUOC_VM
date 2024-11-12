import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto-carrito',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe],
  templateUrl: './producto-carrito.component.html',
  styleUrl: './producto-carrito.component.scss'
})

export class ProductoCarritoComponent implements OnInit {
  categorias: any[] = [];
  productos: any[] = [];
  carrito: { [productoId: number]: { cantidad: number, producto: any } } = {};
  categoriaSeleccionada: any = null;

  constructor(private productosService: ProductoService) {}

  ngOnInit(): void {
    this.cargarCategorias();
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
      // Disminuye la cantidad y revisa si debe quedarse en 0
      this.carrito[producto.id].cantidad -= 1;
  
      // Si la cantidad es 0, mantenlo en 0 en lugar de eliminarlo
      if (this.carrito[producto.id].cantidad <= 0) {
        this.carrito[producto.id].cantidad = 0;
      }
    }
  }

  retroceder() {
    this.categoriaSeleccionada = null;
    this.productos = [];
  }
}