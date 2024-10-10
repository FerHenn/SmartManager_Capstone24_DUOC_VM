import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
// import { PersonalComponent } from './personal/personal.component'; 
import { InicioComponent} from './inicio/inicio.component'; 
import { VentasComponent } from './ventas/ventas.component'; 
import { ProductoComponent } from './producto/producto.component'; 
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { RegistroComponent } from './registro/registro.component'; 

export const routes: Routes = [
{ path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'login', component: LoginComponent },
//   { path: 'personal', component: PersonalComponent },
  { path: 'producto', component: ProductoComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'registro', component: RegistroComponent },
  // Otras rutas...
];
export const routing = RouterModule.forRoot(routes);