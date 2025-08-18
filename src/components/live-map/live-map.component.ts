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
    throw new Error('Method not implemented.');
  }

  reservations = [
    { id: '001', vehicleType: '', date: '', loading: '', delivery: '', distance: '', owner: '' },
    { id: '002', vehicleType: '', date: '', loading: '', delivery: '', distance: '', owner: '' },
    { id: '003', vehicleType: '', date: '', loading: '', delivery: '', distance: '', owner: '' }
  ];

}