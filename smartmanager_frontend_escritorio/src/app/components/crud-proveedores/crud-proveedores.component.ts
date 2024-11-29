import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedorService, Proveedor } from '../../services/proveedor.service';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-proveedores',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './crud-proveedores.component.html',
  styleUrls: ['./crud-proveedores.component.scss'],
})
export class CrudProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = []; // Lista de proveedores
  errorMessage: string = ''; // Mensaje de error
  displayedColumns: string[] = ['id', 'nombre_proveedor', 'numero_telefonico', 'estado_activo', 'acciones'];

  // Estado del formulario
  showEditForm: boolean = false; 
  isCreating: boolean = false; 
  selectedProveedor: Proveedor | null = null; 
  editForm!: FormGroup; 

  constructor(
    private proveedorService: ProveedorService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
    this.initForm();
  }

  cargarProveedores(): void {
    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar proveedores.';
        console.error(err);
      },
    });
  }

  // Inicializar el formulario reactivo
  initForm(): void {
    this.editForm = this.fb.group({
      id: [{ value: '', disabled: true }], // Campo deshabilitado
      nombre_proveedor: ['', [Validators.required, Validators.maxLength(32)]],
      numero_telefonico: ['', [Validators.required, Validators.maxLength(12)]],
      estado_activo: [true, [Validators.required]],
    });
  }

  // Crear nuevo proveedor
  crearProveedor(): void {
    this.isCreating = true;
    this.showEditForm = false;

    this.editForm.reset({
      id: '',
      nombre_proveedor: '',
      numero_telefonico: '',
      estado_activo: true,
    });
  }

  guardarNuevoProveedor(): void {
    if (this.editForm.valid) {
      const nuevoProveedor: Proveedor = this.editForm.getRawValue();

      this.proveedorService.crearProveedor(nuevoProveedor).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Proveedor Creado',
            text: `El proveedor "${nuevoProveedor.nombre_proveedor}" ha sido creado exitosamente.`,
            confirmButtonColor: '#FF9800',
          });
          this.isCreating = false;
          this.cargarProveedores();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al crear el proveedor. Intenta de nuevo.',
            confirmButtonColor: '#FF9800',
          });
          console.error(err);
        },
      });
    }
  }

  // Editar proveedor
  editarProveedor(proveedor: Proveedor): void {
    this.selectedProveedor = proveedor;
    this.showEditForm = true;
    this.isCreating = false;

    this.editForm.patchValue({
      id: proveedor.id,
      nombre_proveedor: proveedor.nombre_proveedor,
      numero_telefonico: proveedor.numero_telefonico,
      estado_activo: proveedor.estado_activo,
    });
  }

  guardarCambios(): void {
    if (this.editForm.valid && this.selectedProveedor) {
      const proveedorActualizado = {
        ...this.selectedProveedor,
        ...this.editForm.getRawValue(),
      };

      this.proveedorService
        .actualizarProveedor(proveedorActualizado.id, proveedorActualizado)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Proveedor Actualizado',
              text: `El proveedor "${proveedorActualizado.nombre_proveedor}" ha sido actualizado exitosamente.`,
              confirmButtonColor: '#FF9800',
            });
            this.showEditForm = false;
            this.cargarProveedores();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al actualizar el proveedor. Intenta de nuevo.',
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
    this.selectedProveedor = null;
    this.editForm.reset();
  }

  eliminarProveedor(id: number): void {
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
        this.proveedorService.eliminarProveedor(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Proveedor Eliminado',
              text: 'El proveedor ha sido eliminado exitosamente.',
              confirmButtonColor: '#FF9800',
            });
            this.cargarProveedores();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al eliminar el proveedor. Intenta de nuevo.',
              confirmButtonColor: '#FF9800',
            });
            console.error(err);
          },
        });
      }
    });
  }
}
