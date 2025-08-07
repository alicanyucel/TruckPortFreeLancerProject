import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to light theme', () => {
    expect(service.getCurrentTheme()).toBe('light');
  });

  it('should set theme correctly', () => {
    service.setTheme('dark');
    expect(service.getCurrentTheme()).toBe('dark');
    expect(document.body.classList.contains('theme-dark')).toBeTruthy();
  });

  it('should save theme to localStorage', () => {
    service.setTheme('blue');
    expect(localStorage.getItem('truckport-theme')).toBe('blue');
  });

  it('should toggle themes correctly', () => {
    service.setTheme('light');
    service.toggleTheme();
    expect(service.getCurrentTheme()).toBe('dark');
  });

  it('should detect dark mode correctly', () => {
    service.setTheme('dark');
    expect(service.isDarkMode()).toBeTruthy();
    
    service.setTheme('light');
    expect(service.isDarkMode()).toBeFalsy();
  });
});
