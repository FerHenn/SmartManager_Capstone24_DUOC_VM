import { Component, OnInit } from '@angular/core';
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

  async onSubmit() {
    if (this.email) {
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
}
