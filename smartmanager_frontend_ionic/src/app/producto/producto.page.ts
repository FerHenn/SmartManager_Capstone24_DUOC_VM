import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html', // Asegúrate de que el nombre del archivo HTML también sea correcto
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage { // Este debe ser el nombre de la clase
  products: any[] = [];

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<any[]>('http://localhost:8100/api/productos/')
      .subscribe(data => {
        this.products = data;
      });
  }
}
