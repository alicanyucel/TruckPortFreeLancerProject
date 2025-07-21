import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { StateManagementService } from '../../services/state-management.service';
import { PerformanceMonitorService } from '../../services/performance-monitor.service';
import { LoungeReservationService, Reservation } from '../../services/lounge-reservation.service';
import { AccessibilityService } from '../../services/accessibility.service';
import { Subject, takeUntil, Observable } from 'rxjs';

interface LoungeFacility {
  iconKey: string;
  titleKey: string;
  descriptionKey: string;
}

interface LoungePricing {
  planKey: string;
  priceKey: string;
  featuresKey: string[];
}

@Component({
  selector: 'app-truckstore-lounge',
  templateUrl: './truckstore-lounge.component.html',
  styleUrls: ['./truckstore-lounge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TruckStoreLoungeComponent implements OnInit, OnDestroy {
  facilities: LoungeFacility[] = [];
  pricingPlans: LoungePricing[] = [];
  reservations$: Observable<Reservation[]>;
  selectedPlan: string | null = null;
  private destroy$ = new Subject<void>();
  private renderStartTime: number = 0;

  constructor(
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef,
    private stateService: StateManagementService,
    private performanceService: PerformanceMonitorService,
    private reservationService: LoungeReservationService,
    private accessibilityService: AccessibilityService
  ) { 
    this.reservations$ = this.reservationService.reservations$;
  }

  ngOnInit(): void {
    // Performance monitoring
    this.renderStartTime = this.performanceService.markRenderStart();
    this.performanceService.incrementComponentCount();
    
    this.initializeFacilities();
    this.initializePricing();
    
    // Subscribe to language changes for OnPush
    this.translationService.getLanguage$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
      
    // Performance monitoring - mark render end
    setTimeout(() => {
      this.performanceService.markRenderEnd(this.renderStartTime);
    }, 0);
  }

  ngOnDestroy(): void {
    this.performanceService.decrementComponentCount();
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeFacilities() {
    this.facilities = [
      {
        iconKey: '☕',
        titleKey: 'lounge.facility.restaurant.title',
        descriptionKey: 'lounge.facility.restaurant.description'
      },
      {
        iconKey: '🛏️',
        titleKey: 'lounge.facility.rest.title',
        descriptionKey: 'lounge.facility.rest.description'
      },
      {
        iconKey: '🚿',
        titleKey: 'lounge.facility.shower.title',
        descriptionKey: 'lounge.facility.shower.description'
      },
      {
        iconKey: '📶',
        titleKey: 'lounge.facility.wifi.title',
        descriptionKey: 'lounge.facility.wifi.description'
      },
      {
        iconKey: '🚗',
        titleKey: 'lounge.facility.parking.title',
        descriptionKey: 'lounge.facility.parking.description'
      },
      {
        iconKey: '⛽',
        titleKey: 'lounge.facility.fuel.title',
        descriptionKey: 'lounge.facility.fuel.description'
      }
    ];
  }

  initializePricing() {
    this.pricingPlans = [
      {
        planKey: 'lounge.pricing.basic',
        priceKey: 'lounge.pricing.basic.price',
        featuresKey: [
          'lounge.pricing.basic.feature1',
          'lounge.pricing.basic.feature2',
          'lounge.pricing.basic.feature3'
        ]
      },
      {
        planKey: 'lounge.pricing.premium',
        priceKey: 'lounge.pricing.premium.price',
        featuresKey: [
          'lounge.pricing.premium.feature1',
          'lounge.pricing.premium.feature2',
          'lounge.pricing.premium.feature3',
          'lounge.pricing.premium.feature4'
        ]
      },
      {
        planKey: 'lounge.pricing.vip',
        priceKey: 'lounge.pricing.vip.price',
        featuresKey: [
          'lounge.pricing.vip.feature1',
          'lounge.pricing.vip.feature2',
          'lounge.pricing.vip.feature3',
          'lounge.pricing.vip.feature4'
        ]
      }
    ];
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }

  selectPlan(planType: string): void {
    this.selectedPlan = planType;
    this.stateService.updateLoungeState({ selectedPlan: planType });
    this.accessibilityService.announceToScreenReader(
      `${planType} planı seçildi. Rezervasyon için devam edin.`
    );
  }

  async makeReservation(planType: 'basic' | 'premium' | 'vip'): Promise<void> {
    try {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // 1 day
      
      const price = await this.reservationService.getPricing(planType, 1).toPromise();
      
      const reservation = await this.reservationService.createReservation({
        userId: 'current_user', // Get from auth service
        planType,
        startDate,
        endDate,
        totalPrice: price || 0,
        facilities: this.getSelectedFacilities(planType)
      }).toPromise();

      this.accessibilityService.announceToScreenReader('Rezervasyon başarıyla oluşturuldu.');
      console.log('Rezervasyon oluşturuldu:', reservation);
      
    } catch (error) {
      this.accessibilityService.announceToScreenReader('Rezervasyon oluşturulurken bir hata oluştu.');
      console.error('Rezervasyon hatası:', error);
    }
  }

  private getSelectedFacilities(planType: string): string[] {
    const facilityMap = {
      basic: ['restaurant', 'wifi'],
      premium: ['restaurant', 'wifi', 'shower', 'parking'],
      vip: ['restaurant', 'wifi', 'shower', 'parking', 'rest', 'laundry']
    };
    return facilityMap[planType as keyof typeof facilityMap] || [];
  }
}
