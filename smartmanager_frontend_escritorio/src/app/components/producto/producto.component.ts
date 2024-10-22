import { Component, OnInit  } from '@angular/core';
import { ProductoService } from '../../services/producto.service';  // Importar el servicio
import { MessageService, ConfirmationService } from 'primeng/api';  // Para mensajes y confirmación
import { Producto, Categoria, Proveedor, Ingrediente } from '../../interfaces/producto.interface';  // Importar las interfaces necesarias
// Importar los módulos de PrimeNG
import { TableModule } from 'primeng/table'; 
import { DialogModule } from 'primeng/dialog';  
import { DropdownModule } from 'primeng/dropdown';  
import { ButtonModule } from 'primeng/button'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';  
import { MultiSelectModule } from 'primeng/multiselect'; 

import { CategoriaService } from '../../services/categoria.service';
import { ProveedorService } from '../../services/proveedor.service';
import { IngredienteService } from '../../services/ingrediente.service';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [TableModule, DialogModule, DropdownModule, ButtonModule, FormsModule, CommonModule, MultiSelectModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss',
  providers: [MessageService, ConfirmationService] 
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];  
  categorias: Categoria[] = []; 
  proveedores: Proveedor[] = []; 
  ingredientes: Ingrediente[] = []; 

  productoSeleccionado: any = {
    nombreProducto: '',
    descripcion: '',
    precio: 0,
    cantidadMinima: 0,
    cantidadActual: 0,
    categoria: { id: null },
    proveedor: { id: null }, 
    ingredientes: []
  };
  selectedImage: File | null = null;
  selectedImageUrl: SafeUrl | null = null; // Variable to store sanitized image URL

  nuevaCategoria: any = {};
  nuevoProveedor: any = {};
  nuevoIngrediente: any = {};

  displayDialog: boolean = false;
  displayModalCategoria: boolean = false;
  displayModalProveedor: boolean = false;
  displayModalIngrediente: boolean = false;
  nuevoProducto: boolean = false;  
  imagenSeleccionada: File | null = null; 

  constructor(
    private sanitizer: DomSanitizer,
    private productoService: ProductoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private ingredienteService: IngredienteService

  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarProveedores();
    this.cargarIngredientes();
  }

  // Cargar productos desde la API
  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
      }
    });
  }

  // Cargar categorías
  cargarCategorias() {
    this.productoService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
      }
    });
  }

  // Cargar proveedores
  cargarProveedores() {
    this.productoService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: (err) => {
        console.error('Error al cargar proveedores', err);
      }
    });
  }

  // Cargar ingredientes
  cargarIngredientes() {
    this.productoService.getIngredientes().subscribe({
      next: (data) => {
        this.ingredientes = data;
      },
      error: (err) => {
        console.error('Error al cargar ingredientes', err);
      }
    });
  }

  onImageSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
  
      // Check if selectedImage is not null before creating URL
      if (this.selectedImage) {
        const objectURL = URL.createObjectURL(this.selectedImage);
        this.selectedImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }
    }
  }
   // Métodos para abrir y cerrar modales
   abrirModalCategoria() {
    this.displayModalCategoria = true;
  }


  abrirModalProveedor() {
    this.displayModalProveedor = true;
  }



  abrirModalIngrediente() {
    this.displayModalIngrediente = true;
  }

  // Guardar Categoría
  guardarCategoria() {
    this.categoriaService.crearCategoria(this.nuevaCategoria).subscribe({
      next: (response) => {
        console.log('Categoría guardada:', response);
        this.cerrarModalCategoria();
      },
      error: (err) => {
        console.error('Error al guardar categoría:', err);
      }
    });
  }

  cerrarModalCategoria() {
    this.nuevaCategoria = {};
    this.displayModalCategoria = false;
  }
  
   // Guardar Proveedor
   guardarProveedor() {
    this.proveedorService.crearProveedor(this.nuevoProveedor).subscribe({
      next: (response) => {
        console.log('Proveedor guardado:', response);
        this.cerrarModalProveedor();
      },
      error: (err) => {
        console.error('Error al guardar proveedor:', err);
      }
    });
  }
  cerrarModalProveedor() {
    this.nuevoProveedor = {};
    this.displayModalProveedor = false;
  }


   // Guardar Ingrediente
   guardarIngrediente() {
    this.ingredienteService.crearIngrediente(this.nuevoIngrediente).subscribe({
      next: (response) => {
        console.log('Ingrediente guardado:', response);
        this.cerrarModalIngrediente();
      },
      error: (err) => {
        console.error('Error al guardar ingrediente:', err);
      }
    });
  }
  cerrarModalIngrediente() {
    this.nuevoIngrediente = {};
    this.displayModalIngrediente = false;
  }


  
  // Abrir diálogo para crear un nuevo producto
  nuevo() {
    this.nuevoProducto = true;
    this.productoSeleccionado = {} as Producto;  // Limpiar el producto seleccionado
    this.displayDialog = true;
  }

  // Editar un producto existente
  editar(producto: Producto) {
    this.nuevoProducto = false;
    this.productoSeleccionado = { ...producto };
    this.displayDialog = true;
  }

  guardarProducto() {
    const formData = new FormData();
    formData.append('nombreProducto', this.productoSeleccionado.nombreProducto);
    formData.append('descripcion', this.productoSeleccionado.descripcion);
    formData.append('precio', this.productoSeleccionado.precio.toString());
    formData.append('cantidadMinima', this.productoSeleccionado.cantidadMinima.toString());
    formData.append('cantidadActual', this.productoSeleccionado.cantidadActual.toString());
    formData.append('categoria_id', this.productoSeleccionado.categoria.id.toString());
    formData.append('proveedor_id', this.productoSeleccionado.proveedor ? this.productoSeleccionado.proveedor.id.toString() : '');

    // Enviar los ingredientes correctamente como valores separados
    this.productoSeleccionado.ingredientes.forEach((ingrediente: any) => {
        formData.append('ingredientes_ids', ingrediente.id.toString());
    });

    if (this.selectedImage) {
      formData.append('imagen', this.selectedImage); // Append the image
    }

    // Llamar al servicio para guardar el producto
    this.productoService.crearProducto(formData).subscribe({
      next: (response) => {
        console.log('Producto creado:', response);
        // Manejar el éxito, cerrar el modal y actualizar la lista de productos
      },
      error: (error) => {
        console.error('Error al crear el producto', error);
      }
    });
}

  actualizarProducto() {
    const formData = new FormData();
    formData.append('nombreProducto', this.productoSeleccionado.nombreProducto);
    formData.append('descripcion', this.productoSeleccionado.descripcion);
    formData.append('precio', this.productoSeleccionado.precio.toString());
    formData.append('cantidadMinima', this.productoSeleccionado.cantidadMinima.toString());
    formData.append('cantidadActual', this.productoSeleccionado.cantidadActual.toString());
  
    // Asegúrate de que estás enviando los IDs correctos de `categoria` y `proveedor`
    formData.append('categoria_id', this.productoSeleccionado.categoria.id.toString());
  
    if (this.productoSeleccionado.proveedor && this.productoSeleccionado.proveedor.id) {
      formData.append('proveedor_id', this.productoSeleccionado.proveedor.id.toString());
    } else {
      formData.append('proveedor_id', '');
    }
  
    // Envía los IDs de los ingredientes correctamente
    formData.append(
      'ingredientes_ids',
      JSON.stringify(this.productoSeleccionado.ingredientes.map((i: any) => i.id))
    );
  
    // Si se ha seleccionado una nueva imagen, envíala
    if (this.selectedImage) {
      formData.append('imagen', this.selectedImage);
    }
  
    // Llamar al servicio para actualizar el producto
    this.productoService.actualizarProducto(this.productoSeleccionado.id, formData).subscribe({
      next: (response) => {
        console.log('Producto actualizado:', response);
        // Manejar el éxito, cerrar modal, refrescar la lista de productos
      },
      error: (error) => {
        console.error('Error al actualizar el producto', error);
      }
    });
  
}
  


  eliminarProducto(producto: Producto) {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar el producto ${producto.nombreProducto}?`,
      accept: () => {
        this.productoService.eliminarProducto(producto.id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado correctamente' });
            this.cargarProductos();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto' });
            console.error('Error al eliminar el producto', err);
          }
        });
      }
    });
  }

  cerrarDialogo() {
    this.displayDialog = false;
  }
  
  
  
}
