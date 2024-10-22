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
import { AuthService } from '../../services/auth.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [BsDropdownModule,RouterModule,MenubarModule,TieredMenuModule,MenuModule,ButtonModule,SidebarModule,PanelMenuModule,CommonModule,], // Importa los módulos necesarios
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  visibleSidebar1: boolean = false;
  isAuthenticated: boolean = false;  // Variable para saber si el usuario está autenticado
  menuItems: MenuItem[] = [];
  profileItems: MenuItem[] = [];

  constructor(private authService: AuthService,private router: Router) {}

   ngOnInit() {
    console.log('Inicializando NavbarComponent');

    // Verificar si el usuario está autenticado
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log('Estado de autenticación:', this.isAuthenticated);

    // Si el usuario está autenticado, redirigir a la página de inicio
    if (this.isAuthenticated) {
      console.log('Redirigiendo a la página de inicio');
      this.router.navigate(['/inicio']);  // Redirige a la página de inicio
    }
  

    // Definir los elementos del menú
    this.menuItems = [
      { label: 'Inicio', icon: 'pi pi-home', routerLink: ['/inicio'] },
      { label: 'Productos', icon: 'pi pi-cog', routerLink: ['/productos'] },
      { label: 'Usuario', icon: 'pi pi-calendar', routerLink: ['/usuario'] },
      { label: 'Ventas', icon: 'pi pi-cog', routerLink: ['/ventas'] },
      { label: 'Registro', icon: 'pi pi-cog', routerLink: ['/registro'] },
      { label: 'Dashboard', icon: 'pi pi-cog', routerLink: ['/dashboard'] }
    ];

    // Definir los elementos del menú de perfil solo si el usuario está autenticado
    if (this.isAuthenticated) {
      this.profileItems = [
        { label: 'Ver Perfil', icon: 'pi pi-fw pi-user', command: () => this.verPerfil() },
        { label: 'Cerrar Sesión', icon: 'pi pi-fw pi-sign-out', command: () => this.logout() }
      ];
    } else {
      console.log('Usuario no autenticado, no se muestra el menú de perfil');
    }
  }

  // Método para ver el perfil
  verPerfil() {
    console.log('Ver Perfil');
    this.router.navigate(['/perfil']);
  }

    // Método para hacer logout
    logout() {
      this.authService.logout().subscribe({
        next: () => {
          console.log('Logout exitoso, redirigiendo al login');
          
          // Redirigir al login y recargar la página
          this.router.navigate(['/login']).then(() => {
            window.location.reload();  // Recargar la página después de redirigir
          });
        },
        error: (err) => {
          console.error('Error durante el logout:', err);
        }
      });
    }
  }