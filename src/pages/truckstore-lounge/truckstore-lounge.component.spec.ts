import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';

import { TruckStoreLoungeComponent } from './truckstore-lounge.component';
import { TranslationService } from '../../services/translation.service';

describe('TruckStoreLoungeComponent', () => {
  let component: TruckStoreLoungeComponent;
  let fixture: ComponentFixture<TruckStoreLoungeComponent>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    const translationSpy = jasmine.createSpyObj('TranslationService', ['translate', 'getLanguage$']);
    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);

    await TestBed.configureTestingModule({
      declarations: [TruckStoreLoungeComponent],
      providers: [
        { provide: TranslationService, useValue: translationSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TruckStoreLoungeComponent);
    component = fixture.componentInstance;
    mockTranslationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
    mockChangeDetectorRef = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;

    // Setup default mocks
    mockTranslationService.translate.and.returnValue('Test Translation');
    mockTranslationService.getLanguage$.and.returnValue(of('tr'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize facilities on ngOnInit', () => {
    component.ngOnInit();
    
    expect(component.facilities).toBeDefined();
    expect(component.facilities.length).toBe(6);
    expect(component.facilities[0].iconKey).toBe('☕');
    expect(component.facilities[0].titleKey).toBe('lounge.facility.restaurant.title');
  });

  it('should initialize pricing plans on ngOnInit', () => {
    component.ngOnInit();
    
    expect(component.pricingPlans).toBeDefined();
    expect(component.pricingPlans.length).toBe(3);
    expect(component.pricingPlans[0].planKey).toBe('lounge.pricing.basic');
    expect(component.pricingPlans[1].planKey).toBe('lounge.pricing.premium');
    expect(component.pricingPlans[2].planKey).toBe('lounge.pricing.vip');
  });

  it('should subscribe to language changes and mark for check', () => {
    component.ngOnInit();
    
    expect(mockTranslationService.getLanguage$).toHaveBeenCalled();
    expect(mockChangeDetectorRef.markForCheck).toHaveBeenCalled();
  });

  it('should return translation from service', () => {
    const testKey = 'test.key';
    const expectedTranslation = 'Test Translation';
    mockTranslationService.translate.and.returnValue(expectedTranslation);
    
    const result = component.getTranslation(testKey);
    
    expect(mockTranslationService.translate).toHaveBeenCalledWith(testKey);
    expect(result).toBe(expectedTranslation);
  });

  it('should complete destroy subject on ngOnDestroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('should have correct facility icons', () => {
    component.ngOnInit();
    
    const expectedIcons = ['☕', '🛏️', '🚿', '📶', '🚗', '⛽'];
    const actualIcons = component.facilities.map(f => f.iconKey);
    
    expect(actualIcons).toEqual(expectedIcons);
  });

  it('should have correct pricing plan structure', () => {
    component.ngOnInit();
    
    const basicPlan = component.pricingPlans[0];
    expect(basicPlan.featuresKey.length).toBe(3);
    
    const premiumPlan = component.pricingPlans[1];
    expect(premiumPlan.featuresKey.length).toBe(4);
    
    const vipPlan = component.pricingPlans[2];
    expect(vipPlan.featuresKey.length).toBe(4);
  });
});
