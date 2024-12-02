import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  recuperarForm: FormGroup;

  // Estado para diálogos y errores
  displaySuccessDialog: boolean = false;
  displayErrorDialog: boolean = false;
  errorMessage: string = '';

  // Contraseña de administrador simulada (idealmente se valida en el backend)
  contrasenaAdminValida = '123';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    // Configuración inicial del formulario con validaciones
    this.recuperarForm = this.fb.group(
      {
        nombreUsuario: ['', [Validators.required]],
        nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
        confirmarContrasena: ['', [Validators.required, Validators.minLength(6)]],
        contrasenaAdmin: ['', Validators.required],
      },
      { validator: this.confirmarContrasenaIguales }
    );
  }

  // Validación personalizada: las contraseñas deben coincidir
  confirmarContrasenaIguales(group: FormGroup) {
    const nuevaContrasena = group.get('nuevaContrasena')?.value;
    const confirmarContrasena = group.get('confirmarContrasena')?.value;
    return nuevaContrasena === confirmarContrasena ? null : { contrasenaNoCoincide: true };
  }

  // Acción al enviar el formulario
  async onSubmit() {
    if (this.recuperarForm.valid) {
      const formValues = this.recuperarForm.value;

      // Validación de contraseña de administrador
      if (formValues.contrasenaAdmin !== this.contrasenaAdminValida) {
        await this.mostrarMensaje('Error', 'Contraseña de administrador inválida.');
        return;
      }

      // Llamada al servicio de recuperación
      this.authService.recuperarContrasena(formValues).subscribe(
        async (response) => {
          console.log('Respuesta recibida:', response);
          this.displaySuccessDialog = true; // Mostrar mensaje de éxito
          this.recuperarForm.reset(); // Limpiar formulario
        },
        async (error) => {
          console.error('Error al recuperar la contraseña:', error);
          this.displayErrorDialog = true; // Mostrar mensaje de error
          this.errorMessage = 'Hubo un error al recuperar la contraseña. Por favor, inténtalo nuevamente.';
        }
      );
    } else {
      // Validar formulario incompleto
      await this.mostrarMensaje('Formulario Incompleto', 'Por favor, completa todos los campos correctamente.');
    }
  }

  // Función para mostrar mensajes genéricos (éxito o error)
  async mostrarMensaje(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Cerrar diálogos
  closeSuccessDialog() {
    this.displaySuccessDialog = false;
  }

  closeErrorDialog() {
    this.displayErrorDialog = false;
  }
}

