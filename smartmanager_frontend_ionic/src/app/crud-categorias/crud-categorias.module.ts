import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrudCategoriasPageRoutingModule } from './crud-categorias-routing.module';

import { CrudCategoriasPage } from './crud-categorias.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrudCategoriasPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CrudCategoriasPage]
})
export class CrudCategoriasPageModule {}
