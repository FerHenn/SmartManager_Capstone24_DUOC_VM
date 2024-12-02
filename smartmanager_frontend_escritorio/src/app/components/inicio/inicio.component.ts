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
    this.isAuthenticated = this.authService.isAuthenticated(); 
    if (this.isAuthenticated) {
      this.cargarRutas(); 
    } else {
      this.router.navigate(['/login'])
    }
  }

  cargarRutas(): void {
    this.authService.getPerfil().subscribe({
      next: (perfil) => {
        // Rutas comunes para todos los usuarios
        this.menuItems = [
          { label: 'Carrito', routerLink: '/carrito', description: 'Realiza compras' },
        ];

        // Rutas adicionales para administradores
        if (perfil.role === 'Administrador') {
          this.menuItems.push(
            { label: 'Dashboard', routerLink: '/dashboard', description: 'Consulta estadísticas y métricas' },
            { label: 'Recuperar contraseña', routerLink: '/recuperar-contrasena', description: 'Recupera tu contraseña' },
            { label: 'Panel de gestión', routerLink: '/CrudDashboard', description: 'Se puede revisar, agregar y eliminar diferentes componentes' },
            { label: 'Reporte de ventas', icon: 'pi pi-table', routerLink: ['/reporte-ventas'], description: 'Consulta estadísticas diarias y mensuales' }, // Icono de candado
          );
        }
      },
      error: (err) => {
        console.error('Error al cargar el perfil del usuario:', err);
      },
    });
  }
}
