import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyComponent } from './currency.component';

describe('CurrencyComponent', () => {
  let component: CurrencyComponent;
  let fixture: ComponentFixture<CurrencyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyComponent]
    });
    fixture = TestBed.createComponent(CurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
