import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'red' | 'blue' | 'green';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>('light');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  private readonly THEME_KEY = 'truckport-theme';

  constructor() {
    // Load theme from localStorage or default to light
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme && this.isValidTheme(savedTheme)) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('light');
    }
  }

  setTheme(theme: Theme): void {
    if (!this.isValidTheme(theme)) {
      console.warn(`Invalid theme: ${theme}. Defaulting to light.`);
      theme = 'light';
    }

    // Remove all theme classes
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-red', 'theme-blue', 'theme-green');
    
    // Add new theme class
    document.body.classList.add(`theme-${theme}`);
    
    // Update subject
    this.currentThemeSubject.next(theme);
    
    // Save to localStorage
    localStorage.setItem(this.THEME_KEY, theme);
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  toggleTheme(): void {
    const themes: Theme[] = ['light', 'dark', 'red', 'blue', 'green'];
    const currentIndex = themes.indexOf(this.getCurrentTheme());
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  isDarkMode(): boolean {
    return this.getCurrentTheme() === 'dark';
  }

  private isValidTheme(theme: string): theme is Theme {
    return ['light', 'dark', 'red', 'blue', 'green'].includes(theme);
  }
}
