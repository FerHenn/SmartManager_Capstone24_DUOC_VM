import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component'; 
import { InicioComponent} from './components/inicio/inicio.component'; 
import { VentasComponent } from './components/ventas/ventas.component'; 
import { ProductoComponent } from './components/producto/producto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component'; 
import { RegistroComponent } from './components/registro/registro.component';
import { UsuarioComponent } from './components/usuario/usuario.component'; 
import { PerfilComponent } from './components/perfil/perfil.component'
import { ErrorComponent } from './components/error/error.component'
import { AdminGuard } from './guards/admin-guard.guard';  
import { AuthGuard } from './guards/admin-guard.guard';  

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard]},// autenticacion para los tokens
  { path: 'login', component: LoginComponent  },
  { path: 'usuario', component: UsuarioComponent, canActivate: [AdminGuard]}, // autenticacion para los admins
  { path: 'productos', component: ProductoComponent, canActivate: [AuthGuard]},
  { path: 'ventas', component: VentasComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'registro', component: RegistroComponent, canActivate: [AuthGuard]},
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
  {path: 'error', component: ErrorComponent},
  { path: '**', redirectTo: '' },
  // Otras rutas...
];
export const routing = RouterModule.forRoot(routes);