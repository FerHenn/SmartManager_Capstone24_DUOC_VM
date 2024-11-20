import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private apiUrl = `${environment.apiUrl}orden-compra/`;

  constructor(private http: HttpClient) {}

  getOrdenes() {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearOrden(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  eliminarOrden(id: number) {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  actualizarOrden(data: any) {
    return this.http.put(`${this.apiUrl}${data.id}/`, data);
  }
}
