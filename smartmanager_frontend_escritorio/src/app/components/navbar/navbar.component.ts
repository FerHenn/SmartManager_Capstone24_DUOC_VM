import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';

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
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  visibleSidebar1: boolean = false;
  isAuthenticated: boolean = false;
  menuItems: MenuItem[] = [];
  profileItems: MenuItem[] = [];
  role: string = '';
  private routerSubscription: Subscription | null = null;  // Inicialización explícita

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    console.log('Inicializando NavbarComponent');
    this.cargarRol(); 
    // Verificar si el usuario está autenticado
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log('Estado de autenticación:', this.isAuthenticated);

    if (this.isAuthenticated) {
      // Cargar el perfil y las opciones de menú correspondientes
      this.router.navigate(['/inicio']);
      this.cargarPerfilYMenu();
    }

    // Escuchar cambios de navegación
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Cerrar el menú lateral al navegar a una nueva ruta
        this.visibleSidebar1 = false;
      }
    });
  }

  ngOnDestroy() {
    // Asegurarse de limpiar la suscripción cuando el componente se destruya
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
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
          //{ label: 'Productos', icon: 'pi pi-box', routerLink: ['/productos'] },  // Cambié pi-cog por pi-box
          { label: 'Carrito', icon: 'pi pi-shopping-cart', routerLink: ['/carrito'] }
        ];        

        // Agregar opciones de administración si el usuario es administrador
        if (perfil.role === 'Administrador') {
          this.menuItems.push(
            //{ label: 'Usuario', icon: 'pi pi-user', routerLink: ['/usuario'] },
            //{ label: 'Ventas', icon: 'pi pi-chart-line', routerLink: ['/ventas'] },  // Icono de gráfico
            { label: 'Registro', icon: 'pi pi-user-plus', routerLink: ['/registro'] }, // Icono de añadir usuario
            { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: ['/dashboard'] },  // Icono de tablero
            { label: 'Panel de gestión', icon: 'pi pi-fw pi-sliders-h', routerLink: ['/CrudDashboard'] },  // Icono de tabla
            { label: 'Reporte de ventas', icon: 'pi pi-fw pi-file', routerLink: ['/reporte-ventas'] }, // Icono de candado
            { label: 'Recuperar contraseña', icon: 'pi pi-lock', routerLink: ['/recuperar-contrasena'] } // Icono de candado
          );
        }        
        // Definir los elementos del menú de perfil
        this.profileItems = [
          { label: 'Ver perfil', icon: 'pi pi-fw pi-cog', command: () => this.verPerfil() },
          { label: 'Cerrar sesión', icon: 'pi pi-fw pi-sign-out', command: () => this.logout() }
        ];
      },
      error: err => {
        console.error('Error al obtener el perfil del usuario:', err);
      }
    });
  }

  cargarRol(): void {
    this.authService.getPerfil().subscribe({
      next: (perfil) => {
        this.role = perfil.role; // Asigna el rol desde la respuesta
      },
      error: (err) => {
        console.error('Error al cargar el perfil del usuario:', err);
        this.role = 'Desconocido'; // Valor por defecto si ocurre un error
      },
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
