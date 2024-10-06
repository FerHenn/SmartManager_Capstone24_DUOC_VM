import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component'; // Importa el componente de la barra de navegación

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet> <!-- Aquí se cargarán las demás páginas -->
  `,
  imports: [RouterOutlet, NavbarComponent],
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'smartmanager_frontend_escritorio';
}
