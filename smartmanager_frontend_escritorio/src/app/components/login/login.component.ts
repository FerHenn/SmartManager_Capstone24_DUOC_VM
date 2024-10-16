import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service.service';  // Importamos el servicio de autenticación
import { Router } from '@angular/router';
// a
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
  loginForm: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // Inicializamos el formulario dentro del constructor
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      password: ['', Validators.required],

    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const { nombreUsuario, password } = this.loginForm.value;
    this.authService.login(nombreUsuario, password).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);
        // Redirigir al usuario o realizar otras acciones necesarias
      },
      error: (err) => {
        console.error('Error en el login', err);
      }
    });
  }
}