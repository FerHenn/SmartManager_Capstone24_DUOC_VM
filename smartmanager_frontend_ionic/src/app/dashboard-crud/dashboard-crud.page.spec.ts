import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardCrudPage } from './dashboard-crud.page';

describe('DashboardCrudPage', () => {
  let component: DashboardCrudPage;
  let fixture: ComponentFixture<DashboardCrudPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCrudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
