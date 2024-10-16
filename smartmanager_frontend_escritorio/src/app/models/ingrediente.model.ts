export interface Ingrediente {
    id: number;
    nombreIngrediente: string; // Cambiado para que coincida con tu base de datos
    cantidadMinima?: number; // Agregado como opcional
    cantidadActual?: number; // Agregado como opcional
    proveedor?: string; // Agregado como opcional
  }