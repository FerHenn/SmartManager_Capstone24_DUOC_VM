import { Component, OnInit } from '@angular/core';
import { VentasService } from '../services/ventas.service';
import { MetodoPagoService } from '../services/metodo-pago.service';
import { UsuarioService } from '../services/usuario.service';
import { ProductosService } from '../services/productos.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {
  ordenes: any[] = [];
  metodosPago: any[] = [];
  usuarios: any[] = [];
  productos: any[] = [];
  ordenSeleccionada: any = null;

  constructor(
    private ventasService: VentasService,
    private metodoPagoService: MetodoPagoService,
    private usuarioService: UsuarioService,
    private productosService: ProductosService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarDatos();
    this.cargarProductos();
  }

  async cargarDatos() {
    try {
      const [ordenes, metodosPago, usuarios] = await Promise.all([
        this.ventasService.getOrdenes().toPromise().then((res) => res || []),
        this.metodoPagoService.getMetodosPago().toPromise().then((res) => res || []),
        this.usuarioService.getUsuarios().toPromise().then((res) => res || []),
      ]);

      this.ordenes = ordenes.map((orden) => ({
        ...orden,
        usuarioNombre: usuarios.find((u) => u.id === orden.usuario)?.nombre || 'Desconocido',
        metodoPagoNombre: metodosPago.find((mp) => mp.id === orden.metodoPago)?.nombre_metodo_pago || 'Desconocido',
      }));

      this.metodosPago = metodosPago;
      this.usuarios = usuarios;
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.mostrarToast('Error al cargar los datos. Inténtalo de nuevo más tarde.');
    }
  }

  cargarProductos() {
    this.productosService.getProductos().subscribe(
      (data) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error al cargar los productos:', error);
      }
    );
  }

  editarOrden(orden: any) {
    this.ordenSeleccionada = { ...orden };
  }

  guardarOrden() {
    const payload = {
      ...this.ordenSeleccionada,
      productos_ordenados: this.ordenSeleccionada.productos_ordenados.map((p: any) => ({
        producto: p.producto,
        cantidad: p.cantidad,
      })),
    };

    this.ventasService.actualizarOrden(payload).subscribe(
      () => {
        this.mostrarToast('Orden actualizada con éxito.');
        this.ordenSeleccionada = null;
        this.cargarDatos();
      },
      (error) => {
        console.error('Error al actualizar la orden:', error);
        this.mostrarToast('Error al actualizar la orden. Inténtalo de nuevo.');
      }
    );
  }

  cancelarEdicion() {
    this.ordenSeleccionada = null;
  }

  recalcularMontoTotal() {
    let total = 0;
    for (const producto of this.ordenSeleccionada.productos_ordenados) {
      const precioUnitario = this.obtenerPrecioProducto(producto.producto);
      total += (producto.cantidad || 0) * precioUnitario;
    }
    this.ordenSeleccionada.montoTotal = total;
  }

  obtenerPrecioProducto(productoId: number): number {
    const producto = this.productos.find((prod) => prod.id === productoId);
    return producto ? producto.precio : 0;
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
    });
    toast.present();
  }
    // Eliminar una orden
    eliminarOrden(id: number) {
      this.ventasService.eliminarOrden(id).subscribe(
        () => {
          this.mostrarToast('Orden eliminada con éxito.');
          this.cargarDatos(); // Recargar la lista de órdenes
        },
        (error) => {
          console.error('Error al eliminar la orden:', error);
          this.mostrarToast('Error al eliminar la orden. Inténtalo de nuevo.');
        }
      );
    }
}
