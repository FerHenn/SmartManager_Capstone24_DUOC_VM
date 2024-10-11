import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu-popover',
  templateUrl: './menu-popover.component.html',
})
export class MenuPopoverComponent {
  constructor(private navCtrl: NavController) {}

  navigateToProfile() {
    this.navCtrl.navigateForward('/perfil');
  }

  logout() {
    this.navCtrl.navigateRoot('/login');
  }
}

