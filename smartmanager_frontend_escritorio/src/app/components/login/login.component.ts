import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { MessagesModule } from 'primeng/messages';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule ,FormsModule,InputTextModule, PasswordModule, ButtonModule, CardModule,MessageModule,MessagesModule,CheckboxModule,],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  nombreUsuario: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Método para manejar el envío del formulario de login
  onSubmit() {
    this.authService.login(this.nombreUsuario, this.password).subscribe({
      next: (response) => {
        // Si el login es exitoso, redirigir al usuario
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        // Mostrar error en el caso de que falle el login
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }
}