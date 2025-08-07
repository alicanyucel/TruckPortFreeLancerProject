import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.state';
import { selectUserName } from '../store/user/user.selectors';
import { setUser } from '../store/user/user.actions';
import { ThemeService } from '../services/theme.service';
import { AuthService, User } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TruckPort';
  userName$: Observable<string>;
  currentUser: User | null = null;
  isAuthenticated = false;
  showWelcomeMessage = true;

  constructor(
    private store: Store<AppState>,
    private themeService: ThemeService,
    private authService: AuthService,
    public router: Router
  ) {
    this.userName$ = this.store.select(selectUserName);
    // Örnek: Kullanıcıyı store'a ekle
    this.store.dispatch(setUser({ name: 'Ali Can Yücel', email: 'ali@truckport.net' }));
  }

  ngOnInit(): void {
    // Theme service is automatically initialized in constructor
    // The theme is loaded from localStorage if available
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.isAuthenticated = false;
    this.router.navigate(['/']);
    // Show success message
    alert('Başarıyla çıkış yaptınız!');
  }

  dismissWelcome(): void {
    this.showWelcomeMessage = false;
  }

  getWelcomeMessage(): string {
    if (this.isAuthenticated && this.currentUser) {
      const timeOfDay = this.getTimeOfDay();
      return `${timeOfDay} ${this.currentUser.email}! TruckPort'a hoş geldiniz.`;
    }
    return 'TruckPort\'a hoş geldiniz! Giriş yaparak tüm özelliklerden faydalanabilirsiniz.';
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Günaydın';
    } else if (hour < 18) {
      return 'İyi günler';
    } else {
      return 'İyi akşamlar';
    }
  }
}
