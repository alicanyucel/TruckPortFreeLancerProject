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
        titleKey: 'lounge.facilities.restaurant.title',
        descriptionKey: 'lounge.facilities.restaurant.description'
      },
      {
        iconKey: '🛏️',
        titleKey: 'lounge.facilities.rest.title',
        descriptionKey: 'lounge.facilities.rest.description'
      },
      {
        iconKey: '🚿',
        titleKey: 'lounge.facilities.shower.title',
        descriptionKey: 'lounge.facilities.shower.description'
      },
      {
        iconKey: '📶',
        titleKey: 'lounge.facilities.wifi.title',
        descriptionKey: 'lounge.facilities.wifi.description'
      },
      {
        iconKey: '🚗',
        titleKey: 'lounge.facilities.parking.title',
        descriptionKey: 'lounge.facilities.parking.description'
      },
      {
        iconKey: '⛽',
        titleKey: 'lounge.facilities.fuel.title',
        descriptionKey: 'lounge.facilities.fuel.description'
      }
    ];
  }

  initializePricing() {
    this.pricingPlans = [
      {
        planKey: 'lounge.pricing.basic.plan',
        priceKey: 'lounge.pricing.basic.price',
        featuresKey: [
          'lounge.pricing.basic.feature1',
          'lounge.pricing.basic.feature2',
          'lounge.pricing.basic.feature3'
        ]
      },
      {
        planKey: 'lounge.pricing.premium.plan',
        priceKey: 'lounge.pricing.premium.price',
        featuresKey: [
          'lounge.pricing.premium.feature1',
          'lounge.pricing.premium.feature2',
          'lounge.pricing.premium.feature3',
          'lounge.pricing.premium.feature4'
        ]
      },
      {
        planKey: 'lounge.pricing.vip.plan',
        priceKey: 'lounge.pricing.vip.price',
        featuresKey: [
          'lounge.pricing.vip.feature1',
          'lounge.pricing.vip.feature2',
          'lounge.pricing.vip.feature3',
          'lounge.pricing.vip.feature4',
          'lounge.pricing.vip.feature5'
        ]
      }
    ];
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }
}
