import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TableModule, NgxChartsModule, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  ventasDiarias: number = 5000;
  ventasMensuales: number = 120000;
  totalInventario: number = 350;


  // Usamos el nombre de un esquema predefinido en lugar de un objeto con 'domain'
  colorScheme: string = 'vivid';

  // Datos para el gráfico de barras (Ventas Mensuales)
  ventasMensualesData = [
    { name: 'Enero', value: 65000 },
    { name: 'Febrero', value: 59000 },
    { name: 'Marzo', value: 80000 },
    { name: 'Abril', value: 81000 },
    { name: 'Mayo', value: 56000 },
    { name: 'Junio', value: 55000 },
    { name: 'Julio', value: 40000 },
    { name: 'Agosto', value: 60000 },
    { name: 'Septiembre', value: 70000 },
    { name: 'Octubre', value: 90000 }
  ];

  // Datos para el gráfico de líneas (Ventas Diarias)
  ventasDiariasData = [
    {
      name: 'Ventas Diarias',
      series: [
        { name: 'Lunes', value: 5000 },
        { name: 'Martes', value: 4000 },
        { name: 'Miércoles', value: 3500 },
        { name: 'Jueves', value: 4500 },
        { name: 'Viernes', value: 6000 },
        { name: 'Sábado', value: 7000 },
        { name: 'Domingo', value: 3000 }
      ]
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}