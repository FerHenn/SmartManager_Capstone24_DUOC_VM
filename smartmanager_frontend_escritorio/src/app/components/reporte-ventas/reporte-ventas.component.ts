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
    this.cargarListaDeProductos(); // Carga los productos disponibles
  }

  cargarListaDeProductos() {
    this.dashboardService.getResumenInventario().subscribe((data: any) => {
      // Si `data` incluye productos, ajusta la asignación
      this.listaDeProductos = data.productos || [];
      console.log('Productos cargados:', this.listaDeProductos); // Depuración
    });
  }

  obtenerFechasConVentas() {
    this.dashboardService.getFechasConVentas().subscribe((fechas: string[]) => {
      this.fechasConVentas = fechas;
    });
  }

  confirmarFechaDiaria() {
    if (this.fechaSeleccionada) {
      this.dashboardService.getVentasDiarias(this.fechaSeleccionada).subscribe((data) => {
        console.log('Ventas diarias:', data); // Depuración
        this.ventasDiarias = data.ventas;
      });
    }
  }

  confirmarMesMensual() {
    if (this.mesSeleccionado) {
      const [anio, mes] = this.mesSeleccionado.split('-'); // Extraer año y mes del input tipo "month"
      const mesAnio = `${mes}/${anio}`; // Formatear como MM/YYYY
      this.dashboardService.getVentasMensuales(mesAnio).subscribe((data) => {
        console.log('Ventas mensuales:', data); // Depuración
        this.ventasMensuales = data.ventas;
      });
    }
  }  

  abrirModalVenta(venta: any) {
    console.log('Venta seleccionada:', venta); // Depuración
    this.modalContenido = venta.productos_ordenados.map((productoOrdenado: any) => ({
      producto: productoOrdenado.nombre_producto || 'Producto desconocido', // Usa el nombre directamente
      cantidad: productoOrdenado.cantidad,
    }));
    console.log('Contenido del modal:', this.modalContenido); // Depuración
    this.modalAbierto = true; // Abre el modal
  }  
  
  obtenerNombreProducto(productoId: number): string {
    // Simula un método para obtener el nombre del producto basado en el ID
    // Si tienes un servicio o lista de productos, úsalo aquí
    const producto = this.listaDeProductos.find((p) => p.id === productoId);
    return producto ? producto.nombreProducto : 'Producto desconocido';
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
