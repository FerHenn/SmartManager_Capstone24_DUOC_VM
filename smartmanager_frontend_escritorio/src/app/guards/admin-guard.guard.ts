import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.getPerfil().pipe(
      map((perfil) => {
        if (perfil.role === 'Administrador') {
          return true;  // Permitir acceso si es administrador
        } else {
          this.router.navigate(['/error']);  // Redirigir si no tiene permisos
          return false;
        }
      })
    );
  }
}


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {  // Este es el nuevo guard

  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuthenticated = this.authService.isAuthenticated();  // Verifica si el token está presente

    if (isAuthenticated) {
      return true;  // Permitir acceso si el usuario está autenticado
    } else {
      this.router.navigate(['/login']);  // Redirigir al login si no está autenticado
      return false;
    }
  }
  
}