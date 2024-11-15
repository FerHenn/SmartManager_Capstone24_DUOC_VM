import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private navCtrl: NavController) {}

  canActivate(): Observable<boolean> | boolean {
    return this.authService.getPerfil().pipe(
      map((perfil) => {
        if (perfil.role === 'Administrador') {
          return true; // Permitir acceso si es administrador
        } else {
          this.navCtrl.navigateRoot('/error'); // Redirigir si no es administrador
          return false;
        }
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private navCtrl: NavController) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();

    if (isAuthenticated) {
      return true; // Permitir acceso si el usuario está autenticado
    } else {
      this.navCtrl.navigateRoot('/login'); // Redirigir al login si no está autenticado
      return false;
    }
  }
}
