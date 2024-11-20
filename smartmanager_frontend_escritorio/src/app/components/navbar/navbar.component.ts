import { Component, OnInit } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AuthService } from '../../services/auth.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    BsDropdownModule,
    RouterModule,
    MenubarModule,
    TieredMenuModule,
    MenuModule,
    ButtonModule,
    SidebarModule,
    PanelMenuModule,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  visibleSidebar1: boolean = false;
  isAuthenticated: boolean = false;
  menuItems: MenuItem[] = [];
  profileItems: MenuItem[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    console.log('Inicializando NavbarComponent');

    // Verificar si el usuario está autenticado
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log('Estado de autenticación:', this.isAuthenticated);

    if (this.isAuthenticated) {
      // Cargar el perfil y las opciones de menú correspondientes
      this.router.navigate(['/inicio']);
      this.cargarPerfilYMenu();
    }
  }

  cargarPerfilYMenu() {
    // Llamar al servicio para obtener el perfil del usuario
    this.authService.getPerfil().subscribe({
      next: perfil => {
        console.log('Perfil del usuario:', perfil);

        // Definir los elementos del menú básico
        this.menuItems = [
          { label: 'Inicio', icon: 'pi pi-home', routerLink: ['/inicio'] },
          { label: 'Productos', icon: 'pi pi-cog', routerLink: ['/productos'] },
          { label: 'Carrito', icon: 'pi pi-shopping-cart', routerLink: ['/carrito'] },
        ];

        // Agregar opciones de administración si el usuario es administrador
        if (perfil.role === 'Administrador') {
          this.menuItems.push(
            { label: 'Usuario', icon: 'pi pi-user', routerLink: ['/usuario'] },
            { label: 'Ventas', icon: 'pi pi-cog', routerLink: ['/ventas'] },
            { label: 'Registro', icon: 'pi pi-user', routerLink: ['/registro'] },
            { label: 'Dashboard', icon: 'pi pi-cog', routerLink: ['/dashboard'] },
            { label: 'Recuperar Contraseña', icon: 'pi pi-cog', routerLink: ['/recuperar-contrasena'] }
          );
        }

        // Definir los elementos del menú de perfil
        this.profileItems = [
          { label: 'Ver Perfil', icon: 'pi pi-fw pi-user', command: () => this.verPerfil() },
          { label: 'Cerrar Sesión', icon: 'pi pi-fw pi-sign-out', command: () => this.logout() }
        ];
      },
      error: err => {
        console.error('Error al obtener el perfil del usuario:', err);
      }
    });
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
