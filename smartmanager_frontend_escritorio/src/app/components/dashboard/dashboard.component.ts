import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { VentasDiarias, VentasMensuales, ResumenInventario } from '../../interfaces/dashboard.interface';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para usar [(ngModel)]

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  ventasDiarias: number = 0;
  ventasMensuales: number = 0;
  totalTransacciones: number = 0;
  totalProductosAgotandose: number = 0;
  totalIngredientesAgotandose: number = 0;
  productosAgotandose: any[] = [];
  ingredientesAgotandose: any[] = [];
  ventasMensualesData: Array<{ name: string; value: number }> = [];
  productosVendidosData: any[] = [];
  mesSeleccionado: string = ''; // Almacena el mes seleccionado

  modalAbierto: boolean = false;
  modalTitulo: string = '';
  modalContenido: Array<{ nombre: string; cantidadActual: number }> = [];

  colorScheme: any = {
    domain: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
  };

  maxYValue: number = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.cargarDatos();
    this.cargarProductosVendidosPorDia();
  }

  cargarDatosIniciales() {
    this.mesSeleccionado = new Date().toISOString().slice(0, 7); // Mes actual en formato YYYY-MM
    this.actualizarVentasMensuales();
  }

  actualizarVentasMensuales() {
    if (this.mesSeleccionado) {
      const [anio, mes] = this.mesSeleccionado.split('-'); // Extraer año y mes del input tipo "month"
      const mesAnio = `${mes}/${anio}`; // Formatear como MM/YYYY

      this.dashboardService.getVentasMensuales(mesAnio).subscribe((data: any) => {
        console.log('Datos de ventas mensuales:', data);
        this.ventasMensuales = data.total_ventas;
        this.totalTransacciones = data.total_transacciones;

        this.ventasMensualesData = data.ventas.map((venta: { dia: string; total_vendido: number }) => ({
          name: new Date(venta.dia).toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          }),
          value: venta.total_vendido,
        }));

        this.maxYValue = this.ventasMensualesData.reduce(
          (max, venta) => (venta.value > max ? venta.value : max),
          0
        );
      });
    }
  }

  cargarDatos() {
    this.dashboardService.getResumenInventario().subscribe((data: ResumenInventario) => {
      this.totalProductosAgotandose = data.productos_agotandose.length;
      this.totalIngredientesAgotandose = data.ingredientes_agotandose.length;
      this.productosAgotandose = data.productos_agotandose;
      this.ingredientesAgotandose = data.ingredientes_agotandose;
    });

    this.dashboardService.getVentasDiarias().subscribe((data: any) => {
      console.log('Datos de ventas diarias:', data);
      this.ventasDiarias = data.total_ventas; // Monto total de ventas diarias
    });

    this.dashboardService.getVentasMensuales().subscribe((data: VentasMensuales) => {
      console.log('Datos de ventas mensuales:', data);
      this.ventasMensuales = data.total_ventas;
      this.totalTransacciones = data.total_transacciones;

      this.ventasMensualesData = data.ventas.map((venta) => ({
        name: new Date(venta.dia).toLocaleDateString('es-CL', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }),
        value: venta.total_vendido,
      }));

      this.maxYValue = this.ventasMensualesData.reduce(
        (max, venta) => (venta.value > max ? venta.value : max),
        0
      );
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

  abrirModalProductosAgotandose(): void {
    if (this.totalProductosAgotandose > 0) {
      this.modalTitulo = 'Productos agotándose';
      this.modalContenido = this.productosAgotandose.map(p => ({
        nombre: p.nombreProducto,
        cantidadActual: p.cantidadActual,
      }));
      this.modalAbierto = true;
    }
  }
  
  abrirModalIngredientesAgotandose(): void {
    if (this.totalIngredientesAgotandose > 0) {
      this.modalTitulo = 'Ingredientes agotándose';
      this.modalContenido = this.ingredientesAgotandose.map(i => ({
        nombre: i.nombreIngrediente,
        cantidadActual: i.cantidadActual,
      }));
      this.modalAbierto = true;
    }
  }
  
  cerrarModal(): void {
    this.modalAbierto = false;
    this.modalTitulo = '';
    this.modalContenido = [];
  }
}
