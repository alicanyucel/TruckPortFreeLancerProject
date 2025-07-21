import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { AboutComponent } from '../pages/about/about.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { LoginComponent } from '../pages/login/login.component';
import { ServicesComponent } from '../pages/services/services.component';
import { TruckStoreComponent } from '../pages/truckstore/truckstore.component';
import { LiveMapComponent } from '../components/live-map/live-map.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hizmetler', component: ServicesComponent },
  { path: 'hakkimizda', component: AboutComponent },
  { path: 'iletisim', component: ContactComponent },
  { path: 'truckstore', component: TruckStoreComponent },
  { path: 'giris', component: LoginComponent },
  { path: 'canli-takip', component: LiveMapComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
