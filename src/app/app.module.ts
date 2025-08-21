import { NgModule, ErrorHandler, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';

// Components
import { AppComponent } from './app.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { LiveMapComponent } from '../components/live-map/live-map.component';
import { AdvertisementsComponent } from '../components/advertisements/advertisements.component';
import { LanguageSwitcherComponent } from '../components/language-switcher/language-switcher.component';
import { ThemeSwitcherComponent } from '../components/theme-switcher/theme-switcher.component';
import { TestComponent } from '../components/test/test.component';
import { GoogleMapComponent } from '../components/google-map/google-map.component';
import { PerformanceIndicatorComponent } from '../components/performance-indicator/performance-indicator.component';
import { TruckstoreModalComponent } from '../pages/truckstore/truckstore-modal.component';
import { TruckStoreComponent } from '../pages/truckstore/truckstore.component';
import { TruckStoreLoungeComponent } from '../pages/truckstore-lounge/truckstore-lounge.component';
import { VideoGalleryComponent } from '../pages/video-gallery/video-gallery.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { HomeComponent } from '../pages/home/home.component';
import { AboutComponent } from '../pages/about/about.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { LoginComponent } from '../pages/login/login.component';
import { ServicesComponent } from '../pages/services/services.component';
import { RegisterComponent } from '../pages/uye-ol/uye-ol.component';

// Pipes
import { TranslatePipe } from '../pipes/translate.pipe';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

// Standalone Component
import { TruckListComponent } from '../components/truck-list/truck-list.component';

// Modules
import { HelpDeskModule } from '../components/help-desk/help-desk.module';

// Reducers
import { userReducer } from '../store/user/user.reducer';
import { performanceReducer } from '../store/performance/performance.reducer';

// Services & Interceptors
import { GlobalErrorHandler } from '../services/error-handler.service';
import { ErrorInterceptor } from '../interceptors/error.interceptor';
import { CacheInterceptor } from '../interceptors/cache.interceptor';
import { SecurityInterceptor } from '../services/security.service';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    LiveMapComponent,
    AdvertisementsComponent,
    LanguageSwitcherComponent,
    ThemeSwitcherComponent,
    TestComponent,
    GoogleMapComponent,
    PerformanceIndicatorComponent,
    TruckstoreModalComponent,
    TruckStoreComponent,
    TruckStoreLoungeComponent,
    VideoGalleryComponent,
    ProfileComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    ServicesComponent,
    RegisterComponent,
    TranslatePipe,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({ user: userReducer, performance: performanceReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    HelpDeskModule,
    TruckListComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SecurityInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
