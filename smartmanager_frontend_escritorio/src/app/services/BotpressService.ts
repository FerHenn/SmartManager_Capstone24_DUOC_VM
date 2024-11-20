import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BotpressService {
    loadScripts() {
      // Cargar los scripts de Botpress
      if (!document.getElementById('botpress-inject')) {
        const botpressScript1 = document.createElement('script');
        botpressScript1.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
        botpressScript1.async = true;
        botpressScript1.id = 'botpress-inject'; // Agrega un ID único
        document.body.appendChild(botpressScript1);
      }
  
      if (!document.getElementById('botpress-widget')) {
        const botpressScript2 = document.createElement('script');
        botpressScript2.src = 'https://files.bpcontent.cloud/2024/11/18/01/20241118013836-6PA2W5YQ.js';
        botpressScript2.async = true;
        botpressScript2.id = 'botpress-widget'; // Agrega un ID único
        document.body.appendChild(botpressScript2);
      }
    }
  
    unloadScripts() {
      // Eliminar los scripts de Botpress si existen
      const botpressScript1 = document.getElementById('botpress-inject');
      const botpressScript2 = document.getElementById('botpress-widget');
      if (botpressScript1) {
        botpressScript1.remove();
      }
      if (botpressScript2) {
        botpressScript2.remove();
      }
  
      // Destruir el widget de Botpress
      const botpressContainer = document.getElementById('botpress-webchat');
      if (botpressContainer) {
        botpressContainer.remove();
      }
  
      // Notificar a Botpress que el widget debe ser destruido
      if ((window as any).BotpressWebChat) {
        (window as any).BotpressWebChat.close(); // Cierra el widget si está abierto
        delete (window as any).BotpressWebChat; // Elimina la configuración del widget
      }
    }
  }