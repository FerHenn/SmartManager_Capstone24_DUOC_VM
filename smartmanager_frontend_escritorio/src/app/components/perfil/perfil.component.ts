import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ToolbarModule,CardModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {


    usuario = {
      nombre: 'Juan Pérez',
      email: 'juan.perez@example.com',
      telefono: '123-456-7890',
      direccion: 'Calle Falsa 123, Ciudad, País',
    };
  
    constructor() {}
  }
  
