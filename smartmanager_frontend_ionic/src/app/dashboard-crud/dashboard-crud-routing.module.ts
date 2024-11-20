import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardCrudPage } from './dashboard-crud.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardCrudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardCrudPageRoutingModule {}
