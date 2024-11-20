import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
@Component({
  selector: 'app-dashboard-crud',
  templateUrl: './dashboard-crud.page.html',
  styleUrls: ['./dashboard-crud.page.scss'],
})
export class DashboardCrudPage implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }
  async openMenu() {
    const popover = await this.popoverController.create({
      component: MenuPopoverComponent,
      event: event, // Asegúrate de pasar el evento si necesitas posición
      translucent: true
    });
    await popover.present();
  }
}

