import { Component } from '@angular/core';
import { NavController, PopoverController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-menu-popover',
  templateUrl: './menu-popover.component.html',
})
export class MenuPopoverComponent {
  constructor(
    private navCtrl: NavController,
    private popoverController: PopoverController,  // Agrega esto para cerrar el popover
    private loadingController: LoadingController
  ) {}

  navigateToProfile() {
    this.navCtrl.navigateForward('/perfil');
    this.popoverController.dismiss(); // Cerrar el popover al navegar
  }

  async logout() {
    // Mostrar el mensaje de carga
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
      duration: 2000 // Tiempo de duración antes de ocultarse
    });
    await loading.present();

    // Cerrar el popover antes de navegar al login
    await this.popoverController.dismiss();

    // Navegar al login después de que el loading se haya mostrado
    setTimeout(() => {
      loading.dismiss(); // Ocultar el mensaje de carga
      this.navCtrl.navigateRoot('/login'); // Redirigir al login, reseteando el stack de navegación
    }, 2000); // Asegurar que se respete el tiempo del mensaje de carga
  }
}


