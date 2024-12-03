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
  id: number;
  fechaOrden: string;
  montoTotal: number;
  metodoPago: string;
  productos: Array<{
    producto: string;
    cantidad: number;
  }>;
}

export interface VentasMensuales {
  mes: number;
  total_ventas: number;
  total_transacciones: number;
  ventas: Array<{
    dia: string;
    total_vendido: number;
  }>;
}
