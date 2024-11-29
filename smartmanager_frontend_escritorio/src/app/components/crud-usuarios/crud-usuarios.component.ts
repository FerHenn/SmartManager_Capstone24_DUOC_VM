import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-crud-usuarios',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './crud-usuarios.component.html',
  styleUrls: ['./crud-usuarios.component.scss'],
})
export class CrudUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  displayedColumns: string[] = ['id', 'nombreUsuario', 'correo', 'nombre', 'apellido', 'numero_telefonico', 'estado_activo', 'acciones'];
  editForm: FormGroup;
  isCreating = false;
  showEditForm = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.editForm = this.fb.group({
      id: [null],
      nombreUsuario: [''],
      correo: [''],
      nombre: [''],
      apellido: [''],
      numero_telefonico: [''],
      estado_activo: [true],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.authService.getUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  crearUsuario() {
    this.isCreating = true;
    this.editForm.reset({ estado_activo: true });
  }

  editarUsuario(usuario: any) {
    this.showEditForm = true;
    this.editForm.patchValue(usuario);
  }

  guardarUsuario() {
    if (this.isCreating) {
      this.authService.register(this.editForm.value).subscribe(() => {
        this.isCreating = false;
        this.obtenerUsuarios();
      });
    } else if (this.showEditForm) {
      this.authService.actualizarUsuario(this.editForm.value).subscribe(() => {
        this.showEditForm = false;
        this.obtenerUsuarios();
      });
    }
  }

  eliminarUsuario(id: number, nombreUsuario: string) {
    const confirmacion = confirm(`¿Deseas eliminar al usuario "${nombreUsuario}"?`);
    if (confirmacion) {
      this.authService.eliminarUsuario(id).subscribe(() => {
        this.obtenerUsuarios();
        this.snackBar.open(`Usuario "${nombreUsuario}" eliminado`, 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      });
    }
  }

  cancelarFormulario() {
    this.isCreating = false;
    this.showEditForm = false;
  }
}
