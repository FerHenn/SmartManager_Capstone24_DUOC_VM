export interface Producto {
  id?: number;
  nombreProducto: string;
  descripcion: string;
  imagen?: string | File;
  precio: number;
  cantidadMinima?: number;
  cantidadActual: number;
  ultimaActualizacion?: string; 
  categoria: Categoria | null;
  proveedor: Proveedor | null; 
  ingredientes: Ingrediente[]; 
}

export interface Categoria {
  id: number;
  nombreCategoria: string;
  descripcionCategoria: string;
  imagen?: string | File;
}

export interface Proveedor {
  id: number;
  nombre_proveedor: string;
  numero_telefonico: string;
  estado_activo: boolean;
}

export interface Ingrediente {
  id: number;
  nombreIngrediente: string;
  cantidadMinima: number;
  cantidadActual: number;
  proveedor?: Proveedor | null;
}
