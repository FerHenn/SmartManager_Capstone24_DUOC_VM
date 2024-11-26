export interface Producto {
  id: number;
  nombreProducto: string;
  cantidadActual: number;
  cantidadMinima: number;
}

export interface Ingrediente {
  id: number;
  nombreIngrediente: string;
  cantidadActual: number;
  cantidadMinima: number;
}

export interface ResumenInventario {
  fecha: string;
  productos_agotandose: Producto[];
  ingredientes_agotandose: Ingrediente[];
}

export interface VentasDiarias {
  id: number; // ID de la orden de compra
  fechaOrden: string; // Fecha y hora de la orden
  montoTotal: number; // Total de la venta
  metodoPago: string; // Método de pago usado
  productos: Array<{
    producto: string; // Nombre del producto
    cantidad: number; // Cantidad vendida
  }>;
}

export interface VentasMensuales {
  mes: number;
  total_ventas: number;
  total_transacciones: number;
  ventas: Array<{
    dia: string; // Fecha en formato agrupado (día)
    total_vendido: number; // Monto total vendido en el día
  }>;
}
