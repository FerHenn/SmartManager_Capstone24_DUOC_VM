import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-reporte-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importa CommonModule y FormsModule
  providers: [DatePipe, CurrencyPipe], // Provee los pipes necesarios
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.scss'],
})
export class ReporteVentasComponent implements OnInit {
  ventasDiarias: any[] = [];
  ventasMensuales: any[] = [];
  modalContenido: any[] = [];
  modalAbierto = false;
  listaDeProductos: { id: number; nombreProducto: string }[] = []; // Define the listaDeProductos property

  fechaSeleccionada: string = '';
  mesSeleccionado: string = '';
  fechasConVentas: string[] = []; // Fechas en las que hubo ventas.

  constructor(
    private dashboardService: DashboardService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.obtenerFechasConVentas();
  }

  obtenerFechasConVentas() {
    this.dashboardService.getFechasConVentas().subscribe((fechas: string[]) => {
      this.fechasConVentas = fechas;
    });
  }

  confirmarFechaDiaria() {
    if (this.fechaSeleccionada) {
      this.dashboardService.getVentasDiarias(this.fechaSeleccionada).subscribe((data) => {
        this.ventasDiarias = data.ventas;
      });
    }
  }

  confirmarMesMensual() {
    if (this.mesSeleccionado) {
      this.dashboardService.getVentasMensuales(this.mesSeleccionado).subscribe((data) => {
        this.ventasMensuales = data.ventas;
      });
    }
  }

  abrirModalVenta(venta: any) {
    // Procesa los datos para obtener el nombre y la cantidad
    this.modalContenido = venta.productos_ordenados.map((productoOrdenado: any) => ({
      producto: this.obtenerNombreProducto(productoOrdenado.producto), // Devuelve el nombre del producto
      cantidad: productoOrdenado.cantidad,
    }));
    this.modalAbierto = true; // Abre el modal
  }
  
  obtenerNombreProducto(productoId: number): string {
    // Simula un método para obtener el nombre del producto basado en el ID
    // Si tienes un servicio o lista de productos, úsalo aquí
    const producto = this.listaDeProductos.find((p) => p.id === productoId);
    return producto?.nombreProducto || 'Producto desconocido';
  }
  

  cerrarModal() {
    this.modalAbierto = false;
    this.modalContenido = [];
  }

  verOrdenesPorDia(fecha: string) {
    this.dashboardService.getVentasDiarias(fecha).subscribe((data) => {
      this.ventasDiarias = data.ventas;
    });
  }
}
