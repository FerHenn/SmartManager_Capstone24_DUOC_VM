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

  getProductosByCategoria(categoriaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}producto/?categoria=${categoriaId}`);
  }

  crearOrden(productos: any[], metodoPagoId: number): Observable<any> {
    const token = localStorage.getItem('authToken');  // Obtén el token de autenticación
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
  
    const body = { productos, metodoPago: metodoPagoId };
    return this.http.post(`${this.apiUrl}crear-orden/`, body, { headers });
  }
  getMetodosPago(): Observable<any> {
    const url = `${this.apiUrl}metodo-pago/`;  // Asegúrate de que la URL coincida con el endpoint en el backend
    return this.http.get<any>(url);
  }
}