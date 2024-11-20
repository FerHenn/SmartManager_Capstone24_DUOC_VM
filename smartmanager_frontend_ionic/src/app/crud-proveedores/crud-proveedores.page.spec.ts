import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudProveedoresPage } from './crud-proveedores.page';

describe('CrudProveedoresPage', () => {
  let component: CrudProveedoresPage;
  let fixture: ComponentFixture<CrudProveedoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudProveedoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
