import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
import { AuthService } from '../services/auth.service'; // Asegúrate de importar tu servicio de autenticación

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  role: string = '';  // Variable para almacenar el rol del usuario

  constructor(private popoverController: PopoverController, private authService: AuthService) {}

  ngOnInit() {
    // Obtener el perfil del usuario para asignar el rol
    this.authService.getPerfil().subscribe({
      next: (perfil) => {
        this.role = perfil.role; // Asignamos el rol obtenido desde el perfil
      },
      error: (err) => {
        console.error('Error al cargar el perfil del usuario:', err);
      }
    });
  }

  async openMenu(event: any) {
    const popover = await this.popoverController.create({
      component: MenuPopoverComponent,
      event: event, // Asegúrate de pasar el evento si necesitas posición
      translucent: true
    });
    await popover.present();
  }
}
