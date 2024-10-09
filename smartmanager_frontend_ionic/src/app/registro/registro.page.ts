import { Component } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nombre: string ="";
  email: string ="";
  password: string ="";

  constructor() {}

  onRegister() {
    if (this.nombre && this.email && this.password) {
      // Lógica de registro: Podrías llamar a un servicio de autenticación aquí
      console.log('Registrando usuario con:', this.nombre, this.email, this.password);
    } else {
      console.log('Formulario incompleto');
    }
  }
}
