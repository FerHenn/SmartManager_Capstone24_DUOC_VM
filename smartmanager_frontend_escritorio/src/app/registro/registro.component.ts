import { Component } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ BrowserModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  nombre: string = '';
  correo: string = '';
  telefono: string = ''; // Nueva variable para el teléfono
  contrasena: string = '';

  registrar() {
    if (this.nombre && this.correo && this.telefono && this.contrasena) {
      // Aquí puedes manejar el registro (enviar a un servidor, etc.)
      console.log('Registro exitoso', {
        nombre: this.nombre,
        correo: this.correo,
        telefono: this.telefono, // Agregar teléfono
        contrasena: this.contrasena
      });

      // Limpiar el formulario
      this.nombre = '';
      this.correo = '';
      this.telefono = ''; // Limpiar el teléfono
      this.contrasena = '';
    }
  }
}
