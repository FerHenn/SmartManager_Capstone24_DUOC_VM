import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = 'https://tu-api.com/stock'; // Cambia esto a tu API real

  constructor(private http: HttpClient) {}

  getStock(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
