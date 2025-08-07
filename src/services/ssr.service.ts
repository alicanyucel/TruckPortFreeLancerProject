import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TransferState, StateKey, makeStateKey } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SSRService {
  private isBrowser: boolean;
  private isServer: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private transferState: TransferState
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isServer = isPlatformServer(platformId);
  }

  // Universal HTTP request that works on both server and client
  universalHttpGet<T>(url: string, cacheKey?: string): Observable<T> {
    const key: StateKey<T> = makeStateKey<T>(cacheKey || url);
    
    if (this.isBrowser) {
      // On browser, check if data exists in transfer state first
      const cachedData = this.transferState.get(key, null);
      if (cachedData) {
        // Remove from transfer state to prevent memory leaks
        this.transferState.remove(key);
        return of(cachedData);
      }
    }

    // Make HTTP request (works on both server and client)
    const request = this.http.get<T>(url);
    
    if (this.isServer) {
      // On server, store data in transfer state
      request.subscribe(data => {
        this.transferState.set(key, data);
      });
    }
    
    return request;
  }

  // Check if code is running in browser
  isBrowserPlatform(): boolean {
    return this.isBrowser;
  }

  // Check if code is running on server
  isServerPlatform(): boolean {
    return this.isServer;
  }

  // Safe access to browser-only APIs
  safeBrowserMethod<T>(browserCallback: () => T, serverFallback?: T): T | undefined {
    if (this.isBrowser) {
      return browserCallback();
    }
    return serverFallback;
  }

  // Safe localStorage access
  safeLocalStorageGet(key: string): string | null {
    return this.safeBrowserMethod(() => localStorage.getItem(key), null) || null;
  }

  safeLocalStorageSet(key: string, value: string): void {
    this.safeBrowserMethod(() => localStorage.setItem(key, value));
  }

  // Safe sessionStorage access
  safeSessionStorageGet(key: string): string | null {
    return this.safeBrowserMethod(() => sessionStorage.getItem(key), null) || null;
  }

  safeSessionStorageSet(key: string, value: string): void {
    this.safeBrowserMethod(() => sessionStorage.setItem(key, value));
  }

  // Safe window access
  safeWindowAccess<T>(callback: (window: Window) => T, fallback?: T): T | undefined {
    return this.safeBrowserMethod(() => callback(window), fallback);
  }

  // Safe document access
  safeDocumentAccess<T>(callback: (document: Document) => T, fallback?: T): T | undefined {
    return this.safeBrowserMethod(() => callback(document), fallback);
  }

  // Pre-render optimization
  preloadCriticalData(): Promise<any[]> {
    const criticalRequests = [
      this.universalHttpGet('/api/config', 'app-config'),
      this.universalHttpGet('/api/user/profile', 'user-profile'),
      this.universalHttpGet('/api/services', 'services-list')
    ];

    return Promise.all(criticalRequests.map(req => 
      req.toPromise().catch((error: any): any => {
        console.warn('Failed to preload data:', error);
        return null;
      })
    ));
  }

  // SEO meta data management
  updateMetaTags(meta: {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
  }): void {
    if (this.isBrowser) {
      // Update meta tags only on browser side
      // This would typically be done via Angular's Meta service
      if (meta.title) {
        document.title = meta.title;
      }
      
      const updateMetaTag = (name: string, content: string) => {
        let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!tag) {
          tag = document.createElement('meta');
          tag.name = name;
          document.head.appendChild(tag);
        }
        tag.content = content;
      };

      if (meta.description) updateMetaTag('description', meta.description);
      if (meta.keywords) updateMetaTag('keywords', meta.keywords);
      if (meta.ogTitle) updateMetaTag('og:title', meta.ogTitle);
      if (meta.ogDescription) updateMetaTag('og:description', meta.ogDescription);
      if (meta.ogImage) updateMetaTag('og:image', meta.ogImage);
      
      if (meta.canonicalUrl) {
        let linkTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!linkTag) {
          linkTag = document.createElement('link');
          linkTag.rel = 'canonical';
          document.head.appendChild(linkTag);
        }
        linkTag.href = meta.canonicalUrl;
      }
    }
  }

  // Critical resource preloading
  preloadResources(resources: { href: string; as: string; type?: string }[]): void {
    if (this.isBrowser) {
      resources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.type) {
          link.type = resource.type;
        }
        document.head.appendChild(link);
      });
    }
  }

  // Server-side caching headers
  setCacheHeaders(cacheControl: string): void {
    if (this.isServer) {
      // This would be used in server.ts to set cache headers
      // Implementation depends on server setup
    }
  }
}
