import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FilterPanelComponent } from '../filter-panel/filter-panel.component';

@Component({
  standalone: true,
  selector: 'app-truck-list',
  imports: [NgForOf, NgIf, FilterPanelComponent],
  templateUrl: './truck-list.component.html',
  styleUrls: ['./truck-list.component.css']
})
export class TruckListComponent {
  trucks = Array.from({ length: 18 }, (_, i) => ({
    title: `Mercedes-Benz Trucks eActros 300 L nRA 4x2 #${i+1}`,
    description: 'Otomobil transporteri',
    details: `7/2025, ${(i+1)*1000} km, Euro 6`,
    price: 482000 + i * 10000,
    image: 'assets/truck.png'
  }));

  // Additional fake entries for testing and layout
  // (kept in the component for a quick demo; move to a service later if needed)
  ngOnInit() {
    // push some more sample trucks if list is short
    if (this.trucks.length < 8) {
      const extras = [
        {
          title: 'Volvo FH16 750 8x4',
          description: 'Ağır yük taşıyıcı',
          details: '3/2024, 12.300 km, Euro 6',
          price: 725000,
          image: 'assets/truck.png'
        },
        {
          title: 'Scania R450 6x2',
          description: 'Çekici',
          details: '9/2022, 45.120 km, Euro 6',
          price: 420500,
          image: 'assets/truck.png'
        },
        {
          title: 'DAF XF 530 4x2',
          description: 'Uzun yol çekicisi',
          details: '5/2021, 210.000 km, Euro 5',
          price: 265000,
          image: 'assets/truck.png'
        },
        {
          title: 'MAN TGX 18.500 4x2',
          description: 'Dağıtım kamyonu',
          details: '1/2025, 9.800 km, Euro 6',
          price: 389000,
          image: 'assets/truck.png'
        },
        {
          title: 'Iveco Stralis 460 6x2',
          description: 'Platform transporteri',
          details: '12/2023, 67.500 km, Euro 6',
          price: 312000,
          image: 'assets/truck.png'
        },
        {
          title: 'Renault T 520 4x2',
          description: 'Otomobil taşıyıcı',
          details: '8/2020, 180.400 km, Euro 6',
          price: 238900,
          image: 'assets/truck.png'
        }
      ];
      this.trucks = this.trucks.concat(extras);
    }
  }

  filteredTrucks: any[] = [];

  // Pagination
  pageSize = 9;
  currentPage = 1;

  get pagedTrucks() {
    const list = this.filteredTrucks.length ? this.filteredTrucks : this.trucks;
    const start = (this.currentPage - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  get totalPages() {
    const list = this.filteredTrucks.length ? this.filteredTrucks : this.trucks;
    return Math.ceil(list.length / this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // apply filters emitted from the standalone filter panel
  applyFilters(f: any) {
    // simple filtering logic for demo
    this.filteredTrucks = this.trucks.filter(t => {
      const matchesText = f.searchText ? (t.title + ' ' + t.description).toLowerCase().includes(f.searchText.toLowerCase()) : true;
      // parse year from details if present (format like '7/2025')
      const yearMatch = (t.details || '').match(/\/(\d{4})/);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : 2025;
      const withinYear = year >= f.yearMin && year <= f.yearMax;
      const withinPrice = t.price >= f.priceMin && t.price <= f.priceMax;
      return matchesText && withinYear && withinPrice;
    });
    this.currentPage = 1;
  }
}
