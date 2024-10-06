import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ventas',
  standalone: true,
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    FormsModule
  ]
})
export class VentasComponent {
  ventas = [
    { cantidadProductos: 3, nombreProductos: 'Producto 1', metodoPago: 'Tarjeta', plataforma: 'Web', idVenta: 'A001', valor: 5000 },
    { cantidadProductos: 1, nombreProductos: 'Producto 2', metodoPago: 'Efectivo', plataforma: 'Tienda', idVenta: 'A002', valor: 1500 },
  ];

  displayedColumns: string[] = ['cantidadProductos', 'nombreProductos', 'metodoPago', 'plataforma', 'idVenta', 'valor', 'acciones'];

  // Venta seleccionada para editar
  ventaEditando: any = null;

  // Obtener el total de ventas
  get totalVentas(): number {
    return this.ventas.reduce((total, venta) => total + venta.valor, 0);
  }

  // Agregar venta (con valores por defecto para ilustrar)
  agregarVenta() {
    const nuevaVenta = { cantidadProductos: 1, nombreProductos: 'Nuevo Producto', metodoPago: 'Tarjeta', plataforma: 'Web', idVenta: 'A003', valor: 3000 };
    this.ventas.push(nuevaVenta);
  }

  // Eliminar venta
  eliminarVenta(index: number) {
    this.ventas.splice(index, 1);
  }

  // Editar venta
  editarVenta(index: number) {
    this.ventaEditando = { ...this.ventas[index], index };
  }

  // Guardar cambios de la venta editada
  guardarCambios() {
    if (this.ventaEditando !== null) {
      const { index, ...nuevaVenta } = this.ventaEditando;
      this.ventas[index] = nuevaVenta;
      this.ventaEditando = null; // Limpiar formulario de edición
    }
  }

  // Cancelar edición
  cancelarEdicion() {
    this.ventaEditando = null;
  }
}
