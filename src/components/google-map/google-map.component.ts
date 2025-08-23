import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from '../../environments/environment';
import { FirebaseService } from '../../services/firebase.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from "../../app/pipes/translate.pipe";

declare const google: any;
//
@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements AfterViewInit, OnDestroy, OnChanges {
  // Toast yönetimi
  toasts: Array<{ id: number; message: string; type?: 'success' | 'info' | 'error' }> = [];
  private toastSeq = 1;

  private addToast(message: string, type: 'success' | 'info' | 'error' = 'info', timeout = 3000) {
    const id = this.toastSeq++;
    const t = { id, message, type };
    this.toasts.push(t);
    if (timeout > 0) {
      setTimeout(() => this.removeToast(id), timeout);
    }
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(x => x.id !== id);
  }

  // Evden Eve Taşımacılık butonu tıklandığında çalışacak fonksiyon
  onHomeMove() {
    this.addToast('Evden Eve Taşımacılık talebiniz alındı. En kısa sürede sizinle iletişime geçilecektir.', 'success');
  }

  // Nakliye butonu tıklandığında çalışacak fonksiyon
  onTransport() {
    this.addToast('Nakliye talebiniz alındı. Fiyat teklifi ve araç bilgisi iletilecektir.', 'info');
  }

  // Servis butonu tıklandığında çalışacak fonksiyon
  onService() {
    this.addToast('Servis talebiniz alındı. En yakın servislerden biri size ulaşacaktır.', 'info');
  }
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  // environment may not declare googleMapsApiKey in its type, cast to any to read optional local key
  @Input() apiKey: string = (environment as any).googleMapsApiKey || environment.firebase?.apiKey || '';
  // Accept additional markers (for example simulated vehicles from the LiveMap page)
  @Input() extraMarkers: any[] = [];

  // keep last firebase trips so we can re-render combined markers when inputs change
  private lastTrips: any[] = [];

  map: any = null;
  markers: any[] = [];
  isFullscreen = false;
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

  ngOnChanges(changes: SimpleChanges) {
    if (this.map && changes['extraMarkers']) {
      // 
      this.renderCombinedMarkers();
    }
  }
  
    // Türkçe Açıklama: Yol Yardım butonu tıklandığında çalışacak fonksiyon
    onRoadAssist() {
      this.addToast('Yol Yardım talebiniz alındı. Yol tarifi ve yardım ekibi yönlendiriliyor.', 'success');
      // Buraya istediğiniz başka işlemleri ekleyebilirsiniz.
    }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    // let the DOM update, then trigger map resize
    setTimeout(() => {
      try {
        if (this.map && (window as any).google && (window as any).google.maps) {
          (window as any).google.maps.event.trigger(this.map, 'resize');
        }
      } catch (e) {
        // ignore
      }
    }, 100);
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
        // keep latest trips and render combined markers (firebase + extra)
        this.lastTrips = trips || [];
        this.renderCombinedMarkers();
      }, err => console.error('Firebase trips error', err));
      this.subs.push(s);
    } catch (e) {
      console.warn('Could not bind firebase markers', e);
    }
  }

  private renderCombinedMarkers() {
    try {
      // clear old markers
      this.markers.forEach(m => m.setMap(null));
      this.markers = [];

      const infoWindow = new google.maps.InfoWindow();

      const addMarker = (item: any, isExtra = false) => {
        const coords = this.extractCoordinates(item);
        if (!coords) return;
        const title = item.title || item.name || (isExtra ? item.id || 'Araç' : 'Rezervasyon');
        const marker = new google.maps.Marker({ position: coords, map: this.map, title });
        this.markers.push(marker);

        // build content for info window
        const speed = item.speed != null ? `${item.speed} km/h` : '';
        const lastUpdate = item.lastUpdate ? (item.lastUpdate instanceof Date ? item.lastUpdate : new Date(item.lastUpdate)) : null;
        const lastUpdateText = lastUpdate ? lastUpdate.toLocaleString() : '';
        const content = `
          <div style="min-width:140px">
            <strong>${title}</strong><br/>
            ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}<br/>
            ${speed ? 'Hız: ' + speed + '<br/>' : ''}
            ${lastUpdateText ? 'Son Güncelleme: ' + lastUpdateText : ''}
          </div>`;

        marker.addListener('click', () => {
          infoWindow.setContent(content);
          infoWindow.open(this.map, marker);
        });
      };

      // render firebase trips
      (this.lastTrips || []).forEach((t: any) => addMarker(t, false));
      // render extra markers (e.g., vehicles passed from LiveMap)
      (this.extraMarkers || []).forEach((v: any) => addMarker(v, true));
    } catch (e) {
      console.warn('Error rendering combined markers', e);
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

  // Allow parent components to programmatically center the map
  public centerTo(lat: number, lng: number, zoom?: number) {
    try {
      if (!this.map) return;
      const pos = { lat, lng };
      this.map.setCenter(pos);
      if (typeof zoom === 'number') this.map.setZoom(zoom);
    } catch (e) {
      console.warn('Could not center map', e);
    }
  }
}
