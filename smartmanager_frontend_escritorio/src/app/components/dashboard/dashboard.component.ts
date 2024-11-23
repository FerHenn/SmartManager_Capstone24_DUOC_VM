import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { VentasDiarias, VentasMensuales, ResumenInventario } from '../../interfaces/dashboard.interface';
import { NgxChartsModule } from '@swimlane/ngx-charts'; // Asegúrate de que está importado
import { CommonModule } from '@angular/common'; // Para funciones comunes de Angular

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule], // Incluye NgxChartsModule aquí
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

  productosVendidosData: any[] = []; // Datos para el gráfico de torta

  // Definición del esquema de colores
  colorScheme: any = {
    domain: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.cargarDatos();
    this.cargarProductosVendidosPorDia();
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

  cargarProductosVendidosPorDia(): void {
    this.dashboardService.getProductosVendidosPorDia().subscribe((data) => {
      this.productosVendidosData = data.map((item) => ({
        name: item.producto__nombreProducto,
        value: item.total_vendidos,
      }));
    });
  }
}
