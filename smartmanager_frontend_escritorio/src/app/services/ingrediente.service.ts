import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IngredienteService {
  private apiUrl = 'https://smartmanager-capstone24-duoc-vm.onrender.com/api/ingrediente/';

  constructor(private http: HttpClient) {}

  getIngredientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}