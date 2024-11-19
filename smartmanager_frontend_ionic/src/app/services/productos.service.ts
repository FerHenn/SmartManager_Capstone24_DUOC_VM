import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private apiUrl = `${environment.apiUrl}producto/`;

  constructor(private http: HttpClient) {}

  getProductos() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
