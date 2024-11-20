import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudIngredientesPage } from './crud-ingredientes.page';

describe('CrudIngredientesPage', () => {
  let component: CrudIngredientesPage;
  let fixture: ComponentFixture<CrudIngredientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudIngredientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
