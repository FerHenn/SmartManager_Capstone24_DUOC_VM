import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-crud-usuarios',
  templateUrl: './crud-usuarios.page.html',
  styleUrls: ['./crud-usuarios.page.scss'],
})
export class CrudUsuariosPage implements OnInit {
  usuarios: any[] = []; // Lista de usuarios
  editForm: FormGroup; // Formulario reactivo
  showEditForm = false; // Indica si el formulario de edición está visible
  selectedUsuario: any | null = null; // Usuario seleccionado para edición

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private alertController: AlertController
  ) {
    this.editForm = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.maxLength(100)]],
      numero_telefonico: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      rol: ['', [Validators.required]],
      estado_activo: [false],
    });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.authService.getUsuarios().subscribe({
      next: (data: any) => (this.usuarios = data),
      error: (err) => console.error('Error al cargar usuarios:', err),
    });
  }

  editarUsuario(usuario: any) {
    this.selectedUsuario = usuario;
    this.showEditForm = true;
    this.editForm.patchValue(usuario); // Cargar los datos del usuario en el formulario
  }

  guardarCambios() {
    if (this.editForm.valid && this.selectedUsuario) {
      const usuarioActualizado = this.editForm.getRawValue();
      usuarioActualizado.id = this.selectedUsuario.id; // Incluir el ID para la actualización

      this.authService.actualizarUsuario(usuarioActualizado).subscribe({
        next: () => {
          this.showEditForm = false;
          this.selectedUsuario = null;
          this.cargarUsuarios(); // Recargar la lista de usuarios
        },
        error: (err) => console.error('Error al actualizar usuario:', err),
      });
    }
  }

  cancelarEdicion() {
    this.showEditForm = false;
    this.selectedUsuario = null;
    this.editForm.reset();
  }

  eliminarUsuario(id: number) {
    this.alertController
      .create({
        header: 'Confirmar',
        message: '¿Estás seguro de eliminar este usuario?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.authService.eliminarUsuario(id).subscribe({
                next: () => this.cargarUsuarios(),
                error: (err) => console.error('Error al eliminar usuario:', err),
              });
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  openMenu() {
    console.log('Abrir menú');
  }
}
