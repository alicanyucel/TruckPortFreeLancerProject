import { Component, OnInit } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.css']
})
export class ThemeSwitcherComponent implements OnInit {
  currentTheme$: Observable<Theme>;
  themes: Array<{value: Theme, label: string, icon: string}> = [
    { value: 'light', label: 'Açık', icon: '☀️' },
    { value: 'dark', label: 'Koyu', icon: '🌙' },
    { value: 'red', label: 'Kırmızı', icon: '🔴' },
    { value: 'blue', label: 'Mavi', icon: '🔵' },
    { value: 'green', label: 'Yeşil', icon: '🟢' }
  ];
  isDropdownOpen = false;

  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.currentTheme$;
  }

  ngOnInit(): void {}

  onThemeSelect(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.isDropdownOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  getCurrentThemeLabel(): string {
    const currentTheme = this.themeService.getCurrentTheme();
    const theme = this.themes.find(t => t.value === currentTheme);
    return theme ? theme.label : 'Açık';
  }

  getCurrentThemeIcon(): string {
    const currentTheme = this.themeService.getCurrentTheme();
    const theme = this.themes.find(t => t.value === currentTheme);
    return theme ? theme.icon : '☀️';
  }
}
