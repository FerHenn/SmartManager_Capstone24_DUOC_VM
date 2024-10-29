import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor

import { ReactiveFormsModule } from '@angular/forms'; // Importar el módulo de formularios reactivos
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { FormsModule } from '@angular/forms';

// Importar PrimeNG y Angular Material
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,  // Asegurarse de importar MatFormFieldModule
    MatInputModule,      // Asegurarse de importar MatInputModule
    MatButtonModule,     // Para el botón de submit
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    CardModule,
    FormsModule,
    DialogModule,
    InputTextModule,   // PrimeNG Input
    ButtonModule,      // PrimeNG Button
    DropdownModule,    // PrimeNG Dropdown
    CardModule,        // PrimeNG Card
    MatFormFieldModule, // Angular Material Form Field
    MatInputModule,     // Angular Material Input
    MatSelectModule     // Angular Material Select

  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
  providers: [FormBuilder]
})
export class RegistroComponent {
  nombreUsuario: string = '';
  correo: string = '';
  password: string = '';
  nombre: string = '';
  apellido: string = '';
  numeroTelefonico: string = '';
  role: string = 'Cajero';  // Valor por defecto
  errorMessage: string = '';

   // Definir las opciones de roles
   roles = [
    { label: 'Cajero', value: 'Cajero' },
    { label: 'Administrador', value: 'Administrador' }
  ];

    // Variables para controlar el diálogo de éxito y error
    displaySuccessDialog: boolean = false;
    displayErrorDialog: boolean = false;
  


  constructor(private authService: AuthService, private router: Router) {}
  onSubmit() {
    const userData = {
      nombreUsuario: this.nombreUsuario,
      correo: this.correo,
      password: this.password,
      nombre: this.nombre,
      apellido: this.apellido,
      numero_telefonico: this.numeroTelefonico,
      role: this.role
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        // Mostrar diálogo de éxito
        this.displaySuccessDialog = true;
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        // Mostrar diálogo de error
        this.displayErrorDialog = true;
      }
    });
  }

  // Método para redirigir al usuario después del registro
  irAPaginaUsuarios() {
    this.displaySuccessDialog = false;  // Cerrar el diálogo
    this.router.navigate(['/usuario']);  // Redirigir a la página de usuarios
  }
}