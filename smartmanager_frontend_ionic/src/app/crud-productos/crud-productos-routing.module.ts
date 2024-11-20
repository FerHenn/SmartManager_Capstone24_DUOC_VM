import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrudProductosPage } from './crud-productos.page';

const routes: Routes = [
  {
    path: '',
    component: CrudProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrudProductosPageRoutingModule {}
