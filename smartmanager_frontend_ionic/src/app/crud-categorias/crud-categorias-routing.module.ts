import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrudCategoriasPage } from './crud-categorias.page';

const routes: Routes = [
  {
    path: '',
    component: CrudCategoriasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrudCategoriasPageRoutingModule {}
