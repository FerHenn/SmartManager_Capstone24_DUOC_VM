import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrudProveedoresPage } from './crud-proveedores.page';

const routes: Routes = [
  {
    path: '',
    component: CrudProveedoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrudProveedoresPageRoutingModule {}
