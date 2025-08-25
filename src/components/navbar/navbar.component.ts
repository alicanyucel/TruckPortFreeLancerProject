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
  cookiePanelFlip = false;
  showCookiePassword = false;

  toggleCookiePanel() {
    this.showCookiePanel = !this.showCookiePanel;
    if (this.showCookiePanel) {
      this.loadCookies();
      // Allow template to render, then adjust position
      setTimeout(() => this.adjustCookiePanelPosition(), 50);
    }
  }

  adjustCookiePanelPosition() {
    try {
  // Prefer the register link as anchor if available so the panel appears next to "Kayıt Ol".
  const registerAnchor = document.getElementById('registerLink') as HTMLElement;
  const btn = registerAnchor || document.querySelector('.navbar-link.cookie-toggle') as HTMLElement;
      const panel = document.querySelector('.cookie-panel') as HTMLElement;
      if (!btn || !panel) return;
      const btnRect = btn.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      // If panel would overflow right edge, flip to the right (align panel's right with button's right)
      if (btnRect.left + panelRect.width > viewportWidth - 16) {
        this.cookiePanelFlip = true;
      } else {
        this.cookiePanelFlip = false;
      }
    } catch (e) {
      console.warn('Could not adjust cookie panel position', e);
      this.cookiePanelFlip = false;
    }
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

  // Cancel/refresh: reload current cookie values and close the panel
  cancelCookies() {
    this.loadCookies();
    this.showCookiePanel = false;
  }

  toggleCookiePassword() {
    this.showCookiePassword = !this.showCookiePassword;
  }

  deleteCookie(key: string) {
    this.cookieService.deleteCookie(key);
    this.loadCookies();
  }

  deleteAllCookies() {
    const list = this.cookieService.listCookies();
    Object.keys(list).forEach(k => this.cookieService.deleteCookie(k));
    this.loadCookies();
  const msg = this.translation.translate('cookies.deletedAll') || 'Tümü silindi';
  this.toastr.info(msg, 'Bilgi');
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
  this.toastr.info(this.translation.translate('common.success'), this.translation.translate('navbar.logout'));
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
