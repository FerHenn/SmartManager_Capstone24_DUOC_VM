import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertController, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-crud-usuarios',
  templateUrl: './crud-usuarios.page.html',
  styleUrls: ['./crud-usuarios.page.scss'],
})
export class CrudUsuariosPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  usuarios: any[] = [];
  createForm: FormGroup;
  editForm: FormGroup;
  showCreateForm = false;
  showEditForm = false;
  selectedUsuario: any | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    // Formulario de creación
    this.createForm = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.maxLength(100)]],
      numero_telefonico: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      estado_activo: [true],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', Validators.required],
    });

    // Formulario de edición (sin campo de contraseña)
    this.editForm = this.fb.group({
      id: [null],
      nombreUsuario: ['', [Validators.required, Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.maxLength(100)]],
      numero_telefonico: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      estado_activo: [true],
      rol: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.authService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      },
    });
  }

  mostrarFormularioCreacion() {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.createForm.reset({ estado_activo: true });
    this.scrollToBottom();
  }

  guardarNuevoUsuario() {
    if (!this.createForm.valid) {
      console.error('Formulario inválido para crear usuario.');
      return;
    }

    const nuevoUsuario = { ...this.createForm.value };
    // Asignar explícitamente el campo usuario_administrador en base al rol
    nuevoUsuario.usuario_administrador = nuevoUsuario.rol === 'Administrador';

    this.authService.register(nuevoUsuario).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.obtenerUsuarios();
        this.showSuccessMessage('Usuario creado correctamente.');
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.showErrorMessage('Error al crear usuario. Verifica los datos.');
      },
    });
  }

  editarUsuario(usuario: any) {
    this.selectedUsuario = usuario;
    this.showCreateForm = false;
    this.showEditForm = true;

    this.editForm.patchValue({
      id: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      correo: usuario.correo,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      numero_telefonico: usuario.numero_telefonico,
      estado_activo: usuario.estado_activo,
      rol: usuario.role,
    });
    this.scrollToBottom();
  }

  guardarCambios() {
    if (!this.selectedUsuario) {
      console.error('No hay un usuario seleccionado para editar.');
      return;
    }

    const usuarioActualizado = { ...this.editForm.value };
    // Configurar automáticamente el campo usuario_administrador
    usuarioActualizado.usuario_administrador = usuarioActualizado.rol === 'Administrador';

    this.authService.actualizarUsuario(usuarioActualizado).subscribe({
      next: () => {
        this.showEditForm = false;
        this.selectedUsuario = null;
        this.obtenerUsuarios();
        this.showSuccessMessage('Usuario actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        this.showErrorMessage('Error al actualizar usuario. Verifica los datos.');
      },
    });
  }

  eliminarUsuario(id: number, nombreUsuario: string) {
    this.alertController
      .create({
        header: 'Confirmar',
        message: `¿Deseas eliminar al usuario "${nombreUsuario}"?`,
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
                  this.obtenerUsuarios();
                  this.showSuccessMessage(`Usuario "${nombreUsuario}" eliminado correctamente.`);
                },
                error: (err) => {
                  console.error('Error al eliminar usuario:', err);
                  this.showErrorMessage('Error al eliminar usuario.');
                },
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

  cancelarEdicion() {
    this.showEditForm = false;
    this.editForm.reset();
    this.selectedUsuario = null;
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
