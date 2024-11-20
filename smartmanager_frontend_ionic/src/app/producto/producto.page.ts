import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Producto {
  id?: number;
  nombreProducto: string;
  descripcion: string;
  precio: number;
  categoria: { nombreCategoria: string };
  proveedor: { nombre_proveedor: string };
  cantidadMinima: number;
  cantidadActual: number;
  ultimaActualizacion: Date;
  ingredientes: { nombreIngrediente: string }[];
  imagen: string;
}

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage {
  private apiUrl = `${environment.apiUrl}producto/`;  // URL de la API
  productos: Producto[] = [];

  categorias = [{ nombreCategoria: 'Categoría 1' }, { nombreCategoria: 'Categoría 2' }];
  proveedores = [{ nombre_proveedor: 'Proveedor 1' }, { nombre_proveedor: 'Proveedor 2' }];
  ingredientes = [{ nombreIngrediente: 'Ingrediente 1' }, { nombreIngrediente: 'Ingrediente 2' }];

  displayDialog: boolean = false;  // Controlar la visibilidad del modal
  productoSeleccionado: Producto = this.crearProductoVacio();  // Producto vacío inicial
  selectedImageUrl: string = '';  // Imagen seleccionada

  constructor(private http: HttpClient) {
    this.loadProducts();  // Cargar productos cuando se inicie el componente
  }

  // Función para cargar productos desde la API
  loadProducts() {
    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.productos = data || [];  // Actualizar lista de productos
      },
      error: (error) => {
        console.error('Error al cargar los productos', error);
        this.productos = [];  // Si hay error, dejamos la lista vacía
      }
    });
  }

  // Función para abrir el modal y crear un nuevo producto
  nuevoProducto() {
    this.productoSeleccionado = this.crearProductoVacio();  // Resetea el producto vacío
    this.selectedImageUrl = '';  // Limpiar la imagen seleccionada
    this.displayDialog = true;  // Mostrar el modal
  }

  // Función para crear un producto vacío
  crearProductoVacio(): Producto {
    return {
      nombreProducto: '',
      descripcion: '',
      precio: 0,
      categoria: { nombreCategoria: '' },
      proveedor: { nombre_proveedor: '' },
      cantidadMinima: 0,
      cantidadActual: 0,
      ultimaActualizacion: new Date(),
      ingredientes: [],
      imagen: ''
    };
  }

  // Función para guardar el producto, ya sea creando o editando
  guardarProducto() {
    // Validar que los campos obligatorios estén completos
    if (!this.productoSeleccionado.nombreProducto || !this.productoSeleccionado.precio || this.productoSeleccionado.precio <= 0) {
      alert('Por favor, completa todos los campos obligatorios y asegúrate de que el precio sea válido.');
      return;
    }

    const productoAEnviar: Producto = {
      ...this.productoSeleccionado,
      imagen: this.selectedImageUrl || '',  // Asignar la imagen seleccionada (si existe)
    };

    // Si el producto tiene id, es una actualización; si no, es un nuevo producto
    if (this.productoSeleccionado.id) {
      this.http.put<Producto>(`${this.apiUrl}${this.productoSeleccionado.id}`, productoAEnviar).subscribe({
        next: (data) => {
          console.log('Producto editado', data);
          this.loadProducts();  // Recargar los productos después de editar
        },
        error: (error) => {
          console.error('Error al editar el producto', error);
          alert('Hubo un problema al editar el producto.');
        }
      });
    } else {
      this.http.post<Producto>(this.apiUrl, productoAEnviar).subscribe({
        next: (data) => {
          console.log('Nuevo producto creado', data);
          this.loadProducts();  // Recargar los productos después de crear
        },
        error: (error) => {
          console.error('Error al crear el producto', error);
          alert('Hubo un problema al crear el producto.');
        }
      });
    }

    // Cerrar el modal después de guardar el producto
    this.cerrarDialogo();
  }

  // Función para cerrar el modal
  cerrarDialogo() {
    this.displayDialog = false;
    this.productoSeleccionado = this.crearProductoVacio(); // Resetear el producto seleccionado
    this.selectedImageUrl = ''; // Limpiar la imagen seleccionada
  }

  // Función para manejar la selección de la imagen
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result as string;  // Convertir la imagen a una URL base64
        this.productoSeleccionado.imagen = this.selectedImageUrl;  // Guardar la imagen seleccionada
      };
      reader.readAsDataURL(file);  // Leer la imagen seleccionada
    }
  }

  // Función para manejar el cambio del estado del modal
  onModalChange(event: any) {
    this.displayDialog = event as boolean; // Convertir el evento a booleano
  }
}
