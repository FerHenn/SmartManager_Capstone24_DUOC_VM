import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private navCtrl: NavController) {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Método para iniciar sesión
  login(nombreUsuario: string, password: string): Observable<any> {
    const loginUrl = `${this.apiUrl}login/`;
    const body = { nombreUsuario, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(loginUrl, body, { headers }).pipe(
      tap(response => {
        if (response && response.token) {
          console.log('Token recibido:', response.token);
          localStorage.setItem('authToken', response.token);
          console.log('Token guardado en localStorage');
        } else {
          console.error('No se recibió un token en la respuesta.');
        }
      })
    );
  }

  // Método para hacer registro
  register(data: any): Observable<any> {
    const registerUrl = `${this.apiUrl}register/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(registerUrl, data, { headers }).pipe(
      map(response => {
        console.log('Usuario registrado exitosamente:', response);
        return response;
      })
    );
  }

  // Método para crear un nuevo usuario (administrador)
  crearUsuario(usuario: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}usuarios/`, usuario, { headers }).pipe(
      map(response => {
        console.log('Usuario creado exitosamente:', response);
        return response;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.clear();
  }

  // Método para obtener el perfil del usuario autenticado
  getPerfil(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}perfil/`, { headers });
  }

  // Obtener la lista de usuarios (solo administradores)
  getUsuarios(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}usuarios/`, { headers });
  }

  // Método para eliminar un usuario
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}usuarios/${id}/`);
  }

  // Actualizar usuario (usar PUT o PATCH dependiendo de tu API)
  actualizarUsuario(usuario: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}usuarios/${usuario.id}/`, usuario, { headers });
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = !!localStorage.getItem('authToken');
    console.log('Usuario autenticado:', token);
    return token;
  }

  // Método para recuperar contraseña
  recuperarContrasena(data: any): Observable<any> {
    const url = `${this.apiUrl}recuperar-contrasena/`;
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, data, { headers });
  }
}
