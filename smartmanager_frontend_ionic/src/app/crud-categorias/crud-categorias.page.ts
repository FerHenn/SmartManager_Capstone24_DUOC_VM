import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaService, Categoria } from '../services/categoria.service';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
@Component({
  selector: 'app-crud-categorias',
  templateUrl: './crud-categorias.page.html',
  styleUrls: ['./crud-categorias.page.scss'],
})
export class CrudCategoriasPage implements OnInit {
  categorias: Categoria[] = [];
  editForm: FormGroup;
  isCreating = false;
  showEditForm = false;
  selectedCategoria: Categoria | null = null;
  imagenSeleccionada: File | null = null;

  constructor(
    private categoriaService: CategoriaService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private popoverController: PopoverController
  ) {
    this.editForm = this.fb.group({
      nombreCategoria: ['', [Validators.required, Validators.maxLength(100)]],
      descripcionCategoria: ['', [Validators.required]],
      imagen: [''],
    });
  }

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al cargar categorías', err),
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }

  crearCategoria() {
    this.isCreating = true;
    this.editForm.reset();
  }

  guardarNuevaCategoria() {
    if (this.editForm.valid) {
      const nuevaCategoria = { ...this.editForm.getRawValue(), imagen: this.imagenSeleccionada };
      this.categoriaService.crearCategoria(nuevaCategoria).subscribe(() => {
        this.isCreating = false;
        this.cargarCategorias();
      });
    }
  }

  editarCategoria(categoria: Categoria) {
    this.selectedCategoria = categoria;
    this.showEditForm = true;
    this.editForm.patchValue(categoria);
  }

  guardarCambios() {
    if (this.editForm.valid && this.selectedCategoria) {
      const categoriaActualizada = { ...this.editForm.getRawValue(), imagen: this.imagenSeleccionada };
      this.categoriaService.actualizarCategoria(this.selectedCategoria.id, categoriaActualizada).subscribe(() => {
        this.showEditForm = false;
        this.cargarCategorias();
      });
    }
  }

  cancelarCreacion() {
    this.isCreating = false;
    this.imagenSeleccionada = null;
    this.editForm.reset();
  }

  eliminarCategoria(id: number) {
    this.alertController
      .create({
        header: 'Confirmar',
        message: '¿Estás seguro de eliminar esta categoría?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.categoriaService.eliminarCategoria(id).subscribe(() => this.cargarCategorias());
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
}
