import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService} from '../services/producto.service';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
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

@Component({
  selector: 'app-crud-productos',
  templateUrl: './crud-productos.page.html',
  styleUrls: ['./crud-productos.page.scss'],
})
export class CrudProductosPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  productos: any[] = [];
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];
  ingredientes: Ingrediente[] = [];
  editForm: FormGroup;
  selectedProducto: any = null;
  isCreating = false;
  showEditForm = false;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private popoverController: PopoverController
  ) {
    this.editForm = this.fb.group({
      nombreProducto: ['', Validators.required],
      descripcion: [''],
      precio: [0, Validators.required],
      cantidadMinima: [0],
      cantidadActual: [0, Validators.required],
      categoria: [null],
      proveedor: [null],
      ingredientes: [[]],
      imagen: [null],
    });
  }
    async openMenu() {
      const popover = await this.popoverController.create({
        component: MenuPopoverComponent,
        event: event, // Asegúrate de pasar el evento si necesitas posición
        translucent: true
      });
      await popover.present();
    }
  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarProveedores();
    this.cargarIngredientes();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe((data) => {
      this.productos = data;
      console.log(this.productos); // Verifica si los datos están llegando
    });
  }
  

  cargarCategorias() {
    this.productoService.getCategorias().subscribe((data) => (this.categorias = data));
  }

  cargarProveedores() {
    this.productoService.getProveedores().subscribe((data) => (this.proveedores = data));
  }

  cargarIngredientes() {
    this.productoService.getIngredientes().subscribe((data) => (this.ingredientes = data));
  }
  
  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300); // Desplazarse al final con animación
    }, 100);
  }

  scrollToTop() {
    setTimeout(() => {
      this.content.scrollToTop(300); // Desplazarse al inicio con animación
    }, 100);
  }

  crearProducto() {
    this.isCreating = true;
    this.editForm.reset();
    this.scrollToBottom(); // Desplázate al final
  }

  guardarNuevoProducto() {
    const formData = this.buildFormData(this.editForm.value);
    this.productoService.crearProducto(formData).subscribe(() => {
      this.mostrarAlerta('Producto creado', 'El producto se creó correctamente.');
      this.isCreating = false;
      this.cargarProductos();
      this.scrollToTop(); // Desplázate al inicio
    });
  }

  editarProducto(producto: any) {
    this.selectedProducto = producto;
    this.showEditForm = true;
    this.editForm.patchValue(producto); 
    setTimeout(() => {
      this.scrollToBottom(); 
    }, 200); 
  }
  

  guardarCambios() {
    if (this.selectedProducto) {
      const formData = this.buildFormData(this.editForm.value);
      this.productoService.actualizarProducto(this.selectedProducto.id, formData).subscribe(() => {
        this.mostrarAlerta('Producto actualizado', 'El producto se actualizó correctamente.');
        this.showEditForm = false;
        this.cargarProductos();
        this.scrollToTop(); // Desplázate al inicio
      });
    }
  }

  async eliminarProducto(id: number) {
    const alert = await this.alertController.create({
      header: '¿Eliminar producto?',
      message: 'No podrás revertir esta acción.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.productoService.eliminarProducto(id).subscribe(() => {
              this.mostrarAlerta('Producto eliminado', 'El producto fue eliminado correctamente.');
              this.cargarProductos();
            });
          },
        },
      ],
    });

    await alert.present();
  }

  cancelarCreacion() {
    this.isCreating = false;
    this.editForm.reset();
    this.scrollToTop(); // Desplázate al inicio
  }

  buildFormData(data: any): FormData {
    const formData = new FormData();
    formData.append('nombreProducto', data.nombreProducto);
    formData.append('descripcion', data.descripcion || '');
    formData.append('precio', data.precio.toString());
    formData.append('cantidadMinima', data.cantidadMinima?.toString() || '0');
    formData.append('cantidadActual', data.cantidadActual.toString());
    formData.append('categoria_id', data.categoria?.id || '');
    formData.append('proveedor_id', data.proveedor?.id || '');
    formData.append('ingredientes', JSON.stringify(data.ingredientes.map((ing: Ingrediente) => ing.id)));
    if (data.imagen) {
      formData.append('imagen', data.imagen);
    }
    return formData;
  }

  getIngredientesNombres(ingredientes: Ingrediente[]): string {
    return ingredientes.map((ing) => ing.nombreIngrediente).join(', ');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.editForm.patchValue({ imagen: file });
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
