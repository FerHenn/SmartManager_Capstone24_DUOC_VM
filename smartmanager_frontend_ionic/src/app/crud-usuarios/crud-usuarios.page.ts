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
  usuarios: any[] = []; // Lista de usuarios
  editForm: FormGroup; // Formulario reactivo
  showEditForm = false; // Indica si el formulario de edición está visible
  selectedUsuario: any | null = null; // Usuario seleccionado para edición

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
      rol: ['', [Validators.required]], // Campo actualizado para reflejar "role"
      estado_activo: [false],
    });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    console.log('Cargando usuarios...');
    this.authService.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = data;
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: (err) => console.error('Error al cargar usuarios:', err),
    });
  }

  editarUsuario(usuario: any) {
    console.log('Editar usuario seleccionado:', usuario);
  
    this.selectedUsuario = usuario;
    this.showEditForm = true;
  

    this.editForm.patchValue({
      nombreUsuario: usuario.nombreUsuario || '',
      correo: usuario.correo || '',
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      numero_telefonico: usuario.numero_telefonico || '',
      rol: usuario.role || '',
      estado_activo: usuario.estado_activo || false,
    });
  
    // Forzar detección de cambios y luego desplazar hacia abajo
    this.cdr.detectChanges(); // Asegura que el formulario esté renderizado
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }


  guardarCambios() {
    if (!this.selectedUsuario) {
      console.error('No se ha seleccionado un usuario para editar.');
      return;
    }

    if (!this.editForm.valid) {
      console.error('Formulario inválido. Revisar los campos obligatorios.');
      console.log('Estado de los controles:', this.editForm.controls);
      console.log('Valores actuales del formulario:', this.editForm.value);
      return;
    }

    console.log('Intentando actualizar usuario...');
    const usuarioActualizado = { ...this.editForm.getRawValue() };
    usuarioActualizado.id = this.selectedUsuario.id; // Incluir el ID para la actualización

    // Reutilizar la contraseña actual del usuario
    usuarioActualizado.password = this.selectedUsuario.password;

    // Transformar "rol" del formulario a "role" para el backend
    usuarioActualizado.role = usuarioActualizado.rol; // Mapeo explícito
    delete usuarioActualizado.rol; // Eliminar el campo "rol" después del mapeo

    console.log('Datos a enviar para la actualización:', usuarioActualizado);

    this.authService.actualizarUsuario(usuarioActualizado).subscribe({
      next: () => {
        console.log('Usuario actualizado exitosamente:', usuarioActualizado);
        this.showSuccessMessage('Usuario actualizado correctamente.');
        this.showEditForm = false;
        this.selectedUsuario = null;
        this.cargarUsuarios(); // Recargar la lista de usuarios
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
      },
    });
  }


  // Método para mostrar mensaje de éxito
  async showSuccessMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  cancelarEdicion() {
    console.log('Cancelando edición de usuario...');
    this.showEditForm = false;
    this.selectedUsuario = null;
    this.editForm.reset();
    console.log('Formulario reseteado y ocultado.');
  }

  eliminarUsuario(id: number) {
    console.log('Intentando eliminar usuario con ID:', id);
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
                  console.log('Usuario eliminado exitosamente:', id);
                  this.showSuccessMessage2('Usuario eliminado correctamente.');
                  this.cargarUsuarios(); // Recargar la lista de usuarios
                },
                error: (err) => console.error('Error al eliminar usuario:', err),
              });
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
  crearUsuario() {
    console.log('Redirigiendo a la página de registro...');
    this.router.navigate(['/registro']); // Redirige a la página de registro
  }

  // Método para mostrar mensaje de éxito
  async showSuccessMessage2(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  openMenu() {
    console.log('Abrir menú');
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(500); // Aumenta el tiempo a 500ms para un desplazamiento más lento
    }, 100);
  }
}
