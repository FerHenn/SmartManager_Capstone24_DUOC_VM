import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  nombreUsuario: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {}

  async onSubmit() {
    console.log('Iniciando proceso de login...');
    console.log('Usuario:', this.nombreUsuario);
    console.log('Contraseña:', this.password);

    if (!this.nombreUsuario) {
      await this.showAlert('Error', 'Por favor, ingresa un usuario válido.');
      console.log('Validación fallida: Usuario no es válido');
      return;
    }

    if (!this.validatePassword(this.password)) {
      await this.showAlert('Error', 'La contraseña debe tener al menos 8 caracteres.');
      console.log('Validación fallida: Contraseña es demasiado corta');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    console.log('Enviando solicitud de login al backend...');

    this.authService.login(this.nombreUsuario, this.password).subscribe({
      next: async (response) => {
        console.log('Respuesta del backend recibida:', response);
        localStorage.setItem('token', response.token);
        await loading.dismiss();
        this.router.navigate(['/home']);
      },
      error: async (error) => {
        console.error('Error de autenticación:', error);
        await loading.dismiss();
        this.showAlert('Error', 'Usuario o contraseña incorrectos');
      }
    });
  }

  validatePassword(password: string): boolean {
    return password.length >= 3; // configurado como 3 en desarrollo 
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
