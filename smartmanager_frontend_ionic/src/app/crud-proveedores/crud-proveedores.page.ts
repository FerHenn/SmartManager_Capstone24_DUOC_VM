import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedorService, Proveedor } from '../services/proveedor.service';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
@Component({
  selector: 'app-crud-proveedores',
  templateUrl: './crud-proveedores.page.html',
  styleUrls: ['./crud-proveedores.page.scss'],
})
export class CrudProveedoresPage implements OnInit {
  proveedores: Proveedor[] = [];
  errorMessage: string = '';
  isCreating: boolean = false;
  showEditForm: boolean = false;
  selectedProveedor: Proveedor | null = null;
  editForm: FormGroup;

  constructor(
    private proveedorService: ProveedorService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private popoverController: PopoverController
  ) {
    this.editForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      nombre_proveedor: ['', [Validators.required, Validators.maxLength(32)]],
      numero_telefonico: ['', [Validators.required, Validators.maxLength(12)]],
      estado_activo: [true, Validators.required],
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
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe({
      next: (data) => (this.proveedores = data),
      error: (err) => (this.errorMessage = 'Error al cargar proveedores'),
    });
  }

  crearProveedor() {
    this.isCreating = true;
    this.editForm.reset({ id: '', nombre_proveedor: '', numero_telefonico: '', estado_activo: true });
  }

  guardarNuevoProveedor() {
    if (this.editForm.valid) {
      const nuevoProveedor = this.editForm.getRawValue();
      this.proveedorService.crearProveedor(nuevoProveedor).subscribe(() => {
        this.isCreating = false;
        this.cargarProveedores();
      });
    }
  }

  editarProveedor(proveedor: Proveedor) {
    this.selectedProveedor = proveedor;
    this.showEditForm = true;
    this.editForm.patchValue(proveedor);
  }

  guardarCambios() {
    if (this.selectedProveedor && this.editForm.valid) {
      const proveedorActualizado = { ...this.selectedProveedor, ...this.editForm.getRawValue() };
      this.proveedorService.actualizarProveedor(proveedorActualizado.id, proveedorActualizado).subscribe(() => {
        this.showEditForm = false;
        this.cargarProveedores();
      });
    }
  }

  cancelarCreacion() {
    this.isCreating = false;
    this.showEditForm = false;
    this.editForm.reset();
  }

  eliminarProveedor(id: number) {
    this.alertController
      .create({
        header: 'Confirmar',
        message: '¿Estás seguro de eliminar este proveedor?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.proveedorService.eliminarProveedor(id).subscribe(() => this.cargarProveedores());
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
}
