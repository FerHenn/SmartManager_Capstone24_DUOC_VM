import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BotpressService } from './services/BotpressService';
import { NavbarComponent } from './components/navbar/navbar.component'; // el componente de la barra de navegación
import { filter } from 'rxjs/operators';
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
export class AppComponent implements OnInit {
  constructor(private router: Router, private botpressService: BotpressService) {}

  ngOnInit(): void {
    // Escuchar cambios en la ruta
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.manageBotpress();
      });
  }

  private manageBotpress(): void {
    // Si estamos en la página de login, eliminamos Botpress
    if (this.router.url === '/login') {
      this.botpressService.unloadScripts();
    } else {
      this.botpressService.loadScripts();
    }
  }
}