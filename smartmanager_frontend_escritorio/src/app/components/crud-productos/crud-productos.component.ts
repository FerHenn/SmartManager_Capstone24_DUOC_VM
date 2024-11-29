import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { ProveedorService } from '../../services/proveedor.service';
import { IngredienteService } from '../../services/ingrediente.service';
import Swal from 'sweetalert2';
import { Producto, Categoria, Proveedor, Ingrediente } from '../../interfaces/producto.interface';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-crud-productos',
  standalone: true,
  templateUrl: './crud-productos.component.html',
  styleUrls: ['./crud-productos.component.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
  ],
})
export class CrudProductosComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];
  ingredientes: Ingrediente[] = [];
  selectedProducto: Producto | null = null;

  modalAbierto: boolean = false; // Estado del modal
  modalIngredientes: Ingrediente[] = []; // Ingredientes a mostrar

  editForm: FormGroup;
  showEditForm: boolean = false;
  isCreating: boolean = false;
  displayedColumns: string[] = [
    'id',
    'nombreProducto',
    'precio',
    'cantidadActual',
    'cantidadMinima',
    'proveedor',
    'ingredientes',
    'acciones',
  ];

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private ingredienteService: IngredienteService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      id: null,
      nombreProducto: '',
      descripcion: '',
      precio: 0,
      cantidadMinima: null,
      cantidadActual: 0,
      categoria: null,
      proveedor: null,
      ingredientes: [], // Inicializado como arreglo vacío
      imagen: null,
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarProveedores();
    this.cargarIngredientes();
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos.map(producto => ({
          ...producto,
          ingredientes: producto.ingredientes || [], // Asegurarse de que siempre haya un arreglo
        }));
      },
      error: (err) => console.error('Error al cargar productos:', err),
    });
  }
  

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => (this.categorias = categorias),
      error: (err) => console.error('Error al cargar categorías:', err),
    });
  }

  cargarProveedores(): void {
    this.proveedorService.getProveedores().subscribe({
      next: (proveedores) => (this.proveedores = proveedores),
      error: (err) => console.error('Error al cargar proveedores:', err),
    });
  }

  cargarIngredientes(): void {
    this.ingredienteService.getIngredientes().subscribe({
      next: (ingredientes) => (this.ingredientes = ingredientes),
      error: (err) => console.error('Error al cargar ingredientes:', err),
    });
  }

  crearProducto(): void {
    this.editForm.reset();
    this.isCreating = true;
    this.showEditForm = false;
  }

  guardarNuevoProducto(): void {
    if (this.editForm.valid) {
      const formData = this.buildFormData(this.editForm.getRawValue());
      this.productoService.crearProducto(formData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Producto creado correctamente.', 'success');
          this.cargarProductos();
          this.isCreating = false;
        },
        error: (err) => {
          console.error('Error al crear producto:', err);
          Swal.fire('Error', 'No se pudo crear el producto.', 'error');
        },
      });
    }
  }

  editarProducto(producto: Producto): void {
    this.selectedProducto = producto;
    this.showEditForm = true;
    this.isCreating = false;

    this.editForm.patchValue({
      id: producto.id,
      nombreProducto: producto.nombreProducto,
      descripcion: producto.descripcion,
      precio: producto.precio,
      cantidadMinima: producto.cantidadMinima,
      cantidadActual: producto.cantidadActual,
      categoria: this.categorias.find((c) => c.id === producto.categoria?.id) || null,
      proveedor: this.proveedores.find((p) => p.id === producto.proveedor?.id) || null,
      ingredientes: producto.ingredientes || [], // Asegurar arreglo
    });
  }

  guardarCambios(): void {
    if (this.editForm.valid && this.selectedProducto) {
      const formData = this.buildFormData(this.editForm.getRawValue());
      this.productoService.actualizarProducto(this.selectedProducto.id!, formData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Producto actualizado correctamente.', 'success');
          this.cargarProductos();
          this.showEditForm = false;
        },
        error: (err) => {
          console.error('Error al actualizar producto:', err);
          Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
        },
      });
    }
  }

  eliminarProducto(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            this.cargarProductos();
          },
          error: (err) => {
            console.error('Error al eliminar producto:', err);
            Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
          },
        });
      }
    });
  }

  cancelarCreacion(): void {
    this.isCreating = false;
    this.editForm.reset();
  }

  cancelarEdicion(): void {
    this.showEditForm = false;
    this.editForm.reset();
    this.selectedProducto = null;
  }

  buildFormData(data: any): FormData {
    const formData = new FormData();
    formData.append('nombreProducto', data.nombreProducto);
    formData.append('descripcion', data.descripcion);
    formData.append('precio', data.precio.toString());
    formData.append('cantidadMinima', data.cantidadMinima?.toString() || '');
    formData.append('cantidadActual', data.cantidadActual.toString());
    formData.append('categoria_id', data.categoria?.id || '');
    formData.append('proveedor_id', data.proveedor?.id || '');
    const ingredientesIds = data.ingredientes ? data.ingredientes.map((ing: Ingrediente) => ing.id) : [];
    formData.append('ingredientes', JSON.stringify(ingredientesIds));

    if (data.imagen) {
      formData.append('imagen', data.imagen);
    }

    return formData;
  }

  getIngredientesNombres(ingredientes: Ingrediente[]): string {
    return ingredientes.map((ing) => ing.nombreIngrediente).join(', ');
  }

  isIngredienteSelected(ingrediente: Ingrediente): boolean {
    const ingredientes = this.editForm.value.ingredientes || [];
    return ingredientes.some((ing: Ingrediente) => ing.id === ingrediente.id);
  }

  onCheckboxChange(event: any, ingrediente: Ingrediente): void {
    let ingredientes = this.editForm.value.ingredientes || [];
    if (event.target.checked) {
      ingredientes.push(ingrediente);
    } else {
      ingredientes = ingredientes.filter((ing: Ingrediente) => ing.id !== ingrediente.id);
    }
    this.editForm.patchValue({ ingredientes });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.editForm.patchValue({ imagen: file });
    }
  }
  verIngredientes(producto: Producto): void {
    console.log('Producto seleccionado:', producto); // Para verificar el producto
    if (producto.ingredientes && producto.ingredientes.length > 0) {
      this.modalIngredientes = producto.ingredientes; // Asignar ingredientes al modal
      this.modalAbierto = true; // Abrir el modal
      console.log('Ingredientes cargados:', this.modalIngredientes); // Verificar los ingredientes
    } else {
      Swal.fire('Información', 'Este producto no tiene ingredientes.', 'info');
    }
  }

  cerrarModal(): void {
    this.modalAbierto = false; // Cerrar el modal
    this.modalIngredientes = []; // Limpiar los datos
  }  
}