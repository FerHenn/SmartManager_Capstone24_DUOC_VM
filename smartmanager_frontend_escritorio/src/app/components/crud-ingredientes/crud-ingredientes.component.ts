import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredienteService } from '../../services/ingrediente.service';
import { ProveedorService, Proveedor } from '../../services/proveedor.service';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

export interface Ingrediente {
  id?: number;
  nombreIngrediente: string;
  cantidadMinima: number;
  cantidadActual: number;
  proveedor: number | null; // Relación con el ID del proveedor
}

@Component({
  selector: 'app-crud-ingredientes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './crud-ingredientes.component.html',
  styleUrls: ['./crud-ingredientes.component.scss'],
})
export class CrudIngredientesComponent implements OnInit {
  ingredientes: Ingrediente[] = []; // Lista de ingredientes
  proveedores: Proveedor[] = []; // Lista de proveedores para el desplegable
  errorMessage: string = ''; // Mensaje de error
  displayedColumns: string[] = ['id', 'nombreIngrediente', 'cantidadMinima', 'cantidadActual', 'proveedor', 'acciones'];

  // Estado del formulario
  showEditForm: boolean = false; // Controla la visibilidad del formulario
  isCreating: boolean = false; // Controla la visibilidad del formulario de creación
  selectedIngrediente: Ingrediente | null = null; // Ingrediente seleccionado para editar
  editForm!: FormGroup; // Formulario reactivo

  constructor(
    private ingredienteService: IngredienteService,
    private proveedorService: ProveedorService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarIngredientes();
    this.cargarProveedores();
    this.initForm();
  }

  cargarIngredientes(): void {
    this.ingredienteService.getIngredientes().subscribe({
      next: (data) => {
        this.ingredientes = data;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar ingredientes.';
        console.error(err);
      },
    });
  }

  cargarProveedores(): void {
    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
      },
    });
  }

  initForm(): void {
    this.editForm = this.fb.group({
      id: [{ value: '', disabled: true }], // Campo deshabilitado
      nombreIngrediente: ['', [Validators.required, Validators.maxLength(100)]],
      cantidadMinima: [0, [Validators.required, Validators.min(0)]],
      cantidadActual: [0, [Validators.required, Validators.min(0)]],
      proveedor: [null], // ID del proveedor
    });
  }

  crearIngrediente(): void {
    this.isCreating = true;
    this.showEditForm = false;

    this.editForm.reset({
      id: '',
      nombreIngrediente: '',
      cantidadMinima: 0,
      cantidadActual: 0,
      proveedor: null,
    });
  }

  guardarNuevoIngrediente(): void {
    if (this.editForm.valid) {
      const nuevoIngrediente: Ingrediente = this.editForm.getRawValue();

      this.ingredienteService.crearIngrediente(nuevoIngrediente).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Ingrediente Creado',
            text: `El ingrediente "${nuevoIngrediente.nombreIngrediente}" ha sido creado exitosamente.`,
            confirmButtonColor: '#FF9800',
          });
          this.isCreating = false;
          this.cargarIngredientes();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al crear el ingrediente. Intenta de nuevo.',
            confirmButtonColor: '#FF9800',
          });
          console.error(err);
        },
      });
    }
  }

  editarIngrediente(ingrediente: Ingrediente): void {
    this.selectedIngrediente = ingrediente;
    this.showEditForm = true;
    this.isCreating = false;

    this.editForm.patchValue({
      id: ingrediente.id,
      nombreIngrediente: ingrediente.nombreIngrediente,
      cantidadMinima: ingrediente.cantidadMinima,
      cantidadActual: ingrediente.cantidadActual,
      proveedor: ingrediente.proveedor,
    });
  }

  guardarCambios(): void {
    if (this.editForm.valid && this.selectedIngrediente) {
      const ingredienteActualizado: Ingrediente = {
        ...this.editForm.getRawValue(),
        id: this.selectedIngrediente.id,
      };
  
      this.ingredienteService
        .actualizarIngrediente(ingredienteActualizado.id!, ingredienteActualizado)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Ingrediente Actualizado',
              text: `El ingrediente "${ingredienteActualizado.nombreIngrediente}" ha sido actualizado exitosamente.`,
              confirmButtonColor: '#FF9800',
            });
            this.showEditForm = false;
            this.cargarIngredientes(); // Recargar la lista actualizada
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al actualizar el ingrediente. Intenta de nuevo.',
              confirmButtonColor: '#FF9800',
            });
            console.error(err);
          },
        });
    }
  }

  cancelarCreacion(): void {
    this.isCreating = false;
    this.editForm.reset();
  }

  cancelarEdicion(): void {
    this.showEditForm = false;
    this.selectedIngrediente = null;
    this.editForm.reset();
  }

  eliminarIngrediente(id: number): void {
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
        this.ingredienteService.eliminarIngrediente(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Ingrediente Eliminado',
              text: 'El ingrediente ha sido eliminado exitosamente.',
              confirmButtonColor: '#FF9800',
            });
            this.cargarIngredientes(); // Actualiza la lista de ingredientes
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al eliminar el ingrediente. Intenta de nuevo.',
              confirmButtonColor: '#FF9800',
            });
            console.error(err);
          },
        });
      }
    });
  }
  
  getNombreProveedor(proveedorId: number | null): string {
    if (!proveedorId) {
      return 'No asignado';
    }
    const proveedor = this.proveedores.find((p) => p.id === proveedorId);
    return proveedor ? proveedor.nombre_proveedor : 'No asignado';
  }
}
