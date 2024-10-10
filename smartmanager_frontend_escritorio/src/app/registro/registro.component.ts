import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Importar MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Importar MatInputModule
import { ReactiveFormsModule } from '@angular/forms'; // Importar el módulo de formularios reactivos
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,  // Asegurarse de importar MatFormFieldModule
    MatInputModule,      // Asegurarse de importar MatInputModule
    MatButtonModule,      // Para el botón de submit
    HttpClientModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
  providers: [FormBuilder]
})
export class RegistroComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registroForm = this.fb.group({
      username: ['', Validators.required], //nombre completo 
      email: ['', [Validators.required, Validators.email]], //correo
      password: ['', Validators.required], //contraseña
      telefono: ['', Validators.required],
    });
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    if (this.registroForm.valid) {
      this.http.post('http://localhost:8000/api/registro/', this.registroForm.value) //cambiar el url si es necesario
        .subscribe(response => {
          console.log('Registro exitoso', response);
        }, error => {
          console.error('Error en el registro', error);
        });
    }
  }
}
