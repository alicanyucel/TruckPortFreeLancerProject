import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPanelComponent } from '../filter-panel/filter-panel.component';

@Component({
  standalone: true,
  selector: 'app-truck-list',
  imports: [CommonModule, FilterPanelComponent],
  templateUrl: './truck-list.component.html',
  styleUrls: ['./truck-list.component.css']
})
export class TruckListComponent {
  trucks = [
    {
      title: 'Mercedes-Benz Trucks eActros 300 L nRA 4x2',
      description: 'Otomobil transporteri',
      details: '7/2025, 2.924 km, Euro 6',
      price: 482000,
      image: 'assets/truck1.jpg'
    },
    {
      title: 'Mercedes-Benz Trucks eActros 300 L 6x2',
      description: 'Çöp toplama aracı',
      details: '11/2023, 8.770 km, Euro 6',
      price: 303789,
      image: 'assets/truck2.jpg'
    }
    // Diğer araçlar...
  ];

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
  }
}
