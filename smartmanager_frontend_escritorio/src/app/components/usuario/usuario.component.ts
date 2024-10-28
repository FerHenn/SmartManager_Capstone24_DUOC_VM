import { Component, OnInit  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; // Importar MatInputModule
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Importar MatFormFieldModule
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Toast} from 'primeng/toast';
import {CardModule} from 'primeng/card';
interface Usuario {
  nombreUsuario: string;
  correo: string;
  nombre: string;
  apellido: string;
  estado_activo: boolean;
  usuario_administrador: boolean;
}

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule,TableModule,InputTextModule,CheckboxModule,ButtonModule,CardModule,MatInputModule,MatButtonModule,MatFormFieldModule,MatCardModule,MatIconModule
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements OnInit{
  usuarios: Usuario[] = [];
  usuarioForm!: FormGroup;
  selectedUsuario: Usuario | null = null;
  mostrarMensaje: boolean = false;
  mensaje: string = '';

  private apiUrl = 'https://smartmanager-capstone24-duoc-vm.onrender.com/api/usuarios/';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      nombreUsuario: [''],
      correo: [''],
      nombre: [''],
      apellido: [''],
      estado_activo: [false],
      usuario_administrador: [false],
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.http.get<Usuario[]>(this.apiUrl).subscribe(data => {
      this.usuarios = data;
    });
  }

  onSubmit(): void {
    if (this.selectedUsuario) {
      this.http.put<Usuario>(`${this.apiUrl}${this.selectedUsuario.nombreUsuario}/`, this.usuarioForm.value).subscribe(() => {
        this.loadUsuarios();
        this.resetForm();
        this.mostrarNotificacion('Usuario actualizado exitosamente');
      });
    } else {
      this.http.post<Usuario>(this.apiUrl, this.usuarioForm.value).subscribe(() => {
        this.loadUsuarios();
        this.resetForm();
        this.mostrarNotificacion('Usuario creado exitosamente');
      });
    }
  }

  editUsuario(usuario: Usuario): void {
    this.selectedUsuario = usuario;
    this.usuarioForm.patchValue(usuario);
  }

  deleteUsuario(nombreUsuario: string): void {
    this.http.delete(`${this.apiUrl}${nombreUsuario}/`).subscribe(() => {
      this.loadUsuarios();
      this.mostrarNotificacion('Usuario eliminado exitosamente');
    });
  }

  resetForm(): void {
    this.usuarioForm.reset();
    this.selectedUsuario = null;
  }
  mostrarNotificacion(mensaje: string): void {
    this.mensaje = mensaje;
    this.mostrarMensaje = true;
    setTimeout(() => this.mostrarMensaje = false, 3000); // Ocultar después de 3 segundos
  }
}