import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../smartmanager_frontend_escritorio/src/environments/environment';

export interface Categoria {
  id: number;
  nombreCategoria: string;
  descripcionCategoria: string;
  imagen?: File | string; 
}

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  
  crearCategoria(categoria: Categoria): Observable<Categoria> {
    const formData = new FormData();
    formData.append('nombreCategoria', categoria.nombreCategoria);
    formData.append('descripcionCategoria', categoria.descripcionCategoria);
    if (categoria.imagen) {
      formData.append('imagen', categoria.imagen as File);
    }

    return this.http.post<Categoria>(`${this.apiUrl}categoria/`, formData);
  }


  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}categoria/`);
  }


  actualizarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    const formData = new FormData();
    formData.append('nombreCategoria', categoria.nombreCategoria);
    formData.append('descripcionCategoria', categoria.descripcionCategoria);
    if (categoria.imagen instanceof File) {
      formData.append('imagen', categoria.imagen);
    }

    return this.http.put<Categoria>(`${this.apiUrl}categoria/${id}/`, formData);
  }


  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}categoria/${id}/`);
  }
}
