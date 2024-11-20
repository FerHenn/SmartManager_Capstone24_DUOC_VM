import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudProveedoresComponent } from './crud-proveedores.component';

describe('CrudProveedoresComponent', () => {
  let component: CrudProveedoresComponent;
  let fixture: ComponentFixture<CrudProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudProveedoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
