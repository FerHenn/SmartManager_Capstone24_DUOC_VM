import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard, AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard]  },
  { path: 'usuario', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioPageModule), canActivate: [AuthGuard]  },
  { path: 'registro', loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule) },
  { path: 'ventas', loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasPageModule), canActivate: [AuthGuard]  },
  { path: 'recuperar', loadChildren: () => import('./recuperar/recuperar.module').then(m => m.RecuperarPageModule), canActivate: [AuthGuard]  },
  { path: 'stock', loadChildren: () => import('./stock/stock.module').then(m => m.StockPageModule), canActivate: [AuthGuard]  }, 
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule), canActivate: [AuthGuard]  },
  { path: 'perfil', loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule) , canActivate: [AuthGuard] },
  {path: 'producto',loadChildren: () => import('./producto/producto.module').then( m => m.ProductoPageModule), canActivate: [AuthGuard]  },
  { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorPageModule) },
  { path: 'crud-proveedores', loadChildren: () => import('./crud-proveedores/crud-proveedores.module').then( m => m.CrudProveedoresPageModule), canActivate: [AuthGuard]  },
  { path: 'crud-categorias', loadChildren: () => import('./crud-categorias/crud-categorias.module').then( m => m.CrudCategoriasPageModule), canActivate: [AuthGuard]  },
  { path: 'crud-productos', loadChildren: () => import('./crud-productos/crud-productos.module').then( m => m.CrudProductosPageModule), canActivate: [AuthGuard]  },
  { path: 'crud-ingredientes', loadChildren: () => import('./crud-ingredientes/crud-ingredientes.module').then( m => m.CrudIngredientesPageModule), canActivate: [AuthGuard]  },
  { path: 'dashboard-crud', loadChildren: () => import('./dashboard-crud/dashboard-crud.module').then( m => m.DashboardCrudPageModule), canActivate: [AuthGuard]  },  {
    path: 'carrito',
    loadChildren: () => import('./carrito/carrito.module').then( m => m.CarritoPageModule)
  },



  // Otras rutas que desees añadir...
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
