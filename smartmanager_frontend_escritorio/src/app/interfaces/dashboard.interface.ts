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
  fecha: string;
  ventas: Array<{
    id: number;
    montoTotal: number;
    fechaOrden: string;
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
