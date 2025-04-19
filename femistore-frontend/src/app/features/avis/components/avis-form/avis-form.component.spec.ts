import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisFormComponent } from './avis-form.component';

describe('AvisFormComponent', () => {
  let component: AvisFormComponent;
  let fixture: ComponentFixture<AvisFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvisFormComponent]
    });
    fixture = TestBed.createComponent(AvisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
