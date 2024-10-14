import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private alertController: AlertController, private loadingController: LoadingController) {}

  async onSubmit() {
    if (!this.validateEmail(this.email)) {
      await this.showAlert('Error', 'Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (!this.validatePassword(this.password)) {
      await this.showAlert('Error', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    // Mostrar el loading
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      duration: 3000, // Muestra el loading durante 3 segundos
    });
    await loading.present();

    // Simula un retraso en la autenticación
    setTimeout(async () => {
      // Aquí iría la lógica real de inicio de sesión
      console.log('Correo:', this.email);
      console.log('Contraseña:', this.password);
      
      // Navegar a la página de inicio
      this.router.navigate(['/home']);
      
      // Cerrar el loading
      await loading.dismiss();
    }, 3000);
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  validatePassword(password: string): boolean {
    return password.length >= 8; // Asegúrate de que tenga al menos 8 caracteres
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
