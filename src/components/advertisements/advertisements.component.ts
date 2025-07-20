import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';

interface Advertisement {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  company: string;
  type: 'banner' | 'square' | 'vertical';
}

@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.css']
})
export class AdvertisementsComponent implements OnInit, OnDestroy {
  bannerAds: Advertisement[] = [];
  sidebarAds: Advertisement[] = [];
  currentBannerIndex = 0;
  private languageSubscription: Subscription = new Subscription();

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.initializeAds();
    this.startBannerRotation();
    
    // Dil değişikliklerini dinle ve reklamları güncelle
    this.languageSubscription = this.translationService.getLanguage$().subscribe(() => {
      this.initializeAds();
    });
  }

  ngOnDestroy() {
    this.languageSubscription.unsubscribe();
  }

  initializeAds() {
    this.bannerAds = [
      {
        id: 1,
        title: this.translationService.translate('ads.banner.mercedes.title'),
        description: this.translationService.translate('ads.banner.mercedes.description'),
        imageUrl: 'https://via.placeholder.com/800x200/2c3e50/ffffff?text=Mercedes-Benz+Actros',
        link: '#',
        company: 'Mercedes-Benz',
        type: 'banner'
      },
      {
        id: 2,
        title: this.translationService.translate('ads.banner.shell.title'),
        description: this.translationService.translate('ads.banner.shell.description'),
        imageUrl: 'https://via.placeholder.com/800x200/e74c3c/ffffff?text=Shell+Fuel',
        link: '#',
        company: 'Shell',
        type: 'banner'
      },
      {
        id: 3,
        title: this.translationService.translate('ads.banner.bridgestone.title'),
        description: this.translationService.translate('ads.banner.bridgestone.description'),
        imageUrl: 'https://via.placeholder.com/800x200/34495e/ffffff?text=Bridgestone+Tires',
        link: '#',
        company: 'Bridgestone',
        type: 'banner'
      }
    ];

    this.sidebarAds = [
      {
        id: 4,
        title: this.translationService.translate('ads.sidebar.gps.title'),
        description: this.translationService.translate('ads.sidebar.gps.description'),
        imageUrl: 'https://via.placeholder.com/300x250/3498db/ffffff?text=GPS+Tracking',
        link: '#',
        company: 'TechTrack',
        type: 'square'
      },
      {
        id: 5,
        title: this.translationService.translate('ads.sidebar.insurance.title'),
        description: this.translationService.translate('ads.sidebar.insurance.description'),
        imageUrl: 'https://via.placeholder.com/300x250/27ae60/ffffff?text=Insurance',
        link: '#',
        company: this.translationService.translate('ads.sidebar.insurance.company'),
        type: 'square'
      },
      {
        id: 6,
        title: this.translationService.translate('ads.sidebar.finance.title'),
        description: this.translationService.translate('ads.sidebar.finance.description'),
        imageUrl: 'https://via.placeholder.com/300x250/9b59b6/ffffff?text=Finance',
        link: '#',
        company: this.translationService.translate('ads.sidebar.finance.company'),
        type: 'square'
      }
    ];
  }

  startBannerRotation() {
    setInterval(() => {
      this.currentBannerIndex = (this.currentBannerIndex + 1) % this.bannerAds.length;
    }, 5000); // 5 saniyede bir değişir
  }

  onAdClick(ad: Advertisement) {
    console.log('Reklam tıklandı:', ad.company);
    // Analytics tracking burada yapılabilir
  }
}
