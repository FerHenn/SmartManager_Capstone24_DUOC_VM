import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudProductosPage } from './crud-productos.page';

describe('CrudProductosPage', () => {
  let component: CrudProductosPage;
  let fixture: ComponentFixture<CrudProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
