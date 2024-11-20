import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCrudComponent } from './dashboard-crud.component';

describe('DashboardCrudComponent', () => {
  let component: DashboardCrudComponent;
  let fixture: ComponentFixture<DashboardCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
