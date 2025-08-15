import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyComponent } from './emergency.component';

describe('EmergencyComponent', () => {
  let component: EmergencyComponent;
  let fixture: ComponentFixture<EmergencyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmergencyComponent]
    });
    fixture = TestBed.createComponent(EmergencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
