import { Component, OnInit, OnDestroy } from '@angular/core';

interface Vehicle {
  id: string;
  name: string;
  driver: string;
  lat: number;
  lng: number;
  status: 'active' | 'idle' | 'maintenance';
  speed: number;
  destination: string;
  cargo: string;
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

  ngOnInit() {
    this.initializeVehicles();
    this.startLocationUpdates();
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  initializeVehicles() {
    this.vehicles = [
      {
        id: 'TR-001',
        name: 'Mercedes Actros',
        driver: 'Ahmet Yılmaz',
        lat: 41.0082,
        lng: 28.9784,
        status: 'active',
        speed: 85,
        destination: 'Ankara',
        cargo: 'Elektronik Eşya',
        lastUpdate: new Date()
      },
      {
        id: 'TR-002',
        name: 'Volvo FH16',
        driver: 'Mehmet Kaya',
        lat: 39.9334,
        lng: 32.8597,
        status: 'active',
        speed: 70,
        destination: 'İzmir',
        cargo: 'Gıda Ürünleri',
        lastUpdate: new Date()
      },
      {
        id: 'TR-003',
        name: 'Scania R450',
        driver: 'Ali Demir',
        lat: 38.4237,
        lng: 27.1428,
        status: 'idle',
        speed: 0,
        destination: 'Bursa',
        cargo: 'Tekstil Ürünleri',
        lastUpdate: new Date()
      },
      {
        id: 'TR-004',
        name: 'MAN TGX',
        driver: 'Osman Şahin',
        lat: 40.1885,
        lng: 29.0610,
        status: 'active',
        speed: 90,
        destination: 'Adana',
        cargo: 'İnşaat Malzemesi',
        lastUpdate: new Date()
      },
      {
        id: 'TR-005',
        name: 'DAF XF',
        driver: 'Hasan Özkan',
        lat: 36.8969,
        lng: 30.7133,
        status: 'maintenance',
        speed: 0,
        destination: 'Antalya',
        cargo: 'Boş',
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
      case 'active': return 'Aktif';
      case 'idle': return 'Beklemede';
      case 'maintenance': return 'Bakımda';
      default: return 'Bilinmiyor';
    }
  }
}
