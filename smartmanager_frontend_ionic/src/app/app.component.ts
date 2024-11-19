import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadBotpress();
  }

  shouldShowBot(): boolean {
    // Excluye el bot de la página de login
    return this.router.url !== '/login';
  }

  private loadBotpress(): void {
    // Asegura que Botpress se inyecte solo si no estamos en login
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

      // Asegúrate de que se cargue al final del body
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
