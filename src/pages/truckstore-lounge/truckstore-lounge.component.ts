import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Subject, takeUntil } from 'rxjs';

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
  private destroy$ = new Subject<void>();

  constructor(
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeFacilities();
    this.initializePricing();
    
    // Subscribe to language changes for OnPush
    this.translationService.getLanguage$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
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
}
