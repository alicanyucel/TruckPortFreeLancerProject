import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to Turkish language', () => {
    expect(service.getCurrentLanguage()).toBe('tr');
  });

  it('should load saved language from localStorage', () => {
    localStorage.setItem('selectedLanguage', 'en');
    
    const newService = new TranslationService();
    expect(newService.getCurrentLanguage()).toBe('en');
  });

  it('should change language and save to localStorage', () => {
    service.setLanguage('en');
    
    expect(service.getCurrentLanguage()).toBe('en');
    expect(localStorage.getItem('selectedLanguage')).toBe('en');
  });

  it('should return correct Turkish translation', () => {
    service.setLanguage('tr');
    
    const translation = service.translate('navbar.home');
    expect(translation).toBe('Ana Sayfa');
  });

  it('should return correct English translation', () => {
    service.setLanguage('en');
    
    const translation = service.translate('navbar.home');
    expect(translation).toBe('Home');
  });

  it('should return key if translation not found', () => {
    const nonExistentKey = 'non.existent.key';
    const translation = service.translate(nonExistentKey);
    
    expect(translation).toBe(nonExistentKey);
  });

  it('should emit language change through observable', (done) => {
    service.getLanguage$().subscribe(language => {
      if (language === 'en') {
        expect(language).toBe('en');
        done();
      }
    });
    
    service.setLanguage('en');
  });

  it('should handle instant translation', () => {
    service.setLanguage('tr');
    
    const translation = service.instant('navbar.services');
    expect(translation).toBe('Hizmetler');
  });

  it('should validate only tr and en languages from localStorage', () => {
    localStorage.setItem('selectedLanguage', 'fr'); // Invalid language
    
    const newService = new TranslationService();
    expect(newService.getCurrentLanguage()).toBe('tr'); // Should default to tr
  });

  it('should handle lounge translations correctly', () => {
    service.setLanguage('tr');
    
    expect(service.translate('lounge.hero.title')).toBe('TruckStore Lounge');
    expect(service.translate('lounge.facility.restaurant.title')).toBe('Restoran');
    expect(service.translate('lounge.pricing.basic')).toBe('Temel Paket');
  });

  it('should handle video gallery translations', () => {
    service.setLanguage('en');
    
    expect(service.translate('videoGallery.title')).toBe('Video Gallery');
    expect(service.translate('videoGallery.categories.all')).toBe('All Videos');
  });

  it('should maintain translation consistency across language switches', () => {
    // Test Turkish
    service.setLanguage('tr');
    const turkishTranslation = service.translate('navbar.contact');
    expect(turkishTranslation).toBe('İletişim');
    
    // Switch to English
    service.setLanguage('en');
    const englishTranslation = service.translate('navbar.contact');
    expect(englishTranslation).toBe('Contact');
    
    // Switch back to Turkish
    service.setLanguage('tr');
    const turkishAgain = service.translate('navbar.contact');
    expect(turkishAgain).toBe('İletişim');
  });
});
