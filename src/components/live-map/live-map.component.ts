import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';

interface Vehicle {
  id: string;
  name: string;
  driverKey: string;
  lat: number;
  lng: number;
  status: 'active' | 'idle' | 'maintenance';
  speed: number;
  destinationKey: string;
  cargoKey: string;
  lastUpdate: Date;
}

@Component({
  selector: 'app-live-map',
  templateUrl: './live-map.component.html',
  styleUrls: ['./live-map.component.css']
})
export class LiveMapComponent implements OnInit {
  ngOnInit(): void {
    // You can fetch reservations here
  }

  reservations = [
    { id: '001', vehicleType: '', date: '', loading: '', delivery: '', distance: '', owner: '' },
    { id: '002', vehicleType: '', date: '', loading: '', delivery: '', distance: '', owner: '' },
    { id: '003', vehicleType: '', date: '', loading: '', delivery: '', distance: '', owner: '' },
    { id: '004', vehicleType: '', date: '', loading: '', delivery: '', distance: '', owner: '' },
    { id: '005', vehicleType: '', date: '', loading: '', delivery: '', distance: '', owner: '' },
    { id: '006', vehicleType: '', date: '', loading: '', delivery: '', distance: '', owner: '' }
  ];

  pageSize = 3;
  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.reservations.length / this.pageSize);
  }

  get pagedReservations() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.reservations.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}