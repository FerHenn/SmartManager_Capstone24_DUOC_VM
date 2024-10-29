import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, Categoria, Proveedor, Ingrediente } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://127.0.0.1:8000/api/producto/';

  constructor(private http: HttpClient) {}


  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // Método para crear producto
  crearProducto(producto: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, producto);
  }
  // Método para actualizar producto
  actualizarProducto(id: number, producto: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // Métodos para cargar categorías, proveedores e ingredientes
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>('http://127.0.0.1:8000/api/categoria/');
  }

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>('http://127.0.0.1:8000/api/proveedores/');
  }

  getIngredientes(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>('http://127.0.0.1:8000/api/ingrediente/');
  }
}