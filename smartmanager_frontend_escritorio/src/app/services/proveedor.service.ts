import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://127.0.0.1:8000/api/proveedores/';  // URL de la API de proveedores

  constructor(private http: HttpClient) {}

  // Crear un nuevo proveedor
  crearProveedor(proveedor: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, proveedor);
  }

  // Obtener todos los proveedores (por si necesitas cargarlos)
  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}