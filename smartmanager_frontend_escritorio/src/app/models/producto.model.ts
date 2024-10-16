export interface Producto {
    id?: number;  // Asegúrate de que este campo se ajuste a tu modelo Django
    nombreProducto: string;
    descripcion: string;
    imagen?: string | null;
    precio: number | null;
    cantidadMinima: number | null;
    cantidadActual: number | null;
    categoria_ids?: string | null;
    ingredientes_ids?:string | null;
  }