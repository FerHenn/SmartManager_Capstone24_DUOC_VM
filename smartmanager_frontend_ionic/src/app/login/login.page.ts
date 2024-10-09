import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
    this.router.navigate(['/home']);
  }
}
