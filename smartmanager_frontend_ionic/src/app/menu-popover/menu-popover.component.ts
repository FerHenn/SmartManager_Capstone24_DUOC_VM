import { Component } from '@angular/core';
import { NavController, PopoverController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-menu-popover',
  templateUrl: './menu-popover.component.html',
})
export class MenuPopoverComponent {
  constructor(
    private navCtrl: NavController,
    private popoverController: PopoverController,  // Agrega esto para cerrar el popover
    private loadingController: LoadingController,
    private authService: AuthService
  ) {}

  navigateToProfile() {
    this.navCtrl.navigateForward('/perfil');
    this.popoverController.dismiss(); // Cerrar el popover al navegar
  }

async logout() {
  // Mostrar el mensaje de carga
  const loading = await this.loadingController.create({
    message: 'Cerrando sesión...',
    duration: 2000, // Tiempo de duración antes de ocultarse
  });
  await loading.present();

  // Cerrar el popover (si está abierto)
  await this.popoverController.dismiss();

  // Eliminar el token y otros datos relacionados con la sesión
  localStorage.removeItem('authToken'); // Elimina el token del almacenamiento local
  sessionStorage.clear(); // Limpia cualquier dato de la sesión

  console.log('Token eliminado de localStorage');
  console.log('Datos de sesión eliminados');

  // Redirigir al login después de cerrar la sesión
  setTimeout(() => {
    loading.dismiss(); // Ocultar el mensaje de carga
    this.navCtrl.navigateRoot('/login'); // Redirigir al login, reseteando el stack de navegación
  }, 2000); // Asegura que se respete el tiempo del mensaje de carga
}
}


