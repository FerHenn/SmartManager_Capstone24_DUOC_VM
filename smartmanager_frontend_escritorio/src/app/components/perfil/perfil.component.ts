import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';

import { AuthService } from '../../services/auth.service';  // Importar el servicio
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // Necesario para usar *ngIf y *ngFor
import { MatFormFieldModule } from '@angular/material/form-field';  // Form field de Angular Material
import { MatInputModule } from '@angular/material/input';  // Input de Angular Material
import { MatCardModule } from '@angular/material/card';  // Card de Angular Material
// Importar componentes de PrimeNG
import { CardModule } from 'primeng/card';       // PrimeNG Card
import { InputTextModule } from 'primeng/inputtext';  // PrimeNG InputText
import { ButtonModule } from 'primeng/button';   // PrimeNG Button

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ToolbarModule,CardModule,CommonModule,MatFormFieldModule,MatInputModule,MatCardModule,InputTextModule,ButtonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  perfil: any = {};  // Almacena los datos del perfil
  errorMessage: string = '';  // Almacena el mensaje de error

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.cargarPerfil();
  }

  // Método para cargar el perfil del usuario
  cargarPerfil() {
    this.authService.getPerfil().subscribe({
      next: (data) => {
        this.perfil = data;  // Asigna los datos del perfil a la variable perfil
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        this.errorMessage = 'Error al cargar el perfil. Por favor, inténtelo más tarde.';
      }
    });
  }
}