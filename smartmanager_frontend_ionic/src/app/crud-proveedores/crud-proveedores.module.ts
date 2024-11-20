import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrudProveedoresPageRoutingModule } from './crud-proveedores-routing.module';

import { CrudProveedoresPage } from './crud-proveedores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CrudProveedoresPageRoutingModule
  ],
  declarations: [CrudProveedoresPage]
})
export class CrudProveedoresPageModule {}
