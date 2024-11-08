import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, Categoria, Proveedor, Ingrediente } from '../interfaces/producto.interface';
import { environment } from '../../environments/environment'; // Importa environment

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}producto/`);
  }

  // Método para crear producto
  crearProducto(producto: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}producto/`, producto);
  }
  // Método para actualizar producto
  actualizarProducto(id: number, producto: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}producto/${id}/`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}producto/${id}/`);
  }

  // Métodos para cargar categorías, proveedores e ingredientes
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}categoria/`);
  }

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}proveedores/`);
  }

  getIngredientes(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(`${this.apiUrl}ingrediente/`);
  }
}