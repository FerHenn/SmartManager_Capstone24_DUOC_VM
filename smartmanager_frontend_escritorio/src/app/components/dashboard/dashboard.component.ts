import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { VentasDiarias, VentasMensuales, ResumenInventario } from '../../interfaces/dashboard.interface';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  ventasDiarias: number = 0;
  ventasMensuales: number = 0;
  totalTransacciones: number = 0;

  totalProductosAgotandose: number = 0;
  totalIngredientesAgotandose: number = 0;

  ventasDiariasData: Array<{ name: string; value: number }> = [];
  ventasMensualesData: Array<{ name: string; value: number }> = [];

  // Definición del esquema de colores
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.dashboardService.getResumenInventario().subscribe((data: ResumenInventario) => {
      this.totalProductosAgotandose = data.productos_agotandose.length;
      this.totalIngredientesAgotandose = data.ingredientes_agotandose.length;
    });

    this.dashboardService.getVentasDiarias().subscribe((data: VentasDiarias) => {
      this.ventasDiarias = data.ventas.reduce((sum, venta) => sum + venta.montoTotal, 0);
      this.ventasDiariasData = data.ventas.map((venta) => ({
        name: venta.fechaOrden,
        value: venta.montoTotal,
      }));
    });

    this.dashboardService.getVentasMensuales().subscribe((data: VentasMensuales) => {
      this.ventasMensuales = data.total_ventas;
      this.totalTransacciones = data.total_transacciones;
      this.ventasMensualesData = data.ventas.map((venta) => ({
        name: venta.fechaOrden,
        value: venta.montoTotal,
      }));
    });
  }
}
