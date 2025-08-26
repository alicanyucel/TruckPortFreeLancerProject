import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { AboutComponent } from '../pages/about/about.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { LoginComponent } from '../pages/login/login.component';
import { ServicesComponent } from '../pages/services/services.component';
import { TruckStoreComponent } from '../pages/truckstore/truckstore.component';
import { TruckListComponent } from '../components/truck-list/truck-list.component';
import { TruckStoreLoungeComponent } from '../pages/truckstore-lounge/truckstore-lounge.component';
import { VideoGalleryComponent } from '../pages/video-gallery/video-gallery.component';
import { LiveMapComponent } from '../components/live-map/live-map.component';
import { GoogleMapComponent } from '../components/google-map/google-map.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { RegisterComponent } from '../pages/uye-ol/uye-ol.component';
import { TestComponent } from '../components/test/test.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { HelpDeskComponent } from '../components/help-desk/help-desk.component';
import { ProviderComponent } from './components/provider/provider.component';
import { RoadAssistComponent } from '../pages/road-assist/road-assist.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rezervasyonlar', component: ReservationComponent },
  { path: 'profile', redirectTo: 'profil' },
  { path: 'profil', component: ProfileComponent },
  { path: 'hizmetler', component: ServicesComponent },
  { path: 'hakkimizda', component: AboutComponent },
  { path: 'iletisim', component: ContactComponent },
  { 
    path: 'truckstore', 
    component: TruckStoreComponent
  },
  { path: 'trucks', component: TruckListComponent },
  { 
    path: 'truckport-lounge', 
    component: TruckStoreLoungeComponent
  },
  { path: 'video-galeri', component: VideoGalleryComponent },
  { path: 'giris', component: LoginComponent },
  { 
    path: 'nakliye-talepleri', 
    component: LiveMapComponent
  },
  { path: 'uye-ol', component: RegisterComponent },
  { path: 'yol-yardim', component: RoadAssistComponent },
  { path: 'road-assist', component: RoadAssistComponent },
  { path: 'help-desk', component: HelpDeskComponent },
  { path: 'test', component: TestComponent },
  { path: 'map', component: GoogleMapComponent },
  { path: 'provider', component: ProviderComponent },
  // Admin dashboard kaldırıldı
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 0],
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
