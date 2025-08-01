import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-truckstore',
  templateUrl: './truckstore.component.html',
  styleUrls: ['./truckstore.component.css']
})
export class TruckStoreComponent implements OnInit {
  // Modal için seçili ilan ve ilan veren
  selectedTruck: any = null;
  showModal: boolean = false;
  ilanVeren = {
    name: 'Ali Can Yücel',
    phone: '+90 555 123 45 67',
    email: 'alicanyucel@example.com',
    closeModal: () => {
      this.showModal = false;
      this.selectedTruck = null;
    }
  };
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;

  // Tüm araçlar
  trucks = [
    {
      image: 'https://tso-assets-prd.s3.amazonaws.com/Images/Keyvisuals/Carousel/Redesign/Slider_Frontal_TR_962x555.jpg',
      title: 'Mercedes-Benz Actros 1845',
      brand: 'Mercedes-Benz',
      model: 'Actros 1845',
      year: 2021,
      km: 120000,
      price: 2450000,
      user: { name: 'Ali Can Yücel', phone: '+90 532 111 22 33', email: 'ahmet.yilmaz@example.com' }
    },
    {
      image: 'https://tso-assets-prd.s3.amazonaws.com/Images/Home/Teaser/TSO_Tile-Teaser_Range-White.jpg',
      title: 'MAN TGX 18.500',
      brand: 'MAN',
      model: 'TGX 18.500',
      year: 2020,
      km: 185000,
      price: 1980000,
      user: { name: 'Mehmet Kaya', phone: '+90 533 222 33 44', email: 'mehmet.kaya@example.com' }
    },
    {
      image: 'https://tso-assets-prd.s3.amazonaws.com/Images/Home/Services/IMG_Home_New-Warranty_310x310.jpg',
      title: 'Volvo FH 460',
      brand: 'Volvo',
      model: 'FH 460',
      year: 2019,
      km: 220000,
      price: 1750000,
      user: { name: 'Ayşe Demir', phone: '+90 534 333 44 55', email: 'ayse.demir@example.com' }
    },
    {
      image: 'https://images.pexels.com/photos/1936675/pexels-photo-1936675.jpeg',
      title: 'Scania R450',
      brand: 'Scania',
      model: 'R450',
      year: 2022,
      km: 90000,
      price: 2650000,
      user: { name: 'Fatma Koç', phone: '+90 535 444 55 66', email: 'fatma.koc@example.com' }
    },
    {
      image: 'https://images.pexels.com/photos/238921/pexels-photo-238921.jpeg',
      title: 'DAF XF 480',
      brand: 'DAF',
      model: 'XF 480',
      year: 2021,
      km: 110000,
      price: 2550000,
      user: { name: 'Emre Şahin', phone: '+90 536 555 66 77', email: 'emre.sahin@example.com' }
    },
    {
      image: 'https://images.pexels.com/photos/1936676/pexels-photo-1936676.jpeg',
      title: 'Iveco Stralis 460',
      brand: 'Iveco',
      model: 'Stralis 460',
      year: 2020,
      km: 150000,
      price: 2100000,
      user: { name: 'Kemal Öz', phone: '+90 537 123 45 67', email: 'kemal.oz@example.com' }
    },
    {
      image: 'https://images.pexels.com/photos/238921/pexels-photo-238921.jpeg',
      title: 'Renault T 480',
      brand: 'Renault',
      model: 'T 480',
      year: 2019,
      km: 200000,
      price: 1800000,
      user: { name: 'Selin Yıldırım', phone: '+90 538 234 56 78', email: 'selin.yildirim@example.com' }
    },
    {
      image: 'https://images.pexels.com/photos/1936675/pexels-photo-1936675.jpeg',
      title: 'Ford F-MAX',
      brand: 'Ford',
      model: 'F-MAX',
      year: 2022,
      km: 80000,
      price: 2700000,
      user: { name: 'Barış Demir', phone: '+90 539 345 67 89', email: 'baris.demir@example.com' }
    },
    {
      image: 'https://images.pexels.com/photos/1936676/pexels-photo-1936676.jpeg',
      title: 'Mercedes-Benz Arocs 1842',
      brand: 'Mercedes-Benz',
      model: 'Arocs 1842',
      year: 2021,
      km: 100000,
      price: 2500000,
      user: { name: 'Gülşah Akın', phone: '+90 540 456 78 90', email: 'gulsah.akin@example.com' }
    },
    {
      image: 'https://images.pexels.com/photos/238921/pexels-photo-238921.jpeg',
      title: 'MAN TGS 18.440',
      brand: 'MAN',
      model: 'TGS 18.440',
      year: 2020,
      km: 170000,
      price: 1950000,
      user: { name: 'Burak Güneş', phone: '+90 537 777 88 99', email: 'burak.gunes@example.com' }
    },
    {
      image: 'https://images.pexels.com/photos/1936675/pexels-photo-1936675.jpeg',
      title: 'Volvo FM 500',
      brand: 'Volvo',
      model: 'FM 500',
      year: 2019,
      km: 210000,
      price: 1780000,
      user: { name: 'Zeynep Arslan', phone: '+90 538 888 99 00', email: 'zeynep.arslan@example.com' }
    },
    {
      image: 'https://images.pexels.com/photos/1936676/pexels-photo-1936676.jpeg',
      title: 'Scania S500',
      brand: 'Scania',
      model: 'S500',
      year: 2022,
      km: 95000,
      price: 2750000,
      user: { name: 'Murat Yıldız', phone: '+90 539 999 00 11', email: 'murat.yildiz@example.com' }
    },
    {
      image: 'https://images.pexels.com/photos/238921/pexels-photo-238921.jpeg',
      title: 'DAF CF 450',
      brand: 'DAF',
      model: 'CF 450',
      year: 2021,
      km: 120000,
      price: 2480000,
      user: { name: 'Elif Aksoy', phone: '+90 540 111 22 33', email: 'elif.aksoy@example.com' }
    },
    {
      image: 'https://images.pexels.com/photos/1936675/pexels-photo-1936675.jpeg',
      title: 'Iveco S-Way 480',
      brand: 'Iveco',
      model: 'S-Way 480',
      year: 2020,
      km: 140000,
      price: 2150000,
      user: { name: 'Gökhan Polat', phone: '+90 541 222 33 44', email: 'gokhan.polat@example.com' }
    },
    {
      image: 'https://images.pexels.com/photos/1936676/pexels-photo-1936676.jpeg',
      title: 'Renault C 520',
      brand: 'Renault',
      model: 'C 520',
      year: 2019,
      km: 230000,
      price: 1820000,
      user: { name: 'Deniz Kılıç', phone: '+90 542 333 44 55', email: 'deniz.kilic@example.com' }
    },
    {
      image: 'https://images.pexels.com/photos/238921/pexels-photo-238921.jpeg',
      title: 'Ford Cargo 1848T',
      brand: 'Ford',
      model: 'Cargo 1848T',
      year: 2022,
      km: 85000,
      price: 2680000,
      user: { name: 'Seda Uçar', phone: '+90 543 444 55 66', email: 'seda.ucar@example.com' }
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

  openModal(truck: any) {
    this.selectedTruck = truck;
    this.showModal = true;
  }

  filtrele() {
    const filtered = this.trucks.filter(truck => {
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
    this.currentPage = 1;
    this.filtreliTrucks = filtered;
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

  get pagedTrucks() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filtreliTrucks.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filtreliTrucks.length / this.itemsPerPage) || 1;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

}
