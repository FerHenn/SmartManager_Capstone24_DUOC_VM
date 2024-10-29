export interface Ingrediente {
    id: number;
    nombreIngrediente: string;
    cantidadMinima: number;
    cantidadActual: number;
  }
  
  export interface Categoria {
    id: number;
    nombreCategoria: string;
  }
  
  export interface Proveedor {
    id: number;
    nombre_proveedor: string;
  }
  
  export interface Producto {
    id?: number;
    nombreProducto: string;
    descripcion: string;
    precio: number;
    cantidadMinima: number;
    cantidadActual: number;
    categoria: Categoria;
    proveedor: Proveedor;
    ingredientes: Ingrediente[];
    imagen?: string;  // Imagen puede ser opcional
    ultimaActualizacion?: string;
  }