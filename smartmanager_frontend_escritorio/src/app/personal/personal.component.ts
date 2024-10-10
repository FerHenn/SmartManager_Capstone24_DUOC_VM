// import { Component } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatIconModule } from '@angular/material/icon';
// import { MatTableModule } from '@angular/material/table';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogModule } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { MatCardModule } from '@angular/material/card';


// @Component({
//   selector: 'app-personal',
//   standalone: true,
  
//   templateUrl: './personal.component.html',
//   imports: [MatTableModule, MatIconModule, MatButtonModule, MatDialogModule,MatCardModule,CommonModule],
//   styleUrls: ['./personal.component.scss']
// })
// export class PersonalComponent {
//   empleados = [
//     { id: 1, nombre: 'Juan', apellido: 'Pérez', telefono: '123456789' },
//     { id: 2, nombre: 'María', apellido: 'Gómez', telefono: '987654321' }
//   ];

//   displayedColumns: string[] = ['nombre', 'apellido', 'telefono', 'acciones'];

//   constructor(public dialog: MatDialog) {}

//   abrirAgregarModal(): void {
//     // Aquí abrirías el modal para agregar empleados
//   }

//   abrirEditarModal(empleado: any): void {
//     // Aquí abrirías el modal para editar empleados, pasando el objeto empleado
//   }

//   eliminarEmpleado(id: number): void {
//     this.empleados = this.empleados.filter(empleado => empleado.id !== id);
//   }
// }
