import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true, // Indica que es un componente independiente
  imports: [
    ReactiveFormsModule,  // Para formGroup
    CardModule,           // Para p-card
    DialogModule,         // Para p-dialog
    ButtonModule,         // Para pButton
    MatFormFieldModule,   // Para mat-form-field
    MatInputModule        // Para matInput
  ],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss']
})
export class RecuperarContrasenaComponent {
  recuperarForm: FormGroup;
  displaySuccessDialog = false;
  displayErrorDialog = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.recuperarForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required, Validators.minLength(6)]],
      contrasenaAdmin: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.recuperarForm.valid) {
      this.authService.recuperarContrasena(this.recuperarForm.value)
        .subscribe(
          response => {
            this.displaySuccessDialog = true;
          },
          error => {
            this.displayErrorDialog = true;
          }
        );
    }
  }
}
