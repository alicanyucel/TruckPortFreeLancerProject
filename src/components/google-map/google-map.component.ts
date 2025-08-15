import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';
import { environment } from '../../environments/environment';
import { FirebaseService } from '../../services/firebase.service';
import { Subscription } from 'rxjs';

declare const google: any;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @Input() apiKey: string = environment.firebase?.apiKey || '';

  map: any = null;
  markers: any[] = [];
  private subs: Subscription[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngAfterViewInit(): void {
    this.loadScript().then(() => {
      this.initMap();
      this.bindFirebaseMarkers();
    }).catch(err => {
      console.error('Google Maps script load failed', err);
    });
  }

  ngOnDestroy(): void {
    try {
      this.markers.forEach(m => m.setMap(null));
      this.map = null;
      this.subs.forEach(s => s.unsubscribe());
    } catch (e) {
      // ignore
    }
  }

  private bindFirebaseMarkers() {
    try {
      const s = this.firebaseService.getBookingTrips().subscribe(trips => {
        // clear old markers
        this.markers.forEach(m => m.setMap(null));
        this.markers = [];

        (trips || []).forEach((t: any) => {
          const coords = this.extractCoordinates(t);
          if (coords) {
            const marker = new google.maps.Marker({ position: coords, map: this.map, title: t.title || t.name || 'Rezervasyon' });
            this.markers.push(marker);
          }
        });
      }, err => console.error('Firebase trips error', err));
      this.subs.push(s);
    } catch (e) {
      console.warn('Could not bind firebase markers', e);
    }
  }

  private extractCoordinates(t: any): { lat: number, lng: number } | null {
    // try known fields
    if (!t) return null;
    const lat = t.lat || t.latitude || (t.location && (t.location.lat || t.location.latitude));
    const lng = t.lng || t.longitude || (t.location && (t.location.lng || t.location.longitude));
    if (typeof lat === 'number' && typeof lng === 'number') return { lat, lng };
    // sometimes values are strings
    const nlat = Number(lat);
    const nlng = Number(lng);
    if (!isNaN(nlat) && !isNaN(nlng)) return { lat: nlat, lng: nlng };
    return null;
  }

  private loadScript(): Promise<void> {
    if ((window as any).google && (window as any).google.maps) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const id = 'google-maps-script';
      if (document.getElementById(id)) {
        const check = () => {
          if ((window as any).google && (window as any).google.maps) {
            resolve();
          } else {
            setTimeout(check, 50);
          }
        };
        check();
        return;
      }

      const script = document.createElement('script');
      script.id = id;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }

  private initMap(): void {
    if (!this.mapContainer) return;
    const el = this.mapContainer.nativeElement as HTMLElement;
    const defaultCenter = { lat: 39.0, lng: 35.0 };

    this.map = new google.maps.Map(el, {
      center: defaultCenter,
      zoom: 6,
      gestureHandling: 'greedy'
    });

    const marker = new google.maps.Marker({ position: defaultCenter, map: this.map, title: 'Merkez' });
    this.markers.push(marker);

    if (navigator && (navigator as any).geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.map.setCenter(p);
        this.map.setZoom(12);
        const userMarker = new google.maps.Marker({ position: p, map: this.map, title: 'Sizin Konumunuz' });
        this.markers.push(userMarker);
      }, () => {
        // ignore
      });
    }
  }
}
