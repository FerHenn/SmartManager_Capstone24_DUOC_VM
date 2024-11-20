import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PerfilUsuario } from '../interfaces/usuario.interface';  // Importar la interfaz de perfil de usuario
import { environment } from '../../environments/environment'; // Importa environment

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;  // Aquí el enlace de la API  https://smartmanager-capstone24-duoc-vm.onrender.com/api


  constructor(private http: HttpClient, private router: Router) {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private autoLogout() {
    localStorage.removeItem('authToken'); // Elimina el token de localStorage
    this.router.navigate(['login/']); // Redirige al usuario a la página de inicio de sesión
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      console.warn('Token inválido o expirado, cerrando sesión automáticamente.');
      this.autoLogout(); // Cierra sesión si se recibe un error 401
    }
    return throwError(error);
  }

  register(data: any): Observable<any> {
    const registerUrl = `${this.apiUrl}register/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.post<any>(registerUrl, data, { headers }).pipe(
      map(response => {
        console.log('Usuario registrado exitosamente:', response);
        return response;
      }),
      catchError(this.handleError.bind(this)) // Manejo de errores
    );
  }

  login(nombreUsuario: string, password: string): Observable<any> {
    const loginUrl = `${this.apiUrl}login/`;
    const body = { nombreUsuario, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(loginUrl, body, { headers }).pipe(
      map(response => {
        if (response && response.token) {
          console.log('Token recibido:', response.token);
          localStorage.setItem('authToken', response.token);
          window.location.href = '/';
        }
        return response;
      }),
      catchError(this.handleError.bind(this)) // Manejo de errores
    );
  }

  logout(): Observable<any> {
    const logoutUrl = `${this.apiUrl}logout/`;
    const token = this.getToken();

    if (token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      });

      return this.http.post<any>(logoutUrl, {}, { headers }).pipe(
        map(response => {
          console.log('Respuesta del servidor de logout:', response);
          localStorage.removeItem('authToken');
          return response;
        }),
        catchError(this.handleError.bind(this)) // Manejo de errores
      );
    } else {
      console.log('No se encontró token en localStorage');
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }
  }

  getPerfil(): Observable<PerfilUsuario> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<PerfilUsuario>(`${this.apiUrl}perfil/`, { headers }).pipe(
      catchError(this.handleError.bind(this)) // Manejo de errores
    );
  }

  getUsuarios(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}usuarios/`, { headers }).pipe(
      catchError(this.handleError.bind(this)) // Manejo de errores
    );
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}usuarios/${id}/`).pipe(
      catchError(this.handleError.bind(this)) // Manejo de errores
    );
  }

  actualizarUsuario(usuario: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}usuarios/${usuario.id}/`, usuario, { headers }).pipe(
      catchError(this.handleError.bind(this)) // Manejo de errores
    );
  }

  isAuthenticated(): boolean {
    const token = !!localStorage.getItem('authToken');
    console.log('Usuario autenticado:', token);
    return token;
  }

  recuperarContrasena(data: any): Observable<any> {
    const url = `${this.apiUrl}recuperar-contrasena/`;
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, data, { headers }).pipe(
      catchError(this.handleError.bind(this)) // Manejo de errores
    );
  }
}

