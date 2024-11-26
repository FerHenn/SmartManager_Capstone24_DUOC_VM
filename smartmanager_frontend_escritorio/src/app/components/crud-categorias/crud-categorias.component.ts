import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import Swal from 'sweetalert2';
import { Categoria } from '../../interfaces/categoria.interface';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-crud-categorias',
  standalone: true,
  templateUrl: './crud-categorias.component.html',
  styleUrls: ['./crud-categorias.component.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
  ],
})
export class CrudCategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  selectedCategoria: Categoria | null = null;

  editForm: FormGroup;
  showEditForm: boolean = false;
  isCreating: boolean = false;
  displayedColumns: string[] = ['id', 'nombreCategoria', 'descripcionCategoria', 'imagen', 'acciones'];

  constructor(private categoriaService: CategoriaService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      id: null,
      nombreCategoria: '',
      descripcionCategoria: '',
      imagen: null,
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => (this.categorias = categorias),
      error: (err) => console.error('Error al cargar categorías:', err),
    });
  }

  crearCategoria(): void {
    this.editForm.reset();
    this.isCreating = true;
    this.showEditForm = false;
  }

  guardarNuevaCategoria(): void {
    if (this.editForm.valid) {
      const formData = this.buildFormData(this.editForm.getRawValue());
      this.categoriaService.crearCategoria(formData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Categoría creada correctamente.', 'success');
          this.cargarCategorias();
          this.isCreating = false;
        },
        error: (err) => {
          console.error('Error al crear categoría:', err);
          Swal.fire('Error', 'No se pudo crear la categoría.', 'error');
        },
      });
    }
  }

  editarCategoria(categoria: Categoria): void {
    this.selectedCategoria = categoria;
    this.showEditForm = true;
    this.isCreating = false;

    this.editForm.patchValue({
      id: categoria.id,
      nombreCategoria: categoria.nombreCategoria,
      descripcionCategoria: categoria.descripcionCategoria,
    });
  }

  guardarCambios(): void {
    if (this.editForm.valid && this.selectedCategoria) {
      const formData = this.buildFormData(this.editForm.getRawValue());
      this.categoriaService.actualizarCategoria(this.selectedCategoria.id!, formData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Categoría actualizada correctamente.', 'success');
          this.cargarCategorias();
          this.showEditForm = false;
        },
        error: (err) => {
          console.error('Error al actualizar categoría:', err);
          Swal.fire('Error', 'No se pudo actualizar la categoría.', 'error');
        },
      });
    }
  }

  eliminarCategoria(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.eliminarCategoria(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La categoría ha sido eliminada.', 'success');
            this.cargarCategorias();
          },
          error: (err) => {
            console.error('Error al eliminar categoría:', err);
            Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
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
    this.selectedCategoria = null;
  }


  buildFormData(data: any): FormData {
    const formData = new FormData();
    formData.append('nombreCategoria', data.nombreCategoria);
    formData.append('descripcionCategoria', data.descripcionCategoria);
    if (data.imagen) {
      formData.append('imagen', data.imagen);
    }
    return formData;
  }
  
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.editForm.patchValue({ imagen: file });
    }
  }
}
