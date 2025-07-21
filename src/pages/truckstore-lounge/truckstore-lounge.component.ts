import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

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
  styleUrls: ['./truckstore-lounge.component.css']
})
export class TruckStoreLoungeComponent implements OnInit {
  facilities: LoungeFacility[] = [];
  pricingPlans: LoungePricing[] = [];

  constructor(private translationService: TranslationService) { }

  ngOnInit(): void {
    this.initializeFacilities();
    this.initializePricing();
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
