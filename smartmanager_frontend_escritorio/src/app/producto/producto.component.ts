import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ProductoService, Producto } from './producto.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-producto',
  standalone: true,
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDividerModule,
    MatCardModule
  ],
  providers: [ProductoService]
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  productoForm: FormGroup;
  editMode = false;
  currentProductoId: number | null = null; // Cambiado a 'id'
  displayedColumns: string[] = ['nombreProducto', 'descripcion', 'precio', 'cantidadMinima', 'cantidadActual', 'categoria', 'proveedor', 'acciones'];

  constructor(private productoService: ProductoService, private fb: FormBuilder) {
    this.productoForm = this.fb.group({
      nombreProducto: ['', Validators.required],
      descripcion: [''],
      precio: [null, Validators.required],
      cantidadMinima: [null, Validators.required],
      cantidadActual: [null, Validators.required],
      categoria: [''],
      proveedor: ['']
    });
  }

  ngOnInit(): void {
    this.loadProductos();
    this.productoService.getProductos().subscribe(
      (data) => {
          console.log(data);
      },
      (error) => {
          console.error(error);
      }
  );
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  onSubmit(): void {
    if (this.editMode) {
      this.productoService.updateProducto(this.currentProductoId!, this.productoForm.value).subscribe(() => {
        this.loadProductos();
        this.resetForm();
      });
    } else {
      this.productoService.createProducto(this.productoForm.value).subscribe(() => {
        this.loadProductos();
        this.resetForm();
      });
    }
  }

  onEdit(producto: Producto): void {
    this.editMode = true;
    this.currentProductoId = producto.id; // Usa nombreProducto
    this.productoForm.patchValue(producto);
  }

  onDelete(id: number): void {
    this.productoService.deleteProducto(id).subscribe(() => {
      this.loadProductos();
    });
  }

  resetForm(): void {
    this.editMode = false;
    this.currentProductoId = null; // Cambiado a nombreProducto
    this.productoForm.reset();
  }
}