import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { environment } from '../../environments/environment'; // Importa el archivo de entorno

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl; // Dirección de tu API

  constructor(private http: HttpClient, private navCtrl: NavController) {}

  // Método para obtener el token de localStorage cada vez que se necesite
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Método para hacer login
  login(nombreUsuario: string, password: string): Observable<any> {
    const loginUrl = `${this.apiUrl}login/`;
    const body = { nombreUsuario, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(loginUrl, body, { headers }).pipe(
      map(response => {
        if (response && response.token) {
          console.log('Token recibido:', response.token);
          localStorage.setItem('authToken', response.token); // Guarda el token en localStorage

          // Redirigir usando NavController en lugar de recargar la página
          this.navCtrl.navigateRoot('/home'); // Navega a la página de inicio
        }
        return response;
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

  // Método para hacer logout
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
          localStorage.removeItem('authToken'); // Eliminar el token del localStorage
          this.navCtrl.navigateRoot('/login'); // Redirige al login
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
