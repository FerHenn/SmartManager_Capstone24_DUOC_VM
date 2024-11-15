import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})

export class ProductoPage { 
  private apiUrl = `${environment.apiUrl}producto/`;
  products: any[] = [];

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<any[]>(this.apiUrl) // Usa apiUrl en lugar de la URL directa
      .subscribe(data => {
        this.products = data;
      });
  }
}
