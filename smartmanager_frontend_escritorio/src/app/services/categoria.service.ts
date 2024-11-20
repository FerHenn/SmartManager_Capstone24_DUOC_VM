import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Importa environment

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = environment.apiUrl;  // URL de la API de categorías

  constructor(private http: HttpClient) {}

  // Crear una nueva categoría
  crearCategoria(categoria: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}categoria/`, categoria);
  }

  // Obtener todas las categorías (por si necesitas cargarlas)
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}categoria/`);
  }
}