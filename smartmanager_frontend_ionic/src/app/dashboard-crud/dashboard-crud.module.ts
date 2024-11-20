import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardCrudPageRoutingModule } from './dashboard-crud-routing.module';

import { DashboardCrudPage } from './dashboard-crud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardCrudPageRoutingModule
  ],
  declarations: [DashboardCrudPage]
})
export class DashboardCrudPageModule {}
