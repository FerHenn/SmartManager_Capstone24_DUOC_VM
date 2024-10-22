import { Component, OnInit  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { ToastModule} from 'primeng/toast';
import {CardModule} from 'primeng/card';
import { Usuario } from '../../interfaces/usuario.interface';  // Importar la interfaz de perfil
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';  // Servicio AuthService
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';  // Servicios para confirmación y mensajes

import { DialogModule } from 'primeng/dialog';  // Diálogo PrimeNG

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule,ToastModule,FormsModule,DialogModule ,ReactiveFormsModule,HttpClientModule,TableModule,InputTextModule,CheckboxModule,ButtonModule,CardModule,MatInputModule,MatButtonModule,MatFormFieldModule,MatCardModule,MatIconModule
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss',
  providers: [ConfirmationService, MessageService],  // Proveedores para diálogos de confirmación
})
export class UsuarioComponent implements OnInit{
  usuarios: any[] = [];  // Almacena la lista de usuarios
  displayDialog: boolean = false;  // Controla la visibilidad del diálogo de edición
  usuarioSeleccionado: any = {};  // Almacena el usuario seleccionado para editar
  errorMessage: string = '';  // Para manejar errores

  isAdmin: boolean = false;  // Para verificar si el usuario es administrador
  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}
  ngOnInit() {
    this.cargarUsuarios();  // Cargar usuarios al iniciar el componente


        // Obtener el perfil del usuario y verificar el rol
    this.authService.getPerfil().subscribe((perfil: Usuario) => {
      if (perfil.role === 'Administrador') {
        this.isAdmin = true;  // El usuario es administrador
      } else {
        this.isAdmin = false;  // El usuario no es administrador
      }
    });
  }
  

  
  // Método para cargar los usuarios
  cargarUsuarios(): void {
    this.authService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;  // Asignar los usuarios obtenidos
      },
      error: (err) => {
        if (err.status === 403) {
          this.errorMessage = 'No tienes permisos para ver esta lista.';  // Manejar error 403 Forbidden
        } else {
          this.errorMessage = 'Error al cargar usuarios.';
        }
        console.error('Error al obtener usuarios:', err);
      }
    });
  }


  // Mostrar el diálogo de edición para el usuario seleccionado
  editarUsuario(usuario: any) {
    this.usuarioSeleccionado = { ...usuario };  // Clonar el usuario seleccionado para edición
    this.displayDialog = true;
  }

  // Guardar los cambios del usuario (actualización)
  guardarUsuario() {
    if (this.usuarioSeleccionado && this.usuarioSeleccionado.id) {
      this.authService.actualizarUsuario(this.usuarioSeleccionado).subscribe({
        next: (response) => {
          this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente'});
          this.cargarUsuarios();  // Recargar la lista de usuarios
          this.displayDialog = false;  // Cerrar el diálogo
        },
        error: (err) => {
          console.error('Error al actualizar el usuario:', err);
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el usuario'});
        }
      });
    }
  }


// Método para eliminar un usuario
eliminarUsuario(usuario: any) {
  console.log('Intentando eliminar al usuario con ID:', usuario.id);  // Log para verificar que el ID es correcto

  this.confirmationService.confirm({
    message: `¿Está seguro de que desea eliminar al usuario ${usuario.nombreUsuario}?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      console.log(`Confirmación aceptada para eliminar al usuario: ${usuario.nombreUsuario}`);
      
      // Llamar al método del servicio para eliminar el usuario
      this.authService.eliminarUsuario(usuario.id).subscribe({
        next: () => {
          console.log(`Usuario ${usuario.nombreUsuario} eliminado correctamente`);
          this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);  // Actualizar la lista local de usuarios
          this.messageService.add({severity: 'success', summary: 'Éxito', detail: `Usuario ${usuario.nombreUsuario} eliminado correctamente`});
        },
        error: (err) => {
          console.error(`Error al eliminar usuario ${usuario.nombreUsuario}:`, err);  // Log de error en la consola
          this.messageService.add({severity: 'error', summary: 'Error', detail: `No se pudo eliminar al usuario ${usuario.nombreUsuario}`});
        }
      });
    },
    reject: () => {
      console.log(`Eliminación del usuario ${usuario.nombreUsuario} cancelada`);
    }
  });
}


  // Cerrar el diálogo de edición
  cerrarDialogo() {
    this.displayDialog = false;
  }
}