import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ToastrService } from '../../services/toastr.service';
import { TranslatePipe } from "../../app/pipes/translate.pipe";
import { CookieService } from '../../services/cookie.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isProfileDropdownOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  , private cookieService: CookieService
  , private translation: TranslationService
  ) {}

  // Cookie UI state
  showCookiePanel = false;
  cookieEmail = '';
  cookiePassword = '';
  cookieTheme = '';
  cookieLang = '';
  cookieList: { [key: string]: string } = {};
  showCookiePassword = false;

  toggleCookiePanel() {
    this.showCookiePanel = !this.showCookiePanel;
    if (this.showCookiePanel) this.loadCookies();
  }

  loadCookies() {
    this.cookieEmail = this.cookieService.getCookie('userEmail') || '';
    this.cookiePassword = this.cookieService.getCookie('userPassword') || '';
    this.cookieTheme = this.cookieService.getCookie('theme') || '';
    this.cookieLang = this.cookieService.getCookie('selectedLanguage') || '';
    this.cookieList = this.cookieService.listCookies();
  }

  saveCookies() {
    if (this.cookieEmail) this.cookieService.setCookie('userEmail', this.cookieEmail);
    if (this.cookiePassword) this.cookieService.setCookie('userPassword', this.cookiePassword);
    if (this.cookieTheme) this.cookieService.setCookie('theme', this.cookieTheme);
    if (this.cookieLang) this.cookieService.setCookie('selectedLanguage', this.cookieLang);
    this.toastr.success('Çerezler kaydedildi', 'Bilgi');
    this.loadCookies();
  }

  toggleCookiePassword() {
    this.showCookiePassword = !this.showCookiePassword;
  }

  deleteCookie(key: string) {
    this.cookieService.deleteCookie(key);
    this.loadCookies();
  }

  // Display-friendly label for known cookie keys
  displayKey(key: string): string {
    const map: { [k: string]: string } = {
      'userEmail': this.translation.translate('cookies.email'),
      'userPassword': this.translation.translate('cookies.password'),
      'theme': this.translation.translate('cookies.theme'),
      'selectedLanguage': this.translation.translate('cookies.language')
    };
    return map[key] || key;
  }

  // Display-friendly value for specific known cookie keys
  displayValue(key: string, value: string): string {
    if (!value) return '';
    if (key === 'theme') {
      return this.translation.translate(value === 'light' ? 'theme.light' : 'theme.dark');
    }
    if (key === 'selectedLanguage') {
      return this.translation.translate(value === 'en' ? 'lang.en' : 'lang.tr');
    }
    // For emails, mask partially for privacy
    if (key === 'userEmail') {
      const parts = value.split('@');
      if (parts.length === 2) {
        const name = parts[0];
        const domain = parts[1];
        const visible = name.length > 2 ? name.slice(0, 3) : name.slice(0, 1);
        return `${visible}...@${domain}`;
      }
    }
    if (key === 'userPassword') {
      return value ? '••••••' : '';
    }
    return value;
  }

  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.toastr.info('Çıkış yapıldı.', 'Bilgi');
    this.router.navigate(['/']);
  }
  // Her girişte toast mesajı göster
  ngOnInit(): void {
    if (this.isAuthenticated) {
      this.toastr.success('Giriş başarılı!', 'Hoşgeldiniz');
    }
  }

  toggleProfileDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  closeProfileDropdown(): void {
    this.isProfileDropdownOpen = false;
  }

  get profileDisplayName(): string {
    const user = this.currentUser;
    return user ? (user.name || user.email || 'Profil') : 'Profil';
  }

  navigateToHome(): void {
    this.router.navigate(['/']).then(() => {
      // Sayfa tepesine kaydır
      window.scrollTo({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
      });
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Dışarı tıklandığında menüyü kapat
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const navbar = target.closest('.navbar');
    if (!navbar) {
      this.closeMobileMenu();
  this.closeProfileDropdown();
    }
  }

  // Resize olduğunda büyük ekranlarda menüyü kapat
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const target = event.target as Window;
    if (target.innerWidth >= 768) {
      this.closeMobileMenu();
    }
  }

  // ESC tuşuna basıldığında menüyü kapat
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    this.closeMobileMenu();
  }
}
