import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class IngredienteService {
  private apiUrl = environment.apiUrl;  

  constructor(private http: HttpClient) {}

   crearIngrediente(ingrediente: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}ingrediente/`, ingrediente);
  }
  getIngredientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}ingrediente/`);
  }
  actualizarIngrediente(id: number, ingrediente: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}ingrediente/${id}/`, ingrediente);
  }
  eliminarIngrediente(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}ingrediente/${id}/`);
  }
}
