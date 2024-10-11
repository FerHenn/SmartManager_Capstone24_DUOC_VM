import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  email: string = '';

  constructor(private router: Router, private alertController: AlertController) {}

  validateEmail(): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Patrón de correo electrónico
    return emailPattern.test(this.email);
  }

  async onSubmit() {
    if (!this.validateEmail()) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor ingresa un correo electrónico válido.',
        buttons: ['OK'],
      });
      await alert.present();
      return; // Salir de la función si el correo no es válido
    }

    // Simulamos el envío de un enlace de recuperación
    const alert = await this.alertController.create({
      header: 'Enlace Enviado',
      message: 'Se ha enviado un enlace de recuperación a tu correo electrónico.',
      buttons: ['OK'],
    });

    await alert.present();
    this.router.navigate(['/login']); // Redirige a la página de login después
  }
}

