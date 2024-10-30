import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Routes } from '@angular/router';
import { PerfilUsuario } from '../interfaces/usuario.interface';  // Importar la interfaz de perfil de usuario

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://smartmanager-capstone24-duoc-vm.onrender.com/api';  // Aquí el enlace de la API  https://smartmanager-capstone24-duoc-vm.onrender.com/api


  constructor(private http: HttpClient) { }
  // Método para obtener el token de localStorage cada vez que se necesite
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  // Método para hacer login 
  login(nombreUsuario: string, password: string): Observable<any> {
    const loginUrl = `${this.apiUrl}/login/`;
    const body = { nombreUsuario, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(loginUrl, body, { headers }).pipe(
      map(response => {
        if (response && response.token) {
          console.log('Token recibido:', response.token);  // Log del token recibido
          localStorage.setItem('authToken', response.token);  // Guarda el token correctamente

          // Redirigir en lugar de recargar la página
          window.location.href = '/';  // Evita un reload completo y usa redirección para cargar componentes correctamente
        }
        return response;
      })
    );
  }

  // Método para hacer registro
  register(data: any): Observable<any> {
    const registerUrl = `${this.apiUrl}/register/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.post<any>(registerUrl, data, { headers }).pipe(
      map(response => {
        console.log('Usuario registrado exitosamente:', response);
        return response;
      })
    );
  }

  // Método para hacer logout
  logout(): Observable<any> {
    const logoutUrl = `${this.apiUrl}/logout/`;
    const token = this.getToken();  // Obtener el token actualizado

    console.log('Token almacenado en localStorage:', token);  // Log del token almacenado
    
    if (token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      });

      console.log('Enviando solicitud de logout con token:', headers);

      return this.http.post<any>(logoutUrl, {}, { headers }).pipe(
        map(response => {
          console.log('Respuesta del servidor de logout:', response);
          localStorage.removeItem('authToken');  // Eliminar el token del localStorage
          return response;
        })
      );
    } else {
      console.log('No se encontró token en localStorage');
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }
  }

  // Método para obtener el perfil del usuario autenticado
  getPerfil(): Observable<PerfilUsuario> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<PerfilUsuario>(`${this.apiUrl}/perfil/`, { headers });
  }
  // Obtener la lista de usuarios (solo administradores)
  getUsuarios(): Observable<any> {
    const token = this.getToken();  // Obtener el token de localStorage
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,  // Enviar el token en los headers
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/usuarios/`, { headers });
  }


// Método para eliminar un usuario
eliminarUsuario(id: number): Observable<any> {
  // Solo utilizamos la URL y hacemos la solicitud DELETE de forma simple
  return this.http.delete<any>(`${this.apiUrl}/usuarios/${id}/`);
}


  // Actualizar usuario (usar PUT o PATCH dependiendo de tu API)
  actualizarUsuario(usuario: any): Observable<any> {
    const token = this.getToken();  // Obtener el token actualizado
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}/usuarios/${usuario.id}/`, usuario, { headers });
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = !!localStorage.getItem('authToken');
    console.log('Usuario autenticado:', token);  // Log para verificar si el usuario está autenticado
    return token;
  }
}