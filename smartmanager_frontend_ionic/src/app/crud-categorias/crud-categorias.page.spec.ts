import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudCategoriasPage } from './crud-categorias.page';

describe('CrudCategoriasPage', () => {
  let component: CrudCategoriasPage;
  let fixture: ComponentFixture<CrudCategoriasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudCategoriasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
