import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReviewSearchComponent } from './admin-review-search.component';

describe('AdminReviewSearchComponent', () => {
  let component: AdminReviewSearchComponent;
  let fixture: ComponentFixture<AdminReviewSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminReviewSearchComponent]
    });
    fixture = TestBed.createComponent(AdminReviewSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
