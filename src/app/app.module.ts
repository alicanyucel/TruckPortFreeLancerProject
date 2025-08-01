import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { userReducer } from '../store/user/user.reducer';
import { performanceReducer } from '../store/performance/performance.reducer';
import { UyeOlComponent } from '../pages/uye-ol/uye-ol.component';
import { PerformanceIndicatorComponent } from '../components/performance-indicator/performance-indicator.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { LiveMapComponent } from '../components/live-map/live-map.component';
import { ChatbotComponent } from '../components/chatbot/chatbot.component';
import { AdvertisementsComponent } from '../components/advertisements/advertisements.component';
import { LanguageSwitcherComponent } from '../components/language-switcher/language-switcher.component';
import { HomeComponent } from '../pages/home/home.component';
import { AboutComponent } from '../pages/about/about.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { LoginComponent } from '../pages/login/login.component';
import { ServicesComponent } from '../pages/services/services.component';
import { TruckStoreComponent } from '../pages/truckstore/truckstore.component';
import { TruckstoreModalComponent } from '../pages/truckstore/truckstore-modal.component';
import { TruckStoreLoungeComponent } from '../pages/truckstore-lounge/truckstore-lounge.component';
import { VideoGalleryComponent } from '../pages/video-gallery/video-gallery.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

// Senior Level Services & Interceptors
import { GlobalErrorHandler } from '../services/error-handler.service';
import { ErrorInterceptor } from '../interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    LiveMapComponent,
    ChatbotComponent,
    AdvertisementsComponent,
    LanguageSwitcherComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    ServicesComponent,
    TruckStoreComponent,
    TruckStoreLoungeComponent,
    VideoGalleryComponent,
    TranslatePipe,
    SafeHtmlPipe,
    TruckstoreModalComponent,
    UyeOlComponent,
    PerformanceIndicatorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule
    ,
    StoreModule.forRoot({ user: userReducer, performance: performanceReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25 })
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
