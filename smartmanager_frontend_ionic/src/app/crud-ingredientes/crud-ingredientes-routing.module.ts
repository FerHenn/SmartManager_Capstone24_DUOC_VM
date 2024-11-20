import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrudIngredientesPage } from './crud-ingredientes.page';

const routes: Routes = [
  {
    path: '',
    component: CrudIngredientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrudIngredientesPageRoutingModule {}
