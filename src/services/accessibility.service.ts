import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private settingsSubject = new BehaviorSubject<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true
  });

  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    this.loadAccessibilitySettings();
    this.detectSystemPreferences();
    this.setupKeyboardNavigation();
  }

  updateSettings(settings: Partial<AccessibilitySettings>): void {
    const currentSettings = this.settingsSubject.value;
    const newSettings = { ...currentSettings, ...settings };
    this.settingsSubject.next(newSettings);
    this.applySettings(newSettings);
    this.saveSettings(newSettings);
  }

  toggleHighContrast(): void {
    const current = this.settingsSubject.value;
    this.updateSettings({ highContrast: !current.highContrast });
  }

  toggleLargeText(): void {
    const current = this.settingsSubject.value;
    this.updateSettings({ largeText: !current.largeText });
  }

  toggleReducedMotion(): void {
    const current = this.settingsSubject.value;
    this.updateSettings({ reducedMotion: !current.reducedMotion });
  }

  announceToScreenReader(message: string): void {
    if (typeof document !== 'undefined') {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }

  focusElement(selector: string): void {
    if (typeof document !== 'undefined') {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  // Skip to main content functionality
  skipToMainContent(): void {
    this.focusElement('main, [role="main"], #main-content');
  }

  // Keyboard navigation helpers
  isKeyboardNavigation(): Observable<boolean> {
    return this.settings$.pipe(
      map(settings => settings.keyboardNavigation),
      distinctUntilChanged()
    );
  }

  private detectSystemPreferences(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      // Detect reduced motion preference
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (reducedMotionQuery.matches) {
        this.updateSettings({ reducedMotion: true });
      }

      // Detect high contrast preference
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
      if (highContrastQuery.matches) {
        this.updateSettings({ highContrast: true });
      }

      // Listen for changes
      reducedMotionQuery.addEventListener('change', (e) => {
        this.updateSettings({ reducedMotion: e.matches });
      });

      highContrastQuery.addEventListener('change', (e) => {
        this.updateSettings({ highContrast: e.matches });
      });
    }
  }

  private setupKeyboardNavigation(): void {
    if (typeof document !== 'undefined') {
      // Track keyboard usage
      fromEvent(document, 'keydown').pipe(
        debounceTime(100)
      ).subscribe((event: any) => {
        if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') {
          const current = this.settingsSubject.value;
          if (!current.keyboardNavigation) {
            this.updateSettings({ keyboardNavigation: true });
          }
        }
      });

      // Skip link functionality
      fromEvent(document, 'keydown').subscribe((event: any) => {
        if (event.key === 'Enter' && event.target?.classList?.contains('skip-link')) {
          event.preventDefault();
          this.skipToMainContent();
        }
      });
    }
  }

  private applySettings(settings: AccessibilitySettings): void {
    if (typeof document !== 'undefined') {
      const body = document.body;
      
      // Apply high contrast
      body.classList.toggle('high-contrast', settings.highContrast);
      
      // Apply large text
      body.classList.toggle('large-text', settings.largeText);
      
      // Apply reduced motion
      body.classList.toggle('reduced-motion', settings.reducedMotion);
      
      // Apply focus indicators
      body.classList.toggle('focus-indicators', settings.focusIndicators);
      
      // Update CSS custom properties
      const root = document.documentElement;
      root.style.setProperty('--motion-duration', settings.reducedMotion ? '0s' : '0.3s');
      root.style.setProperty('--text-scale', settings.largeText ? '1.2' : '1');
    }
  }

  private loadAccessibilitySettings(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('accessibility_settings');
        if (saved) {
          const settings = JSON.parse(saved);
          this.settingsSubject.next({ ...this.settingsSubject.value, ...settings });
          this.applySettings(this.settingsSubject.value);
        }
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }
  }

  private saveSettings(settings: AccessibilitySettings): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('accessibility_settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save accessibility settings:', error);
      }
    }
  }
}
