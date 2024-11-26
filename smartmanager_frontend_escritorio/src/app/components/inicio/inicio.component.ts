import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Servicio de autenticación
import { MenuItem } from 'primeng/api'; // Para representar las rutas disponibles
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule, MatCardModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
})
export class InicioComponent implements OnInit {
  menuItems: MenuItem[] = []; // Rutas dinámicas basadas en el rol del usuario
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated(); // Verifica autenticación
    if (this.isAuthenticated) {
      this.cargarRutas(); // Cargar rutas dinámicamente
    } else {
      this.router.navigate(['/login']); // Redirige al login si no está autenticado
    }
  }

  cargarRutas(): void {
    this.authService.getPerfil().subscribe({
      next: (perfil) => {
        // Rutas comunes para todos los usuarios
        this.menuItems = [
          //{ label: 'Gestión de productos', routerLink: '/productos', description: 'Control de productos' },
          { label: 'Carrito', routerLink: '/carrito', description: 'Realiza compras' },
        ];

        // Rutas adicionales para administradores
        if (perfil.role === 'Administrador') {
          this.menuItems.push(
            //{ label: 'Gestión de usuarios', routerLink: '/usuario', description: 'Administra los usuarios registrados' },
           // { label: 'Gestión de ventas', routerLink: '/ventas', description: 'Revisa y gestiona las ventas realizadas' },
            { label: 'Dashboard', routerLink: '/dashboard', description: 'Consulta estadísticas y métricas' },
            { label: 'Registro', routerLink: '/registro', description: 'Registra nuevos usuarios' },
            { label: 'Recuperar contraseña', routerLink: '/recuperar-contrasena', description: 'Recupera tu contraseña' },
            { label: 'Crud completo', routerLink: '/CrudDashboard', description: 'Se puede revisar, agregar y eliminar diferentes componentes' },
          );
        }
      },
      error: (err) => {
        console.error('Error al cargar el perfil del usuario:', err);
      },
    });
  }
}
