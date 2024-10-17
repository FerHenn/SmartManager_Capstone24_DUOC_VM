import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service.service'; 
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
  loginForm: FormGroup;
  isSubmitted = false;
  usuario: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  // Verifica si hay un token en el localStorage al iniciar el componente
  const token = localStorage.getItem('token'); // O sessionStorage
  if (token) {
    this.router.navigate(['/inicio']); // Redirige a la página de inicio si el usuario está autenticado
  }
  // Verifica si hay un usuario autenticado
      this.usuario = localStorage.getItem('usuario'); // o sessionStorage en caso de querer que el usuario tenga que volver a autenticarse una vez cierre la pestaña o asi
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
        localStorage.setItem('token', response.token); // Guarda el token
        localStorage.setItem('usuario', nombreUsuario); // Guarda el nombre del usuario
        this.usuario = nombreUsuario; // Asigna el usuario a la propiedad local
        console.log('Usuario',this.usuario)
        this.router.navigate(['/inicio']); // Redirige a otra página después de iniciar sesión
      },
      error: (err) => {
        console.error('Error en el login', err);
      }
    });
  }
}