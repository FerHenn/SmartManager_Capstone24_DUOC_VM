import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {} 

  onLogin() {
    // Aquí puedes manejar el login, como validar las credenciales
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);
  }

  onForgotPassword() {
    // Navegar a una página de recuperación de contraseña
    this.router.navigate(['/olvidelacontraseña']);  //crear la pagina de la contraseña.
  }
}