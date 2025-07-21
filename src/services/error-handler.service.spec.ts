import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler } from './error-handler.service';

describe('GlobalErrorHandler', () => {
  let service: GlobalErrorHandler;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalErrorHandler]
    });
    service = TestBed.inject(GlobalErrorHandler);
    consoleErrorSpy = spyOn(console, 'error');
  });

  afterEach(() => {
    // Clean up any notification elements
    const notifications = document.querySelectorAll('.error-notification');
    notifications.forEach(notification => notification.remove());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle error and log to console in development', () => {
    spyOn(service as any, 'isProduction').and.returnValue(false);
    const testError = new Error('Test error message');

    service.handleError(testError);

    expect(consoleErrorSpy).toHaveBeenCalled();
    const loggedError = consoleErrorSpy.calls.mostRecent().args[1];
    expect(loggedError.message).toBe('Test error message');
    expect(loggedError.timestamp).toBeInstanceOf(Date);
    expect(loggedError.url).toBe(window.location.href);
  });

  it('should not log to console in production', () => {
    spyOn(service as any, 'isProduction').and.returnValue(true);
    const testError = new Error('Test error message');

    service.handleError(testError);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should show error notification', () => {
    const testError = new Error('Test error message');

    service.handleError(testError);

    const notification = document.querySelector('.error-notification');
    expect(notification).toBeTruthy();
    expect(notification?.textContent).toBe('Bir hata oluştu. Lütfen tekrar deneyin.');
  });

  it('should handle error without message', () => {
    const errorWithoutMessage = {} as Error;

    service.handleError(errorWithoutMessage);

    expect(consoleErrorSpy).toHaveBeenCalled();
    const loggedError = consoleErrorSpy.calls.mostRecent().args[1];
    expect(loggedError.message).toBe('An unexpected error occurred');
  });

  it('should detect production environment correctly', () => {
    // Mock localhost
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost' },
      writable: true
    });

    expect((service as any).isProduction()).toBeFalsy();

    // Mock production domain
    Object.defineProperty(window, 'location', {
      value: { hostname: 'truckport.com' },
      writable: true
    });

    expect((service as any).isProduction()).toBeTruthy();
  });

  it('should remove notification after timeout', (done) => {
    const testError = new Error('Test error message');

    service.handleError(testError);

    const notification = document.querySelector('.error-notification');
    expect(notification).toBeTruthy();

    // Check if notification is removed after timeout
    setTimeout(() => {
      const notificationAfterTimeout = document.querySelector('.error-notification');
      expect(notificationAfterTimeout).toBeFalsy();
      done();
    }, 5100); // Slightly more than the 5000ms timeout
  });

  it('should create notification with correct styles', () => {
    const testError = new Error('Test error message');

    service.handleError(testError);

    const notification = document.querySelector('.error-notification') as HTMLElement;
    expect(notification).toBeTruthy();
    expect(notification.style.position).toBe('fixed');
    expect(notification.style.backgroundColor).toBe('rgb(244, 67, 54)');
    expect(notification.style.color).toBe('white');
    expect(notification.style.zIndex).toBe('10000');
  });
});
