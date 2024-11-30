import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts'; // For the charts
import { DashboardRoutingModule } from './dashboard-routing.module'; // Routing for the Dashboard
import { DashboardPage } from './dashboard.page'; // Main Dashboard Component/Page

@NgModule({
  declarations: [DashboardPage], // Declare the DashboardPage component
  imports: [
    CommonModule, 
    FormsModule,
    IonicModule,
    NgxChartsModule, 
    DashboardRoutingModule,
  ],
})
export class DashboardModule {}
