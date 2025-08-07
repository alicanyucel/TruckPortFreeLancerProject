import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { AdvancedCacheService } from '../services/advanced-cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  
  // Cacheable methods and URL patterns
  private cacheableMethods = ['GET', 'HEAD'];
  private cacheableUrls = [
    /^\/api\/users/,
    /^\/api\/trucks/,
    /^\/api\/services/,
    /^\/api\/locations/
  ];
  
  // Non-cacheable patterns
  private nonCacheableUrls = [
    /^\/api\/auth/,
    /^\/api\/real-time/,
    /^\/api\/notifications/
  ];

  constructor(private cacheService: AdvancedCacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only cache GET and HEAD requests
    if (!this.cacheableMethods.includes(req.method)) {
      return next.handle(req);
    }

    // Check if URL is cacheable
    if (!this.isCacheable(req.url)) {
      return next.handle(req);
    }

    // Check cache first
    const cacheKey = this.generateCacheKey(req);
    return this.cacheService.get(cacheKey).pipe(
      switchMap((cachedResponse: any) => {
        if (cachedResponse) {
          // Return cached response
          return of(new HttpResponse({
            body: cachedResponse,
            status: 200,
            statusText: 'OK (Cached)',
            headers: req.headers,
            url: req.url
          }));
        }

        // Add conditional headers if available
        const conditionalHeaders = this.cacheService.getConditionalHeaders(req);
        let modifiedReq = req;
        
        for (const [key, value] of Object.entries(conditionalHeaders)) {
          modifiedReq = modifiedReq.clone({
            headers: modifiedReq.headers.set(key, value)
          });
        }

        // Make network request
        return next.handle(modifiedReq).pipe(
          tap(event => {
            if (event instanceof HttpResponse && event.status === 200) {
              // Cache successful responses
              this.cacheService.cacheHttpResponse(req, event, {
                ttl: this.getTTL(req.url),
                persistToStorage: this.shouldPersist(req.url)
              });
            } else if (event instanceof HttpResponse && event.status === 304) {
              // 304 Not Modified - extend cache TTL
              const existingEntry = this.cacheService.get(cacheKey);
              if (existingEntry) {
                this.cacheService.set(cacheKey, existingEntry, {
                  ttl: this.getTTL(req.url)
                });
              }
            }
          }),
          catchError(error => {
            // On error, try to return stale cache if available
            return this.cacheService.get(cacheKey).pipe(
              switchMap((staleData: any) => {
                if (staleData) {
                  console.warn('Returning stale cache due to network error:', error);
                  return of(new HttpResponse({
                    body: staleData,
                    status: 200,
                    statusText: 'OK (Stale Cache)',
                    headers: req.headers,
                    url: req.url
                  }));
                }
                throw error;
              })
            );
          })
        );
      })
    );
  }

  private isCacheable(url: string): boolean {
    // Check non-cacheable patterns first
    if (this.nonCacheableUrls.some(pattern => pattern.test(url))) {
      return false;
    }
    
    // Check cacheable patterns
    return this.cacheableUrls.some(pattern => pattern.test(url));
  }

  private generateCacheKey(req: HttpRequest<any>): string {
    return `${req.method}_${req.urlWithParams}`;
  }

  private getTTL(url: string): number {
    // Different TTL for different endpoints
    if (/\/api\/static/.test(url)) return 24 * 60 * 60 * 1000; // 24 hours
    if (/\/api\/users/.test(url)) return 10 * 60 * 1000; // 10 minutes
    if (/\/api\/trucks/.test(url)) return 5 * 60 * 1000; // 5 minutes
    return 2 * 60 * 1000; // 2 minutes default
  }

  private shouldPersist(url: string): boolean {
    // Persist static data, not dynamic data
    return /\/api\/static|\/api\/config/.test(url);
  }
}
