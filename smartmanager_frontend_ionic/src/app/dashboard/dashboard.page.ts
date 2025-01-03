import { Component, OnInit, HostListener } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { PopoverController } from '@ionic/angular';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  screenWidth: number = window.innerWidth;
  ventasDiarias: number = 0;
  ventasMensuales: number = 0;
  totalTransacciones: number = 0;
  totalProductosAgotandose: number = 0;
  totalIngredientesAgotandose: number = 0;
  productosAgotandose: any[] = [];
  ingredientesAgotandose: any[] = [];
  ventasMensualesData: Array<{ name: string; value: number }> = [];
  productosVendidosData: any[] = [];
  modalAbierto: boolean = false;
  modalTitulo: string = '';
  modalContenido: Array<{ nombre: string; cantidadActual: number }> = [];

  colorScheme: Color = {
    domain: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
  };

  maxYValue: number = 0;

  constructor(
    private dashboardService: DashboardService,
    private popoverController: PopoverController
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  ngOnInit() {
    this.cargarDatos();
    this.cargarProductosVendidosPorDia();
  }

  cargarDatos() {
    this.dashboardService.getResumenInventario().subscribe((data) => {
      this.totalProductosAgotandose = data.productos_agotandose.length;
      this.totalIngredientesAgotandose = data.ingredientes_agotandose.length;
      this.productosAgotandose = data.productos_agotandose;
      this.ingredientesAgotandose = data.ingredientes_agotandose;
    });

    this.dashboardService.getVentasDiarias().subscribe((data: any) => {
      this.ventasDiarias = data.total_ventas;
    });

    this.dashboardService.getVentasMensuales().subscribe((data) => {
      this.ventasMensuales = data.total_ventas;
      this.totalTransacciones = data.total_transacciones;
      this.ventasMensualesData = data.ventas.map((venta: { dia: string; total_vendido: number }) => ({
        name: new Date(venta.dia).toLocaleDateString('es-CL', {
          day: '2-digit',
          month: 'short',
        }),
        value: venta.total_vendido,
      }));
      this.maxYValue = Math.max(...this.ventasMensualesData.map((v) => v.value));
    });
  }

  cargarProductosVendidosPorDia() {
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

  async openMenu() {
    const popover = await this.popoverController.create({
      component: MenuPopoverComponent,
      event: event,
      translucent: true,
    });
    await popover.present();
  }
}
