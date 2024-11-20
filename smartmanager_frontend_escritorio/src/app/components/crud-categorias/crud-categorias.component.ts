import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-categorias',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './crud-categorias.component.html',
  styleUrls: ['./crud-categorias.component.scss'],
})
export class CrudCategoriasComponent implements OnInit {
  categorias: Categoria[] = []; // Lista de categorías
  errorMessage: string = ''; // Mensaje de error
  displayedColumns: string[] = ['id', 'nombreCategoria', 'descripcionCategoria', 'imagen', 'acciones'];

  // Estado del formulario
  showEditForm: boolean = false; // Controla la visibilidad del formulario
  isCreating: boolean = false; // Controla la visibilidad del formulario de creación
  selectedCategoria: Categoria | null = null; // Categoría seleccionada para editar
  editForm!: FormGroup; // Formulario reactivo
  imagenSeleccionada: File | null = null; // Archivo de imagen seleccionado

  constructor(
    private categoriaService: CategoriaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.initForm();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar categorías.';
        console.error(err);
      },
    });
  }

  initForm(): void {
    this.editForm = this.fb.group({
      id: [{ value: '', disabled: true }], // Campo deshabilitado
      nombreCategoria: ['', [Validators.required, Validators.maxLength(100)]],
      descripcionCategoria: ['', [Validators.required]],
      imagen: [''], // Imagen como string o archivo
    });
  }

  // Manejar archivo seleccionado
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }

  crearCategoria(): void {
    this.isCreating = true;
    this.showEditForm = false;

    this.editForm.reset({
      id: '',
      nombreCategoria: '',
      descripcionCategoria: '',
      imagen: '',
    });
  }

  guardarNuevaCategoria(): void {
    if (this.editForm.valid) {
      const nuevaCategoria: Categoria = {
        ...this.editForm.getRawValue(),
        imagen: this.imagenSeleccionada, // Archivo seleccionado
      };

      this.categoriaService.crearCategoria(nuevaCategoria).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Categoría Creada',
            text: `La categoría "${nuevaCategoria.nombreCategoria}" ha sido creada exitosamente.`,
            confirmButtonColor: '#FF9800',
          });
          this.isCreating = false;
          this.cargarCategorias();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al crear la categoría. Intenta de nuevo.',
            confirmButtonColor: '#FF9800',
          });
          console.error(err);
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
      imagen: '', // Imagen vacía para que el usuario pueda subir una nueva
    });
  }

  guardarCambios(): void {
    if (this.editForm.valid && this.selectedCategoria) {
      const categoriaActualizada: Categoria = {
        ...this.editForm.getRawValue(),
        id: this.selectedCategoria.id,
        imagen: this.imagenSeleccionada || this.selectedCategoria.imagen, // Usar imagen seleccionada o mantener la actual
      };

      this.categoriaService
        .actualizarCategoria(categoriaActualizada.id, categoriaActualizada)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Categoría Actualizada',
              text: `La categoría "${categoriaActualizada.nombreCategoria}" ha sido actualizada exitosamente.`,
              confirmButtonColor: '#FF9800',
            });
            this.showEditForm = false;
            this.cargarCategorias();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al actualizar la categoría. Intenta de nuevo.',
              confirmButtonColor: '#FF9800',
            });
            console.error(err);
          },
        });
    }
  }

  cancelarCreacion(): void {
    this.isCreating = false;
    this.imagenSeleccionada = null;
    this.editForm.reset();
  }

  cancelarEdicion(): void {
    this.showEditForm = false;
    this.selectedCategoria = null;
    this.imagenSeleccionada = null;
    this.editForm.reset();
  }

  eliminarCategoria(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF9800',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.eliminarCategoria(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Categoría Eliminada',
              text: 'La categoría ha sido eliminada exitosamente.',
              confirmButtonColor: '#FF9800',
            });
            this.cargarCategorias();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al eliminar la categoría. Intenta de nuevo.',
              confirmButtonColor: '#FF9800',
            });
            console.error(err);
          },
        });
      }
    });
  }
}
