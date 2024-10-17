import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component'; 
import { InicioComponent} from './components/inicio/inicio.component'; 
import { VentasComponent } from './components/ventas/ventas.component'; 
import { ProductoListaComponent } from './components/producto-lista/producto-lista.component';
import { ProductoFormularioComponent } from './components/producto-formulario/producto-formulario.component';
import { DashboardComponent } from './components/dashboard/dashboard.component'; 
import { RegistroComponent } from './components/registro/registro.component';
import { UsuarioComponent } from './components/usuario/usuario.component'; 
import { PerfilComponent } from './components/perfil/perfil.component'

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'productos', component: ProductoListaComponent },
  { path: 'producto/new', component: ProductoFormularioComponent },
  { path: 'producto/edit/:id', component: ProductoFormularioComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: '**', redirectTo: '' },
  // Otras rutas...
];
export const routing = RouterModule.forRoot(routes);