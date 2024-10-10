import { Component } from '@angular/core';

interface Usuario {
  nombre: string;
  email: string;
}

@Component({
  selector: 'app-usuario',
  templateUrl: 'usuario.page.html',
  styleUrls: ['usuario.page.scss'],
})
export class UsuarioPage {
  usuarios: Usuario[] = [
    { nombre: 'Juan Pérez', email: 'juan@example.com' },
    { nombre: 'Ana Gómez', email: 'ana@example.com' },
  ];
  alertaVisible = false;

  constructor() {}

  agregarUsuario() {
    // Implementa la lógica para agregar un nuevo usuario
    console.log('Agregar Usuario');
  }

  editarUsuario(usuario: Usuario) { // Especifica el tipo de usuario
    // Implementa la lógica para editar el usuario seleccionado
    console.log('Editar Usuario', usuario);
  }

  eliminarUsuario(usuario: Usuario) { // Especifica el tipo de usuario
    const index = this.usuarios.indexOf(usuario);
    if (index > -1) {
      this.usuarios.splice(index, 1);
      this.alertaVisible = true;
      setTimeout(() => this.alertaVisible = false, 2000); // Mostrar alerta temporalmente
    }
  }
}
