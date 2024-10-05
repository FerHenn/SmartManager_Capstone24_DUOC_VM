import { Component } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
//   template: `
//   <mat-toolbar color="primary">
//     <span>Mi Aplicación</span>
//     <span class="spacer"></span>
//     <button mat-button>Inicio</button>
//     <button mat-button>Empleados</button>
//     <button mat-button>Login</button>
//     <div class="dropdown" dropdown>
//       <button dropdownToggle mat-button>Más</button>
//       <ul *dropdownMenu class="dropdown-menu">
//         <li><a class="dropdown-item" href="#">Acción 1</a></li>
//         <li><a class="dropdown-item" href="#">Acción 2</a></li>
//       </ul>
//     </div>
//   </mat-toolbar>
// `,
//   styles: [`
//   .spacer {
//     flex: 1 1 auto;
//   }
// `],
  imports: [BsDropdownModule, MatToolbarModule, MatButtonModule,RouterModule], // Importa los módulos necesarios
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private router: Router) {}
}
