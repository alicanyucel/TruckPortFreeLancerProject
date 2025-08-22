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
    { id: 'RES-001', vehicleType: 'Mercedes Actros', date: '2025-08-20 09:30', loading: 'İstanbul Avcılar', delivery: 'Ankara Etimesgut', distance: '450 km', owner: 'Ahmet Y.', image: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg', ownerImage: 'https://randomuser.me/api/portraits/men/11.jpg' },
    { id: 'RES-002', vehicleType: 'Volvo FH16', date: '2025-08-21 14:00', loading: 'İzmir Gaziemir', delivery: 'Bursa Nilüfer', distance: '170 km', owner: 'Mehmet K.', image: 'https://images.pexels.com/photos/248614/pexels-photo-248614.jpeg', ownerImage: 'https://randomuser.me/api/portraits/men/12.jpg' },
    { id: 'RES-003', vehicleType: 'Scania R450', date: '2025-08-22 08:00', loading: 'İzmit', delivery: 'Gebze', distance: '45 km', owner: 'Ali V.', image: 'https://images.pexels.com/photos/163119/sport-car-vehicle-road-163119.jpeg', ownerImage: 'https://randomuser.me/api/portraits/men/13.jpg' },
    { id: 'RES-004', vehicleType: 'MAN TGX', date: '2025-08-23 12:15', loading: 'Adana', delivery: 'Mersin', distance: '90 km', owner: 'Osman Ç.', image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg', ownerImage: 'https://randomuser.me/api/portraits/men/14.jpg' },
    { id: 'RES-005', vehicleType: 'DAF XF', date: '2025-08-24 07:45', loading: 'Antalya', delivery: 'Isparta', distance: '200 km', owner: 'Hasan B.', image: 'https://images.pexels.com/photos/1936675/pexels-photo-1936675.jpeg', ownerImage: 'https://randomuser.me/api/portraits/men/15.jpg' },
    { id: 'RES-006', vehicleType: 'Iveco Stralis', date: '2025-08-25 16:30', loading: 'Samsun', delivery: 'Trabzon', distance: '450 km', owner: 'Kemal Ö.' , image: 'https://images.pexels.com/photos/1936676/pexels-photo-1936676.jpeg', ownerImage: 'https://randomuser.me/api/portraits/men/16.jpg' }
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