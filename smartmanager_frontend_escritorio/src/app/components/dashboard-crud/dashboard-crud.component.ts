import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

interface MenuItem {
  label: string;
  routerLink: string;
  description: string;
}


@Component({
  selector: 'app-dashboard-crud',
  imports: [RouterModule, CommonModule, MatCardModule],
  standalone: true,
  templateUrl: './dashboard-crud.component.html',
  styleUrls: ['./dashboard-crud.component.scss'],
})
export class DashboardCrudComponent implements OnInit {
  menuItems: MenuItem[] = []; 

  ngOnInit(): void {
    this.cargarMenucrud();
  }

  cargarMenucrud(): void {
    this.menuItems = [
      {
        label: 'Gestión de Proveedores',
        routerLink: '/CrudProveedores',
        description: 'Administra proveedores',
      },
      {
        label: 'Gestión de Categorías',
        routerLink: '/CrudCategorias',
        description: 'Administra categorías de productos',
      },
      {
        label: 'Gestión de Productos',
        routerLink: '/CrudProductos',
        description: 'Administra productos disponibles',
      },
      {
        label: 'Gestión de Ingredientes',
        routerLink: '/CrudIngredientes',
        description: 'Administra ingredientes necesarios',
      },
    ];
  }
}