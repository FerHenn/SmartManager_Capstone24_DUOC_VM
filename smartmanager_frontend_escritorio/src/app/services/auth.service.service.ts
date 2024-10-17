import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://smartmanager-capstone24-duoc-vm.onrender.com/api/';  // Aquí el enlace de tu API

  constructor(private http: HttpClient) { }

  login(nombreUsuario: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + 'login/', { nombreUsuario, password });
  }

}