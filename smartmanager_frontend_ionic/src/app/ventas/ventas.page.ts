import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss']
})
export class VentasPage implements OnInit {
  vistaSeleccionada: 'diaria' | 'mensual' | null = null; // Indica si se muestra el resumen diario o mensual
  fechaSeleccionada: string = ''; // Fecha seleccionada para el reporte diario
  mesSeleccionado: string = ''; // Mes seleccionado para el reporte mensual
  resumenMensual = { montoTotal: 0, totalVentas: 0 };
  ventasDiarias: any[] = [];
  ventasMensuales: any[] = [];
  modalContenido: any[] = [];
  modalAbierto = false;
  modalTitulo: string = '';

  constructor(
    private reporteVentasService: DashboardService
  ) {}

  ngOnInit() {
    this.vistaSeleccionada = null;
  }

  seleccionarVista(vista: 'diaria' | 'mensual') {
    this.vistaSeleccionada = vista;

    if (vista === 'diaria') {
      this.fechaSeleccionada = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      this.cargarVentasDiarias();
    } else if (vista === 'mensual') {
      const fechaActual = new Date();
      this.mesSeleccionado = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      this.cargarVentasMensuales();
    }
  }

  cargarVentasDiarias() {
    this.reporteVentasService.getVentasDiarias(this.fechaSeleccionada).subscribe((data) => {
      this.ventasDiarias = data.ventas || [];
    });
  }

  cargarVentasMensuales() {
    const [anio, mes] = this.mesSeleccionado.split('-');
    const mesAnio = `${mes}/${anio}`;
    this.reporteVentasService.getVentasMensuales(mesAnio).subscribe((data) => {
      this.ventasMensuales = data.ventas || [];
    });
  }

  confirmarFechaDiaria() {
    this.cargarVentasDiarias();
  }

  abrirModalVenta(venta: any) {
    this.modalContenido = venta.productos_ordenados.map((productoOrdenado: any) => ({
      producto: productoOrdenado.nombre_producto || 'Producto desconocido',
      cantidad: productoOrdenado.cantidad
    }));
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.modalContenido = [];
  }

  redirigirVentasDiarias(fecha: string) {
    this.vistaSeleccionada = 'diaria';
    this.fechaSeleccionada = fecha;
    this.cargarVentasDiarias();
  }
  confirmarMesMensual() {
    this.cargarVentasMensuales();
    if (this.mesSeleccionado) {
      const [anio, mes] = this.mesSeleccionado.split('-');
      const mesAnio = `${mes}/${anio}`;
      this.reporteVentasService.getVentasMensuales(mesAnio).subscribe((data) => {
        console.log('Ventas mensuales:', data);
  
        // Calcular resumen mensual
        this.resumenMensual.montoTotal = data.total_ventas;
        this.resumenMensual.totalVentas = data.total_transacciones;
  
        this.ventasMensuales = data.ventas; // Actualizar la lista diaria
      });
    }
  }
  
  abrirModalResumenMensual() {
    if (this.resumenMensual.montoTotal > 0 || this.resumenMensual.totalVentas > 0) {
      this.modalTitulo = 'Resumen del Mes';
      this.modalAbierto = true;
    }
  }
}