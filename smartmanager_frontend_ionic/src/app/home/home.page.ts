import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  constructor(private popoverController: PopoverController) {}

  async openMenu() {
    const popover = await this.popoverController.create({
      component: MenuPopoverComponent,
      event: event, // Asegúrate de pasar el evento si necesitas posición
      translucent: true
    });
    await popover.present();
  }
}

