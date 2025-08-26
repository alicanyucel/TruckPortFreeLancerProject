import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { TranslationService } from '../../../services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isProfileDropdownOpen = false;
  showTestEmbedded = false;


  constructor(
    private authService: AuthService,
    private router: Router
    , private translationService: TranslationService
  ) {
    // subscribe to language changes
    this.langSub = this.translationService.getLanguage$().subscribe(l => {
      if (l === 'tr' || l === 'en') this.currentLang = l;
    });
  }

  onLangChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    if (val === 'tr' || val === 'en') {
      this.translationService.setLanguage(val);
    }
  }

  currentLang = 'tr';
  private langSub: Subscription | null = null;

  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleProfileDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  toggleTestEmbedded(event?: Event): void {
    if (event) { event.stopPropagation(); }
    this.showTestEmbedded = !this.showTestEmbedded;
    // close mobile menu when showing test
    if (this.showTestEmbedded) { this.closeMobileMenu(); }
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

  ngOnDestroy(): void {
    if (this.langSub) { this.langSub.unsubscribe(); this.langSub = null; }
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
