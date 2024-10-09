import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  // Puedes definir las variables que necesites aquí.
  totalSales: number = 5000; // Valor de ejemplo
  totalUsers: number = 150; // Valor de ejemplo

  constructor() {}
  
  // Puedes añadir métodos para cargar los datos necesarios
}

