import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-truckstore',
  templateUrl: './truckstore.component.html',
  styleUrls: ['./truckstore.component.css']
})
export class TruckStoreComponent implements OnInit {
  // Tüm araçlar
  trucks = [
    {
      image: 'https://tso-assets-prd.s3.amazonaws.com/Images/Keyvisuals/Carousel/Redesign/Slider_Frontal_TR_962x555.jpg',
      title: 'Mercedes-Benz Actros 1845',
      brand: 'Mercedes-Benz',
      model: 'Actros 1845',
      year: 2021,
      km: 120000,
      price: 2450000
    },
    {
      image: 'https://tso-assets-prd.s3.amazonaws.com/Images/Home/Teaser/TSO_Tile-Teaser_Range-White.jpg',
      title: 'MAN TGX 18.500',
      brand: 'MAN',
      model: 'TGX 18.500',
      year: 2020,
      km: 185000,
      price: 1980000
    },
    {
      image: 'https://tso-assets-prd.s3.amazonaws.com/Images/Home/Services/IMG_Home_New-Warranty_310x310.jpg',
      title: 'Volvo FH 460',
      brand: 'Volvo',
      model: 'FH 460',
      year: 2019,
      km: 220000,
      price: 1750000
    }
  ];


  // Filtre alanları
  filterBrand: string = '';
  filterModel: string = '';
  filterPriceMin: number | null = null;
  filterPriceMax: number | null = null;
  filterYearMin: number | null = null;
  filterYearMax: number | null = null;
  filterKmMax: number | null = null;

  // Filtrelenmiş araçlar
  filtreliTrucks = [...this.trucks];

  constructor(private translationService: TranslationService) { }

  ngOnInit(): void {
    this.filtreliTrucks = [...this.trucks];
    console.log('Ali Can Yücel - Her hakkı saklıdır.');
  }

  filtrele() {
    this.filtreliTrucks = this.trucks.filter(truck => {
      const brandMatch = !this.filterBrand || this.filterBrand === 'Tümü' || truck.brand === this.filterBrand;
      const modelMatch = !this.filterModel || truck.model.toLowerCase().includes(this.filterModel.toLowerCase());
      // Fiyatı string olarak alıp tüm rakamları birleştirerek number'a çeviren fonksiyon
      const extractNumber = (val: any) => {
        if (val === null || val === undefined || String(val).trim() === '') return null;
        const digits = String(val).replace(/[^0-9]/g, '');
        return digits ? Number(digits) : null;
      };
      const priceMin = extractNumber(this.filterPriceMin);
      const priceMax = extractNumber(this.filterPriceMax);
      const yearMin = extractNumber(this.filterYearMin);
      const yearMax = extractNumber(this.filterYearMax);
      const kmMax = extractNumber(this.filterKmMax);
      const priceMinMatch = priceMin == null || truck.price >= priceMin;
      const priceMaxMatch = priceMax == null || truck.price <= priceMax;
      const yearMinMatch = yearMin == null || truck.year >= yearMin;
      const yearMaxMatch = yearMax == null || truck.year <= yearMax;
      const kmMatch = kmMax == null || truck.km <= kmMax;
      return brandMatch && modelMatch && priceMinMatch && priceMaxMatch && yearMinMatch && yearMaxMatch && kmMatch;
    });
  }

  temizleFiltre() {
    this.filterBrand = '';
    this.filterModel = '';
    this.filterPriceMin = null;
    this.filterPriceMax = null;
    this.filterYearMin = null;
    this.filterYearMax = null;
    this.filterKmMax = null;
    this.filtrele();
  }

}
