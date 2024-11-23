import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular'; 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private menu: MenuController) {}

  ngOnInit(): void {
    this.loadBotpress();
    this.router.events.subscribe(() => {
      // Cierra el menú cada vez que navegas a una nueva página
      this.menu.close();
    });
  }

  /**
   * Función para cerrar sesión y redirigir al login.
   */
  cerrarSesion(): void {
    // Aquí puedes limpiar datos de sesión si es necesario
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']); // Redirige al login
  }

  /**
   * Determina si el bot debe mostrarse o no.
   */
  shouldShowBot(): boolean {
    // Excluye el bot de la página de login
    return this.router.url !== '/login';
  }

  /**
   * Carga el script de Botpress si no estás en la página de login.
   */
  private loadBotpress(): void {
    if (this.shouldShowBot()) {
      // Configura Botpress
      (window as any).botpressWebChat = {
        selector: '#botpress-container',
      };

      // Crea el script dinámicamente si no existe
      const botScript = document.createElement('script');
      botScript.src = 'https://files.bpcontent.cloud/2024/11/18/01/20241118013836-6PA2W5YQ.js';
      botScript.async = true;
      botScript.defer = true;

      botScript.onload = () => {
        console.log('Botpress loaded successfully.');
      };
      botScript.onerror = () => {
        console.error('Error loading Botpress script.');
      };

      document.body.appendChild(botScript);
    }
  }
}
