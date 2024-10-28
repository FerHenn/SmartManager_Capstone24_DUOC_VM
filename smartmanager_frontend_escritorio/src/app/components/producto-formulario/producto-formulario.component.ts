import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule,FormControl } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CategoriaService } from '../../services/categoria.service';
import { IngredienteService } from '../../services/ingrediente.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'; // Para mat-option

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule,CommonModule,MatFormFieldModule,MatSelectModule,MatOptionModule],
  selector: 'app-producto-formulario',
  templateUrl: './producto-formulario.component.html',
  styleUrls: ['./producto-formulario.component.scss'],
})
export class ProductoFormularioComponent implements OnInit {
  productoForm: FormGroup;
  categorias: any[] = [];
  ingredientes: any[] = [];
  isEditMode = false;
  productId!: number;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private ingredienteService: IngredienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productoForm = this.fb.group({
      nombreProducto: [''],
      descripcion: [''],
      imagen: [null], // Para la imagen
      precio: [''],
      cantidadMinima: [''],
      cantidadActual: [''],
      categoria_id: [''],
      ingredientes: [[]], // Arreglo para los ingredientes
    });
  }

  ngOnInit(): void {
    // Cargar listas de categorías e ingredientes
    this.categoriaService.getCategorias().subscribe((data) => {
      this.categorias = data;
    });

    this.ingredienteService.getIngredientes().subscribe((data) => {
      this.ingredientes = data;
    });

    // Ver si estamos en modo edición
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = params['id'];
        this.productoService.getProducto(this.productId).subscribe((data) => {
          this.productoForm.patchValue(data);
        });
      }
    });
  }
  onSubmit() {
    const formData = new FormData(); // Para manejar la subida de la imagen
    Object.keys(this.productoForm.value).forEach((key) => {
      if (key === 'imagen' && this.productoForm.value[key]) {
        formData.append(key, this.productoForm.get(key)?.value);
      } else {
        formData.append(key, this.productoForm.value[key]);
      }
    });

    if (this.isEditMode) {
      this.productoService.updateProducto(this.productId, formData).subscribe(() => {
        this.router.navigate(['/productos']);
      });
    } else {
      this.productoService.createProducto(formData).subscribe(() => {
        this.router.navigate(['/productos']);
      });
    }
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productoForm.patchValue({
        imagen: file
      });
    }
  }
}