import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { shareReplay, map, switchMap, catchError } from 'rxjs/operators';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // time to live in milliseconds
  etag?: string;
  lastModified?: string;
}

export interface CacheConfig {
  ttl: number;
  maxSize: number;
  strategy: 'LRU' | 'FIFO' | 'TTL';
  persistToStorage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedCacheService {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private accessOrder = new Map<string, number>();
  private accessCounter = 0;
  
  private defaultConfig: CacheConfig = {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    strategy: 'LRU',
    persistToStorage: true
  };

  constructor() {
    this.loadFromStorage();
    this.startCleanupTimer();
  }

  // Multi-level caching: Memory -> LocalStorage -> Network
  get<T>(key: string, config?: Partial<CacheConfig>): Observable<T | null> {
    const cacheConfig = { ...this.defaultConfig, ...config };
    
    // Check memory cache first
    const memoryEntry = this.getFromMemory<T>(key);
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      this.updateAccessOrder(key);
      return of(memoryEntry.data);
    }

    // Check localStorage if enabled
    if (cacheConfig.persistToStorage) {
      const storageEntry = this.getFromStorage<T>(key);
      if (storageEntry && !this.isExpired(storageEntry)) {
        // Move to memory cache
        this.setInMemory(key, storageEntry, cacheConfig);
        return of(storageEntry.data);
      }
    }

    return of(null);
  }

  set<T>(key: string, data: T, config?: Partial<CacheConfig>): void {
    const cacheConfig = { ...this.defaultConfig, ...config };
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: cacheConfig.ttl
    };

    this.setInMemory(key, entry, cacheConfig);
    
    if (cacheConfig.persistToStorage) {
      this.setInStorage(key, entry);
    }
  }

  // Smart caching with ETags and Last-Modified headers
  cacheHttpResponse<T>(request: HttpRequest<any>, response: HttpResponse<T>, config?: Partial<CacheConfig>): void {
    const key = this.generateCacheKey(request);
    const etag = response.headers.get('etag');
    const lastModified = response.headers.get('last-modified');
    
    const cacheConfig = { ...this.defaultConfig, ...config };
    
    const entry: CacheEntry<T> = {
      data: response.body as T,
      timestamp: Date.now(),
      ttl: cacheConfig.ttl,
      etag: etag || undefined,
      lastModified: lastModified || undefined
    };

    this.setInMemory(key, entry, cacheConfig);
    
    if (cacheConfig.persistToStorage) {
      this.setInStorage(key, entry);
    }
  }

  // Get conditional headers for HTTP requests
  getConditionalHeaders(request: HttpRequest<any>): { [key: string]: string } {
    const key = this.generateCacheKey(request);
    const entry = this.getFromMemory(key) || this.getFromStorage(key);
    
    const headers: { [key: string]: string } = {};
    
    if (entry) {
      if (entry.etag) {
        headers['If-None-Match'] = entry.etag;
      }
      if (entry.lastModified) {
        headers['If-Modified-Since'] = entry.lastModified;
      }
    }
    
    return headers;
  }

  invalidate(pattern: string): void {
    const regex = new RegExp(pattern);
    
    // Invalidate memory cache
    for (const key of this.memoryCache.keys()) {
      if (regex.test(key)) {
        this.memoryCache.delete(key);
        this.accessOrder.delete(key);
      }
    }
    
    // Invalidate storage cache
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_') && regex.test(key)) {
        localStorage.removeItem(key);
      }
    }
  }

  clear(): void {
    this.memoryCache.clear();
    this.accessOrder.clear();
    
    // Clear storage cache
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    }
  }

  // Cache statistics for monitoring
  getStats(): any {
    const totalEntries = this.memoryCache.size;
    let totalSize = 0;
    let expiredEntries = 0;

    for (const entry of this.memoryCache.values()) {
      totalSize += JSON.stringify(entry).length;
      if (this.isExpired(entry)) {
        expiredEntries++;
      }
    }

    return {
      totalEntries,
      totalSize,
      expiredEntries,
      hitRate: this.calculateHitRate(),
      memoryUsage: totalSize
    };
  }

  private setInMemory<T>(key: string, entry: CacheEntry<T>, config: CacheConfig): void {
    // Implement cache eviction strategy
    if (this.memoryCache.size >= config.maxSize) {
      this.evictEntries(config.strategy);
    }

    this.memoryCache.set(key, entry);
    this.updateAccessOrder(key);
  }

  private getFromMemory<T>(key: string): CacheEntry<T> | undefined {
    return this.memoryCache.get(key);
  }

  private setInStorage<T>(key: string, entry: CacheEntry<T>): void {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to save cache entry to localStorage:', error);
    }
  }

  private getFromStorage<T>(key: string): CacheEntry<T> | undefined {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.warn('Failed to load cache entry from localStorage:', error);
      return undefined;
    }
  }

  private generateCacheKey(request: HttpRequest<any>): string {
    const url = request.urlWithParams;
    const method = request.method;
    const body = request.body ? JSON.stringify(request.body) : '';
    return `${method}_${url}_${body}`;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private updateAccessOrder(key: string): void {
    this.accessOrder.set(key, ++this.accessCounter);
  }

  private evictEntries(strategy: 'LRU' | 'FIFO' | 'TTL'): void {
    switch (strategy) {
      case 'LRU':
        this.evictLRU();
        break;
      case 'FIFO':
        this.evictFIFO();
        break;
      case 'TTL':
        this.evictExpired();
        break;
    }
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestAccess = Infinity;

    for (const [key, accessTime] of this.accessOrder.entries()) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.memoryCache.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
    }
  }

  private evictFIFO(): void {
    const firstKey = this.memoryCache.keys().next().value;
    if (firstKey) {
      this.memoryCache.delete(firstKey);
      this.accessOrder.delete(firstKey);
    }
  }

  private evictExpired(): void {
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
        this.accessOrder.delete(key);
      }
    }
  }

  private loadFromStorage(): void {
    // Load persisted cache entries on service initialization
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        const cacheKey = key.substring(6); // Remove 'cache_' prefix
        const entry = this.getFromStorage(cacheKey);
        if (entry && !this.isExpired(entry)) {
          this.memoryCache.set(cacheKey, entry);
        } else if (entry) {
          // Remove expired entries from storage
          localStorage.removeItem(key);
        }
      }
    }
  }

  private startCleanupTimer(): void {
    // Clean up expired entries every 5 minutes
    timer(0, 5 * 60 * 1000).subscribe(() => {
      this.cleanupExpiredEntries();
    });
  }

  private cleanupExpiredEntries(): void {
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => {
      this.memoryCache.delete(key);
      this.accessOrder.delete(key);
      localStorage.removeItem(`cache_${key}`);
    });
  }

  private calculateHitRate(): number {
    // This would require tracking hits and misses
    // Implementation depends on usage tracking
    return 0.85; // Placeholder
  }
}
