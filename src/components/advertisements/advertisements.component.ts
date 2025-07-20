import { Component, OnInit } from '@angular/core';

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
export class AdvertisementsComponent implements OnInit {
  bannerAds: Advertisement[] = [];
  sidebarAds: Advertisement[] = [];
  currentBannerIndex = 0;

  ngOnInit() {
    this.initializeAds();
    this.startBannerRotation();
  }

  initializeAds() {
    this.bannerAds = [
      {
        id: 1,
        title: 'Mercedes-Benz Kamyonlar',
        description: 'Yeni Actros serisi ile güçlü ve ekonomik taşımacılık',
        imageUrl: 'https://via.placeholder.com/800x200/2c3e50/ffffff?text=Mercedes-Benz+Actros',
        link: '#',
        company: 'Mercedes-Benz',
        type: 'banner'
      },
      {
        id: 2,
        title: 'Shell Yakıtları',
        description: 'Profesyonel sürücüler için özel yakıt çözümleri',
        imageUrl: 'https://via.placeholder.com/800x200/e74c3c/ffffff?text=Shell+Yakit',
        link: '#',
        company: 'Shell',
        type: 'banner'
      },
      {
        id: 3,
        title: 'Bridgestone Lastikleri',
        description: 'Ağır vasıta için dayanıklı ve güvenli lastikler',
        imageUrl: 'https://via.placeholder.com/800x200/34495e/ffffff?text=Bridgestone+Lastik',
        link: '#',
        company: 'Bridgestone',
        type: 'banner'
      }
    ];

    this.sidebarAds = [
      {
        id: 4,
        title: 'GPS Takip Sistemi',
        description: 'Araçlarınızı 7/24 takip edin',
        imageUrl: 'https://via.placeholder.com/300x250/3498db/ffffff?text=GPS+Takip',
        link: '#',
        company: 'TechTrack',
        type: 'square'
      },
      {
        id: 5,
        title: 'Lojistik Sigortası',
        description: 'Yükünüzü güvence altına alın',
        imageUrl: 'https://via.placeholder.com/300x250/27ae60/ffffff?text=Sigorta',
        link: '#',
        company: 'GüvenSigorta',
        type: 'square'
      },
      {
        id: 6,
        title: 'Kamyon Finansmanı',
        description: 'Uygun faizlerle araç kredisi',
        imageUrl: 'https://via.placeholder.com/300x250/9b59b6/ffffff?text=Finansman',
        link: '#',
        company: 'FinansBank',
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
