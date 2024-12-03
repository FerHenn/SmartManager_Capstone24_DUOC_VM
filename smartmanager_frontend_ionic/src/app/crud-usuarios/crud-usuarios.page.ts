import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertController, IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-crud-usuarios',
  templateUrl: './crud-usuarios.page.html',
  styleUrls: ['./crud-usuarios.page.scss'],
})
export class CrudUsuariosPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  usuarios: any[] = [];
  editForm: FormGroup;
  createForm: FormGroup;
  showEditForm = false;
  showCreateForm = false;
  selectedUsuario: any | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private cdr: ChangeDetectorRef
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

    this.createForm = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.maxLength(100)]],
      numero_telefonico: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      rol: ['', [Validators.required]],
      estado_activo: [false],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  openMenu() {
    console.log('Menú abierto.');
  }

  cargarUsuarios() {
    this.authService.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = data;
      },
      error: (err) => console.error('Error al cargar usuarios:', err),
    });
  }

  mostrarFormularioCreacion() {
    this.showEditForm = false; // Ocultar formulario de edición
    this.showCreateForm = true; // Mostrar formulario de creación
    this.createForm.reset(); // Limpiar el formulario
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  guardarNuevoUsuario() {
    if (!this.createForm.valid) {
      console.error('Formulario de creación inválido.');
      return;
    }

    const nuevoUsuario = { ...this.createForm.getRawValue() };

    this.authService.crearUsuario(nuevoUsuario).subscribe({
      next: () => {
        this.showSuccessMessage('Usuario creado correctamente.');
        this.showCreateForm = false;
        this.createForm.reset();
        this.cargarUsuarios();
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        if (err.error?.password) {
          this.showErrorMessage('La contraseña es obligatoria y debe tener al menos 6 caracteres.');
        }
      },
    });
  }

  editarUsuario(usuario: any) {
    this.selectedUsuario = usuario;
    this.showCreateForm = false; // Ocultar formulario de creación
    this.showEditForm = true; // Mostrar formulario de edición

    this.editForm.patchValue({
      nombreUsuario: usuario.nombreUsuario || '',
      correo: usuario.correo || '',
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      numero_telefonico: usuario.numero_telefonico || '',
      rol: usuario.role || '',
      estado_activo: usuario.estado_activo || false,
    });

    this.cdr.detectChanges();
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  guardarCambios() {
    if (!this.selectedUsuario) {
      console.error('No se ha seleccionado un usuario para editar.');
      return;
    }

    const usuarioActualizado = { ...this.editForm.getRawValue() };
    usuarioActualizado.id = this.selectedUsuario.id;

    // Mantener la contraseña actual
    usuarioActualizado.password = this.selectedUsuario.password;

    this.authService.actualizarUsuario(usuarioActualizado).subscribe({
      next: () => {
        this.showSuccessMessage('Usuario actualizado correctamente.');
        this.showEditForm = false;
        this.selectedUsuario = null;
        this.cargarUsuarios();
      },
      error: (err) => console.error('Error al actualizar usuario:', err),
    });
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
                next: () => {
                  this.showSuccessMessage('Usuario eliminado correctamente.');
                  this.cargarUsuarios();
                },
                error: (err) => console.error('Error al eliminar usuario:', err),
              });
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  cancelarCreacion() {
    this.showCreateForm = false;
    this.createForm.reset();
  }

  async showSuccessMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showErrorMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(500);
    }, 100);
  }
}
