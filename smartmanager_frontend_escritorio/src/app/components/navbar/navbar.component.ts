import { Component,OnInit } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Router,RouterModule,NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AuthService } from '../../services/auth.service.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [BsDropdownModule,RouterModule,MenubarModule,TieredMenuModule,MenuModule,ButtonModule,SidebarModule,PanelMenuModule,CommonModule,], // Importa los módulos necesarios
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  visibleSidebar1: boolean = false;
  isAuthenticated: boolean = false; // Variable para saber si el usuario está autenticado
  menuItems: MenuItem[] = [];
  profileItems: MenuItem[] = [];
  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit() {
    // Suscribirse a los eventos del router
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAuthenticated = this.authService.isAuthenticated(); // Verifica si el usuario está autenticado
      }
    });
    this.menuItems = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: ['/inicio'] // O la ruta que definas
      },
      {
        label: 'productos',
        icon: 'pi pi-cog',
        routerLink: ['/productos']
      },
      // {
      //   label: 'Usuario',
      //   icon: 'pi pi-calendar',
      //   routerLink: ['/usuario']
      // },
      {
        label: 'Login',
        icon: 'pi pi-cog',
        routerLink: ['/login']
      },
      // {
      //   label: 'ventas',
      //   icon: 'pi pi-cog',
      //   routerLink: ['/ventas']
      // },
      {
        label: 'registro',
        icon: 'pi pi-cog',
        routerLink: ['/registro']
      }
    ];

    this.profileItems = [
      { label: 'Ver Perfil', icon: 'pi pi-fw pi-user', command: () => this.verPerfil() },
      { label: 'Cerrar Sesión', icon: 'pi pi-fw pi-sign-out', command: () => this.cerrarSesion() }
    ];
  }

  verPerfil() {
    console.log('Ver Perfil');
    this.router.navigate(['/perfil']);
  }

  cerrarSesion() {
    console.log('Cerrar Sesión');
    this.authService.logout(); // Llama al método de logout
    this.router.navigate(['/login']); // Redirige al login después de cerrar sesión
  }
}
