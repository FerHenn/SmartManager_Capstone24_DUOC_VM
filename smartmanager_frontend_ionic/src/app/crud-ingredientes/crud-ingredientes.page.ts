import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngredienteService } from '../services/ingrediente.service';
import { ProveedorService, Proveedor } from '../services/proveedor.service';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';

export interface Ingrediente {
  id?: number;
  nombreIngrediente: string;
  cantidadMinima: number;
  cantidadActual: number;
  proveedor: number | null;
}

@Component({
  selector: 'app-crud-ingredientes',
  templateUrl: './crud-ingredientes.page.html',
  styleUrls: ['./crud-ingredientes.page.scss'],
})
export class CrudIngredientesPage implements OnInit {
  ingredientes: Ingrediente[] = [];
  proveedores: Proveedor[] = [];
  editForm: FormGroup;
  isCreating = false;
  showEditForm = false;
  selectedIngrediente: Ingrediente | null = null;

  constructor(
    private ingredienteService: IngredienteService,
    private proveedorService: ProveedorService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private popoverController: PopoverController
  ) {
    this.editForm = this.fb.group({
      nombreIngrediente: ['', [Validators.required, Validators.maxLength(100)]],
      cantidadMinima: [0, [Validators.required, Validators.min(0)]],
      cantidadActual: [0, [Validators.required, Validators.min(0)]],
      proveedor: [null],
    });
  }

  ngOnInit() {
    this.cargarIngredientes();
    this.cargarProveedores();
  }
  async openMenu() {
    const popover = await this.popoverController.create({
      component: MenuPopoverComponent,
      event: event,
      translucent: true
    });
    await popover.present();
  }

  cargarIngredientes() {
    this.ingredienteService.getIngredientes().subscribe({
      next: (data) => (this.ingredientes = data),
      error: (err) => console.error('Error al cargar ingredientes', err),
    });
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (data) => (this.proveedores = data),
      error: (err) => console.error('Error al cargar proveedores', err),
    });
  }

  crearIngrediente() {
    this.isCreating = true;
    this.editForm.reset();
  }

  guardarNuevoIngrediente() {
    if (this.editForm.valid) {
      const nuevoIngrediente = this.editForm.getRawValue();
      this.ingredienteService.crearIngrediente(nuevoIngrediente).subscribe(() => {
        this.isCreating = false;
        this.cargarIngredientes();
      });
    }
  }

  editarIngrediente(ingrediente: Ingrediente) {
    this.selectedIngrediente = ingrediente;
    this.showEditForm = true;
    this.editForm.patchValue(ingrediente);
  }

  guardarCambios() {
    if (this.editForm.valid && this.selectedIngrediente) {
      const ingredienteActualizado = this.editForm.getRawValue();
      this.ingredienteService.actualizarIngrediente(this.selectedIngrediente.id!, ingredienteActualizado).subscribe(() => {
        this.showEditForm = false;
        this.cargarIngredientes();
      });
    }
  }

  cancelarCreacion() {
    this.isCreating = false;
    this.editForm.reset();
  }

  eliminarIngrediente(id: number | undefined) {
    if (id === undefined) {
      console.error('El ID del ingrediente es indefinido.');
      return;
    }
    this.alertController
      .create({
        header: 'Confirmar',
        message: '¿Estás seguro de eliminar este ingrediente?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.ingredienteService.eliminarIngrediente(id).subscribe(() => this.cargarIngredientes());
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
  

  getNombreProveedor(proveedorId: number | null): string {
    if (!proveedorId) {
      return 'No asignado';
    }
    const proveedor = this.proveedores.find((p) => p.id === proveedorId);
    return proveedor ? proveedor.nombre_proveedor : 'No asignado';
  }
}
