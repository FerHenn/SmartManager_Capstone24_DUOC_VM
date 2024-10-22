import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://127.0.0.1:8000/api/categoria/';  // URL de la API de categorías

  constructor(private http: HttpClient) {}

  // Crear una nueva categoría
  crearCategoria(categoria: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, categoria);
  }

  // Obtener todas las categorías (por si necesitas cargarlas)
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}