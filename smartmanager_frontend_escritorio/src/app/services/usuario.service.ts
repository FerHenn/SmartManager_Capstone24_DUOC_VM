import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerfilUsuario } from '../interfaces/usuario.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}usuarios/`;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<PerfilUsuario[]> {
    return this.http.get<PerfilUsuario[]>(this.apiUrl);
  }

  crearUsuario(usuario: PerfilUsuario): Observable<PerfilUsuario> {
    return this.http.post<PerfilUsuario>(this.apiUrl, usuario);
  }

  actualizarUsuario(usuario: PerfilUsuario): Observable<PerfilUsuario> {
    return this.http.put<PerfilUsuario>(`${this.apiUrl}${usuario.id}/`, usuario);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
