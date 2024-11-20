import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetodoPagoService {
  private apiUrl = `${environment.apiUrl}metodo-pago/`;

  constructor(private http: HttpClient) {}

  getMetodosPago() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
