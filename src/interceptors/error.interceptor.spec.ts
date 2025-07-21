import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ErrorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let interceptor: ErrorInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ErrorInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(ErrorInterceptor);
  });

  afterEach(() => {
    httpTestingController.verify();
    // Clean up any toast notifications
    const toasts = document.querySelectorAll('.http-error-toast');
    toasts.forEach(toast => toast.remove());
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should retry failed requests once', () => {
    const testUrl = '/api/test';
    let responseCount = 0;

    httpClient.get(testUrl).subscribe({
      next: () => {},
      error: () => responseCount++
    });

    // First request - will fail
    const req1 = httpTestingController.expectOne(testUrl);
    req1.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    // Retry request - will also fail
    const req2 = httpTestingController.expectOne(testUrl);
    req2.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(responseCount).toBe(1); // Only one error callback due to retry
  });

  it('should handle 400 error with Turkish message', () => {
    const testUrl = '/api/test';
    spyOn(interceptor as any, 'showErrorToast');

    httpClient.get(testUrl).subscribe({
      error: (error) => {
        expect(error).toBe('Geçersiz istek. Lütfen girdiğiniz bilgileri kontrol edin.');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });

    expect((interceptor as any).showErrorToast).toHaveBeenCalledWith('Geçersiz istek. Lütfen girdiğiniz bilgileri kontrol edin.');
  });

  it('should handle 401 error with Turkish message', () => {
    const testUrl = '/api/test';
    spyOn(interceptor as any, 'showErrorToast');

    httpClient.get(testUrl).subscribe({
      error: (error) => {
        expect(error).toBe('Yetkisiz erişim. Lütfen giriş yapın.');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect((interceptor as any).showErrorToast).toHaveBeenCalledWith('Yetkisiz erişim. Lütfen giriş yapın.');
  });

  it('should handle 403 error with Turkish message', () => {
    const testUrl = '/api/test';
    spyOn(interceptor as any, 'showErrorToast');

    httpClient.get(testUrl).subscribe({
      error: (error) => {
        expect(error).toBe('Bu işlem için yetkiniz bulunmuyor.');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

    expect((interceptor as any).showErrorToast).toHaveBeenCalledWith('Bu işlem için yetkiniz bulunmuyor.');
  });

  it('should handle 404 error with Turkish message', () => {
    const testUrl = '/api/test';
    spyOn(interceptor as any, 'showErrorToast');

    httpClient.get(testUrl).subscribe({
      error: (error) => {
        expect(error).toBe('İstenen kaynak bulunamadı.');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect((interceptor as any).showErrorToast).toHaveBeenCalledWith('İstenen kaynak bulunamadı.');
  });

  it('should handle 500 error with Turkish message', () => {
    const testUrl = '/api/test';
    spyOn(interceptor as any, 'showErrorToast');

    httpClient.get(testUrl).subscribe({
      error: (error) => {
        expect(error).toBe('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect((interceptor as any).showErrorToast).toHaveBeenCalledWith('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
  });

  it('should handle unknown error status', () => {
    const testUrl = '/api/test';
    spyOn(interceptor as any, 'showErrorToast');

    httpClient.get(testUrl).subscribe({
      error: (error) => {
        expect(error).toBe('Beklenmeyen hata: 418');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush('I\'m a teapot', { status: 418, statusText: 'I\'m a teapot' });

    expect((interceptor as any).showErrorToast).toHaveBeenCalledWith('Beklenmeyen hata: 418');
  });

  it('should handle client-side errors', () => {
    const testUrl = '/api/test';
    spyOn(interceptor as any, 'showErrorToast');
    spyOn(console, 'error');

    httpClient.get(testUrl).subscribe({
      error: (error) => {
        expect(error).toContain('Client Error:');
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    const errorEvent = new ErrorEvent('Network error', {
      message: 'Connection failed'
    });
    req.error(errorEvent);

    expect(console.error).toHaveBeenCalledWith('HTTP Error:', 'Client Error: Connection failed');
  });

  it('should show error toast notification', () => {
    const message = 'Test error message';
    
    (interceptor as any).showErrorToast(message);

    const toast = document.querySelector('.http-error-toast');
    expect(toast).toBeTruthy();
    expect(toast?.textContent).toBe(message);
    expect((toast as HTMLElement)?.style.position).toBe('fixed');
    expect((toast as HTMLElement)?.style.backgroundColor).toBe('rgb(255, 87, 34)');
  });

  it('should remove toast after timeout', (done) => {
    const message = 'Test error message';
    
    (interceptor as any).showErrorToast(message);

    const toast = document.querySelector('.http-error-toast');
    expect(toast).toBeTruthy();

    setTimeout(() => {
      const toastAfterTimeout = document.querySelector('.http-error-toast');
      expect(toastAfterTimeout).toBeFalsy();
      done();
    }, 4100); // Slightly more than the 4000ms timeout
  });

  it('should pass through successful requests', () => {
    const testUrl = '/api/test';
    const testData = { message: 'Success' };

    httpClient.get(testUrl).subscribe(response => {
      expect(response).toEqual(testData);
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush(testData);
  });
});
