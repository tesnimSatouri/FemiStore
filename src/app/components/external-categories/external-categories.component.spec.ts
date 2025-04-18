import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalCategoriesComponent } from './external-categories.component';

describe('ExternalCategoriesComponent', () => {
  let component: ExternalCategoriesComponent;
  let fixture: ComponentFixture<ExternalCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalCategoriesComponent]
    });
    fixture = TestBed.createComponent(ExternalCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
