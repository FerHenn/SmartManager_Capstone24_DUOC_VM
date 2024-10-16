import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'; // Ubicación correcta de MatOptionModule
import { ImageModule } from 'primeng/image';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, RouterModule,MatSelectModule,MatOptionModule,ImageModule],
  selector: 'app-producto-lista',
  templateUrl: './producto-lista.component.html',
})
export class ProductoListaComponent implements OnInit {
  productos: any[] = [];
  displayedColumns: string[] = ['id', 'nombreProducto', 'descripcion', 'imagen', 'precio', 'cantidadMinima', 'cantidadActual', 'categoria', 'ingredientes', 'acciones'];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe((data) => {
      this.productos = data;
    });
  }

  deleteProducto(id: number) {
    this.productoService.deleteProducto(id).subscribe(() => {
      this.productos = this.productos.filter((p) => p.id !== id);
    });
  }
}
