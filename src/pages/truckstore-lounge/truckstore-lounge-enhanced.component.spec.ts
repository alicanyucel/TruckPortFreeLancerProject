import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TruckStoreLoungeComponent } from './truckstore-lounge.component';
import { TranslationService } from '../../services/translation.service';
import { StateManagementService } from '../../services/state-management.service';
import { PerformanceMonitorService } from '../../services/performance-monitor.service';
import { LoungeReservationService } from '../../services/lounge-reservation.service';
import { AccessibilityService } from '../../services/accessibility.service';

describe('TruckStoreLoungeComponent - Enhanced Features', () => {
  let component: TruckStoreLoungeComponent;
  let fixture: ComponentFixture<TruckStoreLoungeComponent>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;
  let mockStateService: jasmine.SpyObj<StateManagementService>;
  let mockPerformanceService: jasmine.SpyObj<PerformanceMonitorService>;
  let mockReservationService: jasmine.SpyObj<LoungeReservationService>;
  let mockAccessibilityService: jasmine.SpyObj<AccessibilityService>;

  beforeEach(async () => {
    const translationSpy = jasmine.createSpyObj('TranslationService', ['translate', 'getLanguage$']);
    const stateSpy = jasmine.createSpyObj('StateManagementService', ['updateLoungeState']);
    const performanceSpy = jasmine.createSpyObj('PerformanceMonitorService', 
      ['markRenderStart', 'markRenderEnd', 'incrementComponentCount', 'decrementComponentCount']);
    const reservationSpy = jasmine.createSpyObj('LoungeReservationService', 
      ['createReservation', 'getPricing'], { reservations$: of([]) });
    const accessibilitySpy = jasmine.createSpyObj('AccessibilityService', ['announceToScreenReader']);

    await TestBed.configureTestingModule({
      declarations: [TruckStoreLoungeComponent],
      providers: [
        { provide: TranslationService, useValue: translationSpy },
        { provide: StateManagementService, useValue: stateSpy },
        { provide: PerformanceMonitorService, useValue: performanceSpy },
        { provide: LoungeReservationService, useValue: reservationSpy },
        { provide: AccessibilityService, useValue: accessibilitySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TruckStoreLoungeComponent);
    component = fixture.componentInstance;
    mockTranslationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
    mockStateService = TestBed.inject(StateManagementService) as jasmine.SpyObj<StateManagementService>;
    mockPerformanceService = TestBed.inject(PerformanceMonitorService) as jasmine.SpyObj<PerformanceMonitorService>;
    mockReservationService = TestBed.inject(LoungeReservationService) as jasmine.SpyObj<LoungeReservationService>;
    mockAccessibilityService = TestBed.inject(AccessibilityService) as jasmine.SpyObj<AccessibilityService>;

    mockTranslationService.translate.and.returnValue('Test Translation');
    mockTranslationService.getLanguage$.and.returnValue(of('tr'));
    mockPerformanceService.markRenderStart.and.returnValue(123);
  });

  it('should monitor performance on component lifecycle', () => {
    component.ngOnInit();
    
    expect(mockPerformanceService.markRenderStart).toHaveBeenCalled();
    expect(mockPerformanceService.incrementComponentCount).toHaveBeenCalled();
    
    component.ngOnDestroy();
    expect(mockPerformanceService.decrementComponentCount).toHaveBeenCalled();
  });

  it('should handle plan selection with state management', () => {
    const planType = 'premium';
    
    component.selectPlan(planType);
    
    expect(component.selectedPlan).toBe(planType);
    expect(mockStateService.updateLoungeState).toHaveBeenCalledWith({ selectedPlan: planType });
    expect(mockAccessibilityService.announceToScreenReader).toHaveBeenCalled();
  });

  it('should create reservation successfully', async () => {
    const planType = 'premium';
    const mockReservation = { 
      id: 'res_123', 
      userId: 'user_123',
      planType: 'premium' as const,
      startDate: new Date(),
      endDate: new Date(),
      status: 'confirmed' as const,
      totalPrice: 100,
      facilities: ['restaurant', 'wifi'],
      createdAt: new Date()
    };
    
    mockReservationService.getPricing.and.returnValue(of(100));
    mockReservationService.createReservation.and.returnValue(of(mockReservation));
    
    await component.makeReservation(planType);
    
    expect(mockReservationService.createReservation).toHaveBeenCalled();
    expect(mockAccessibilityService.announceToScreenReader).toHaveBeenCalledWith('Rezervasyon başarıyla oluşturuldu.');
  });

  it('should handle reservation errors gracefully', async () => {
    const planType = 'basic';
    
    mockReservationService.getPricing.and.returnValue(throwError('API Error'));
    
    await component.makeReservation(planType);
    
    expect(mockAccessibilityService.announceToScreenReader).toHaveBeenCalledWith('Rezervasyon oluşturulurken bir hata oluştu.');
  });

  it('should return correct facilities for each plan type', () => {
    const basicFacilities = component['getSelectedFacilities']('basic');
    const premiumFacilities = component['getSelectedFacilities']('premium');
    const vipFacilities = component['getSelectedFacilities']('vip');
    
    expect(basicFacilities).toEqual(['restaurant', 'wifi']);
    expect(premiumFacilities).toEqual(['restaurant', 'wifi', 'shower', 'parking']);
    expect(vipFacilities).toEqual(['restaurant', 'wifi', 'shower', 'parking', 'rest', 'laundry']);
  });
});
