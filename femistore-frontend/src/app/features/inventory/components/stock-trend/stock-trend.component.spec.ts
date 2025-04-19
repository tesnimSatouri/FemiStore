import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTrendComponent } from './stock-trend.component';

describe('StockTrendComponent', () => {
  let component: StockTrendComponent;
  let fixture: ComponentFixture<StockTrendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockTrendComponent]
    });
    fixture = TestBed.createComponent(StockTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
