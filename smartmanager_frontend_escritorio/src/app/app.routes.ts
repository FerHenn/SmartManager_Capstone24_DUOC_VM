import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component'; 
import { InicioComponent} from './components/inicio/inicio.component'; 
import { VentasComponent } from './components/ventas/ventas.component'; 
import { ProductoComponent } from './components/producto/producto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component'; 
import { ProductoCarritoComponent } from './components/producto-carrito/producto-carrito.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RegistroComponent } from './components/registro/registro.component';
import { UsuarioComponent } from './components/usuario/usuario.component'; 
import { PerfilComponent } from './components/perfil/perfil.component'
import { ErrorComponent } from './components/error/error.component'
import { AdminGuard } from './guards/admin-guard.guard';  
import { AuthGuard } from './guards/admin-guard.guard';  
import { CrudCategoriasComponent } from './components/crud-categorias/crud-categorias.component';
import { CrudIngredientesComponent } from './components/crud-ingredientes/crud-ingredientes.component';
import { CrudProductosComponent } from './components/crud-productos/crud-productos.component';
import { CrudProveedoresComponent } from './components/crud-proveedores/crud-proveedores.component';
import { DashboardCrudComponent } from './components/dashboard-crud/dashboard-crud.component';
import { ReporteVentasComponent } from './components/reporte-ventas/reporte-ventas.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent  },
  { path: 'CrudDashboard', component: DashboardCrudComponent, canActivate: [AuthGuard] },
  { path: 'CrudProveedores', component: CrudProveedoresComponent, canActivate: [AuthGuard] },
  { path: 'CrudCategorias', component: CrudCategoriasComponent, canActivate: [AuthGuard] },
  { path: 'CrudProductos', component: CrudProductosComponent, canActivate: [AuthGuard] },
  { path: 'CrudIngredientes', component: CrudIngredientesComponent, canActivate: [AuthGuard] },
  { path: 'usuario', component: UsuarioComponent, canActivate: [AdminGuard]},
  { path: 'productos', component: ProductoComponent, canActivate: [AuthGuard]},
  { path: 'ventas', component: VentasComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'carrito', component: ProductoCarritoComponent },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent, canActivate: [AuthGuard], data: { roles: ['Administrador'] }},
  { path: 'registro', component: RegistroComponent, canActivate: [AuthGuard]},
  { path: 'reporte-ventas', component: ReporteVentasComponent, canActivate: [AuthGuard]},
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
  { path: 'error', component: ErrorComponent},
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})  
export class AppRoutingModule { }
export const routing = RouterModule.forRoot(routes);