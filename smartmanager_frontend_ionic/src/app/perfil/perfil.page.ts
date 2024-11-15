import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../services/perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any = {}; // Inicializar como objeto vacío

  constructor(private perfilService: PerfilService) {}

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.perfilService.getPerfil().subscribe(
      (data) => {
        this.usuario = data;
      },
      (error) => {
        console.error('Error al cargar el perfil', error);
      }
    );
  }
}

