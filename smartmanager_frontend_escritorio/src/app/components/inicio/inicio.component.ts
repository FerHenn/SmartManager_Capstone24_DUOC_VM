import { Component } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { MenuItem } from 'primeng/api';
import { TieredMenuModule } from 'primeng/tieredmenu';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MatToolbarModule,MatIconModule,MatCardModule,MatGridListModule,RouterModule,CommonModule,SidebarModule,TieredMenuModule,], // BrowserAnimationsModule,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
  constructor(private router: Router) {}
  
 
}
