import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { AboutComponent } from '../pages/about/about.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { LoginComponent } from '../pages/login/login.component';
import { ServicesComponent } from '../pages/services/services.component';
import { TruckStoreComponent } from '../pages/truckstore/truckstore.component';
import { TruckStoreLoungeComponent } from '../pages/truckstore-lounge/truckstore-lounge.component';
import { VideoGalleryComponent } from '../pages/video-gallery/video-gallery.component';
import { LiveMapComponent } from '../components/live-map/live-map.component';
import { AuthGuard, AdminGuard } from '../services/auth.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hizmetler', component: ServicesComponent },
  { path: 'hakkimizda', component: AboutComponent },
  { path: 'iletisim', component: ContactComponent },
  { 
    path: 'truckstore', 
    component: TruckStoreComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'truckstore-lounge', 
    component: TruckStoreLoungeComponent,
    canActivate: [AuthGuard]
  },
  { path: 'video-galeri', component: VideoGalleryComponent },
  { path: 'giris', component: LoginComponent },
  { 
    path: 'canli-takip', 
    component: LiveMapComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      // Admin routes can be added here
      { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 0]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
