import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}usuarios/`;

  constructor(private http: HttpClient) {}

  getUsuarios() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
