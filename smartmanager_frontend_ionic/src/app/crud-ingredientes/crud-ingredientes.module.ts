import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrudIngredientesPageRoutingModule } from './crud-ingredientes-routing.module';

import { CrudIngredientesPage } from './crud-ingredientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrudIngredientesPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [CrudIngredientesPage]
})
export class CrudIngredientesPageModule {}
