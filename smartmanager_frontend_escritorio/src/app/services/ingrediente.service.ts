import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngredienteService {
  private apiUrl = 'http://127.0.0.1:8000/api/ingrediente/';  // URL de la API de ingredientes

  constructor(private http: HttpClient) {}

   // Crear un nuevo ingrediente
   crearIngrediente(ingrediente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ingrediente);
  }

  // Obtener todos los ingredientes (por si necesitas cargarlos)
  getIngredientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
