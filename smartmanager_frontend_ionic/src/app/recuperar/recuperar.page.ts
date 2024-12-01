import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Asegúrate de tener el servicio de autenticación

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  recuperarForm: FormGroup;

  // Definir las propiedades para mostrar u ocultar los modales
  displaySuccessDialog: boolean = false;
  displayErrorDialog: boolean = false;
  errorMessage: string = '';  // Mensaje de error detallado

  // Simulación de usuarios registrados y contraseña de admin
  usuariosValidos = ['usuario1', 'usuario2', 'usuario3']; // Lista de usuarios válidos
  contrasenaAdminValida = 'admin123'; // Contraseña del administrador

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private alertController: AlertController
  ) {
    // Definimos el formulario con los campos necesarios y validaciones
    this.recuperarForm = this.fb.group({
      nombreUsuario: ['', [Validators.required, this.usuarioValido.bind(this)]],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required, Validators.minLength(6)]],
      contrasenaAdmin: ['', Validators.required]
    }, { validator: this.confirmarContrasenaIguales });
  }

  // Función para comprobar que las contraseñas coinciden
  confirmarContrasenaIguales(group: FormGroup) {
    const nuevaContrasena = group.get('nuevaContrasena')?.value;
    const confirmarContrasena = group.get('confirmarContrasena')?.value;
    return nuevaContrasena === confirmarContrasena ? null : { contrasenaNoCoincide: true };
  }

  // Función de validación personalizada para verificar que el usuario es válido
  usuarioValido(control: any) {
    if (control.value && !this.usuariosValidos.includes(control.value)) {
      return { usuarioNoValido: true };
    }
    return null;
  }

  // Función que se ejecuta al enviar el formulario
  async onSubmit() {
    if (this.recuperarForm.valid) {
      console.log('Formulario válido');
      const formValues = this.recuperarForm.value;

      // Verificar si la contraseña del administrador es correcta
      if (formValues.contrasenaAdmin !== this.contrasenaAdminValida) {
        this.mostrarError('Contraseña de administrador inválida');
        return;
      }

      // Llamamos al servicio para recuperar la contraseña
      this.authService.recuperarContrasena(formValues).subscribe(
        async (response) => {
          console.log('Respuesta recibida:', response); // Verifica la respuesta del servicio
          this.displaySuccessDialog = true; // Mostrar modal de éxito
        },
        async (error) => {
          console.error('Error al recuperar la contraseña:', error);
          this.displayErrorDialog = true; // Mostrar modal de error
          this.errorMessage = 'Ha ocurrido un error al intentar recuperar la contraseña. Intenta nuevamente.';
        }
      );
    } else {
      console.log('Formulario no válido');
      // Si el formulario no es válido, mostramos un mensaje de error
      const alert = await this.alertController.create({
        header: 'Formulario Incompleto',
        message: 'Por favor, asegúrate de que todos los campos estén completos correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  // Función para mostrar mensaje de error
  async mostrarError(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Funciones para cerrar los modales
  closeSuccessDialog() {
    this.displaySuccessDialog = false;
  }

  closeErrorDialog() {
    this.displayErrorDialog = false;
  }
}
