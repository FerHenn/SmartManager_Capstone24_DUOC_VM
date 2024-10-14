import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  usuario = {
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    telefono: '123-456-7890',
    direccion: 'Calle Falsa 123, Ciudad, País'
  };

  constructor() {}
}
