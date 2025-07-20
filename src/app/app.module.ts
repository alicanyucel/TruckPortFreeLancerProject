import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { LiveMapComponent } from '../components/live-map/live-map.component';
import { ChatbotComponent } from '../components/chatbot/chatbot.component';
import { AdvertisementsComponent } from '../components/advertisements/advertisements.component';
import { HomeComponent } from '../pages/home/home.component';
import { AboutComponent } from '../pages/about/about.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { LoginComponent } from '../pages/login/login.component';
import { ServicesComponent } from '../pages/services/services.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    LiveMapComponent,
    ChatbotComponent,
    AdvertisementsComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    ServicesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
