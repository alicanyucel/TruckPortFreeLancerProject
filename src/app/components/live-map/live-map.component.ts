import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class LiveMapComponent implements OnInit, OnDestroy {
  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;
  private updateInterval: any;
  private languageSubscription: Subscription = new Subscription();

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.initializeVehicles();
    this.startLocationUpdates();
    
    // Subscribe to language changes for reactive updates
    this.languageSubscription = this.translationService.getLanguage$().subscribe(() => {
      // Trigger change detection for translation updates
    });
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.languageSubscription.unsubscribe();
  }

  initializeVehicles() {
    this.vehicles = [
      {
        id: 'TR-001',
        name: 'Mercedes Actros',
        driverKey: 'vehicles.drivers.ahmet',
        lat: 41.0082,
        lng: 28.9784,
        status: 'active',
        speed: 85,
        destinationKey: 'vehicles.destinations.ankara',
        cargoKey: 'vehicles.cargo.electronics',
        lastUpdate: new Date()
      },
      {
        id: 'TR-002',
        name: 'Volvo FH16',
        driverKey: 'vehicles.drivers.mehmet',
        lat: 39.9334,
        lng: 32.8597,
        status: 'active',
        speed: 70,
        destinationKey: 'vehicles.destinations.izmir',
        cargoKey: 'vehicles.cargo.food',
        lastUpdate: new Date()
      },
      {
        id: 'TR-003',
        name: 'Scania R450',
        driverKey: 'vehicles.drivers.ali',
        lat: 38.4237,
        lng: 27.1428,
        status: 'idle',
        speed: 0,
        destinationKey: 'vehicles.destinations.bursa',
        cargoKey: 'vehicles.cargo.textile',
        lastUpdate: new Date()
      },
      {
        id: 'TR-004',
        name: 'MAN TGX',
        driverKey: 'vehicles.drivers.osman',
        lat: 40.1885,
        lng: 29.0610,
        status: 'active',
        speed: 90,
        destinationKey: 'vehicles.destinations.adana',
        cargoKey: 'vehicles.cargo.construction',
        lastUpdate: new Date()
      },
      {
        id: 'TR-005',
        name: 'DAF XF',
        driverKey: 'vehicles.drivers.hasan',
        lat: 36.8969,
        lng: 30.7133,
        status: 'maintenance',
        speed: 0,
        destinationKey: 'vehicles.destinations.antalya',
        cargoKey: 'vehicles.cargo.empty',
        lastUpdate: new Date()
      }
    ];
  }

  startLocationUpdates() {
    this.updateInterval = setInterval(() => {
      this.vehicles.forEach(vehicle => {
        if (vehicle.status === 'active') {
          // Simulate movement
          const direction = Math.random() * 2 * Math.PI;
          const distance = 0.001; // Small movement
          vehicle.lat += Math.cos(direction) * distance;
          vehicle.lng += Math.sin(direction) * distance;
          vehicle.speed = 60 + Math.random() * 40; // Random speed between 60-100
          vehicle.lastUpdate = new Date();
        }
      });
    }, 3000); // Update every 3 seconds
  }

  selectVehicle(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#27ae60';
      case 'idle': return '#f39c12';
      case 'maintenance': return '#e74c3c';
      default: return '#95a5a6';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return this.translationService.translate('liveMap.status.active');
      case 'idle': return this.translationService.translate('liveMap.status.idle');
      case 'maintenance': return this.translationService.translate('liveMap.status.maintenance');
      default: return this.translationService.translate('liveMap.status.unknown');
    }
  }

  getDriverName(driverKey: string): string {
    return this.translationService.translate(driverKey);
  }

  getDestination(destinationKey: string): string {
    return this.translationService.translate(destinationKey);
  }

  getCargo(cargoKey: string): string {
    return this.translationService.translate(cargoKey);
  }
}
