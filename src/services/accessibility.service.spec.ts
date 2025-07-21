import { TestBed } from '@angular/core/testing';
import { AccessibilityService } from './accessibility.service';

describe('AccessibilityService', () => {
  let service: AccessibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessibilityService);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default settings', () => {
    service.settings$.subscribe(settings => {
      expect(settings.highContrast).toBeFalse();
      expect(settings.largeText).toBeFalse();
      expect(settings.reducedMotion).toBeFalse();
      expect(settings.keyboardNavigation).toBeTruthy();
      expect(settings.focusIndicators).toBeTruthy();
    });
  });

  it('should update accessibility settings', () => {
    const newSettings = {
      highContrast: true,
      largeText: true
    };

    service.updateSettings(newSettings);
    
    service.settings$.subscribe(settings => {
      expect(settings.highContrast).toBeTruthy();
      expect(settings.largeText).toBeTruthy();
      expect(settings.reducedMotion).toBeFalse(); // Should remain unchanged
    });
  });

  it('should toggle high contrast', () => {
    service.toggleHighContrast();
    
    service.settings$.subscribe(settings => {
      expect(settings.highContrast).toBeTruthy();
    });
    
    service.toggleHighContrast();
    
    service.settings$.subscribe(settings => {
      expect(settings.highContrast).toBeFalse();
    });
  });

  it('should toggle large text', () => {
    service.toggleLargeText();
    
    service.settings$.subscribe(settings => {
      expect(settings.largeText).toBeTruthy();
    });
  });

  it('should toggle reduced motion', () => {
    service.toggleReducedMotion();
    
    service.settings$.subscribe(settings => {
      expect(settings.reducedMotion).toBeTruthy();
    });
  });

  it('should announce to screen reader', () => {
    // Mock document.createElement
    const mockElement = {
      setAttribute: jasmine.createSpy('setAttribute'),
      textContent: '',
      className: ''
    } as any;
    
    spyOn(document, 'createElement').and.returnValue(mockElement);
    spyOn(document.body, 'appendChild').and.stub();
    spyOn(document.body, 'removeChild').and.stub();
    
    const message = 'Test announcement';
    service.announceToScreenReader(message);
    
    expect(document.createElement).toHaveBeenCalledWith('div');
    expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-live', 'polite');
    expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-atomic', 'true');
    expect(mockElement.textContent).toBe(message);
    expect(mockElement.className).toBe('sr-only');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockElement);
  });

  it('should focus element by selector', () => {
    const mockElement = {
      focus: jasmine.createSpy('focus'),
      scrollIntoView: jasmine.createSpy('scrollIntoView')
    };
    
    spyOn(document, 'querySelector').and.returnValue(mockElement as any);
    
    service.focusElement('#test-element');
    
    expect(document.querySelector).toHaveBeenCalledWith('#test-element');
    expect(mockElement.focus).toHaveBeenCalled();
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center'
    });
  });

  it('should skip to main content', () => {
    spyOn(service, 'focusElement');
    
    service.skipToMainContent();
    
    expect(service.focusElement).toHaveBeenCalledWith('main, [role="main"], #main-content');
  });

  it('should track keyboard navigation', (done) => {
    service.isKeyboardNavigation().subscribe(isKeyboard => {
      expect(typeof isKeyboard).toBe('boolean');
      done();
    });
  });

  it('should save and load settings from localStorage', () => {
    const testSettings = {
      highContrast: true,
      largeText: true,
      reducedMotion: true
    };
    
    service.updateSettings(testSettings);
    
    // Create new service instance to test loading
    const newService = new AccessibilityService();
    
    newService.settings$.subscribe(settings => {
      expect(settings.highContrast).toBeTruthy();
      expect(settings.largeText).toBeTruthy();
      expect(settings.reducedMotion).toBeTruthy();
    });
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw error
    spyOn(localStorage, 'setItem').and.throwError('Storage Error');
    spyOn(console, 'error');
    
    service.updateSettings({ highContrast: true });
    
    expect(console.error).toHaveBeenCalledWith('Failed to save accessibility settings:', jasmine.any(Error));
  });

  it('should apply CSS classes based on settings', () => {
    const mockBody = {
      classList: {
        toggle: jasmine.createSpy('toggle')
      }
    };
    
    const mockRoot = {
      style: {
        setProperty: jasmine.createSpy('setProperty')
      }
    };
    
    spyOn(document, 'querySelector').and.returnValue(mockRoot as any);
    Object.defineProperty(document, 'body', { value: mockBody });
    Object.defineProperty(document, 'documentElement', { value: mockRoot });
    
    service.updateSettings({
      highContrast: true,
      largeText: true,
      reducedMotion: true,
      focusIndicators: true
    });
    
    expect(mockBody.classList.toggle).toHaveBeenCalledWith('high-contrast', true);
    expect(mockBody.classList.toggle).toHaveBeenCalledWith('large-text', true);
    expect(mockBody.classList.toggle).toHaveBeenCalledWith('reduced-motion', true);
    expect(mockBody.classList.toggle).toHaveBeenCalledWith('focus-indicators', true);
    
    expect(mockRoot.style.setProperty).toHaveBeenCalledWith('--motion-duration', '0s');
    expect(mockRoot.style.setProperty).toHaveBeenCalledWith('--text-scale', '1.2');
  });
});
