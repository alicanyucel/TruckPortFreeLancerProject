import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, scan, shareReplay } from 'rxjs/operators';

export interface PerformanceMetrics {
  // Core Web Vitals
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay  
  CLS?: number; // Cumulative Layout Shift
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
  
  // Custom Metrics
  TTI?: number; // Time to Interactive
  TBT?: number; // Total Blocking Time
  SI?: number; // Speed Index
  
  // Resource Metrics
  domContentLoaded?: number;
  loadComplete?: number;
  resourceCount?: number;
  resourceSize?: number;
  
  // Memory Metrics
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
  
  // Network Metrics
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  
  // Angular Specific
  ngZoneEvents?: number;
  changeDetectionCycles?: number;
  componentRenderTime?: number;
  
  timestamp: number;
}

export interface UserInteractionMetric {
  type: string;
  element: string;
  timestamp: number;
  duration?: number;
  page: string;
  userId?: string;
}

export interface ErrorMetric {
  type: 'javascript' | 'http' | 'angular' | 'promise';
  message: string;
  stack?: string;
  url?: string;
  line?: number;
  column?: number;
  timestamp: number;
  userId?: string;
  page: string;
  userAgent: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedPerformanceService {
  private metricsSubject = new BehaviorSubject<PerformanceMetrics[]>([]);
  private interactionSubject = new BehaviorSubject<UserInteractionMetric[]>([]);
  private errorSubject = new BehaviorSubject<ErrorMetric[]>([]);
  
  private performanceObserver?: PerformanceObserver;
  private mutationObserver?: MutationObserver;
  private resizeObserver?: ResizeObserver;
  
  private clsValue = 0;
  private clsEntries: PerformanceEntry[] = [];
  private largestContentfulPaint = 0;
  
  public metrics$ = this.metricsSubject.asObservable();
  public interactions$ = this.interactionSubject.asObservable();
  public errors$ = this.errorSubject.asObservable();
  
  // Real-time performance monitoring
  public realTimeMetrics$ = interval(5000).pipe(
    map(() => this.getCurrentMetrics()),
    shareReplay(1)
  );

  constructor() {
    this.initializePerformanceObservers();
    this.setupErrorHandling();
    this.setupUserInteractionTracking();
    this.startMemoryMonitoring();
  }

  private initializePerformanceObservers(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Core Web Vitals Observer
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });

      // Observe different entry types
      try {
        this.performanceObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.performanceObserver.observe({ entryTypes: ['first-input'] });
        this.performanceObserver.observe({ entryTypes: ['layout-shift'] });
        this.performanceObserver.observe({ entryTypes: ['paint'] });
        this.performanceObserver.observe({ entryTypes: ['navigation'] });
        this.performanceObserver.observe({ entryTypes: ['resource'] });
        this.performanceObserver.observe({ entryTypes: ['measure'] });
        this.performanceObserver.observe({ entryTypes: ['mark'] });
      } catch (error) {
        console.warn('Some performance observers not supported:', error);
      }
    }

    // Layout shift tracking with Mutation Observer
    if (typeof window !== 'undefined' && 'MutationObserver' in window) {
      this.mutationObserver = new MutationObserver(() => {
        this.measureLayoutShift();
      });
      
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    // Viewport changes
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this.recordViewportChange();
      });
      
      this.resizeObserver.observe(document.body);
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry): void {
    const currentMetrics = this.getCurrentMetrics();
    
    switch (entry.entryType) {
      case 'largest-contentful-paint':
        this.largestContentfulPaint = entry.startTime;
        currentMetrics.LCP = entry.startTime;
        break;
        
      case 'first-input':
        const fidEntry = entry as any;
        currentMetrics.FID = fidEntry.processingStart - fidEntry.startTime;
        break;
        
      case 'layout-shift':
        const clsEntry = entry as any;
        if (!clsEntry.hadRecentInput) {
          this.clsValue += clsEntry.value;
          this.clsEntries.push(entry);
          currentMetrics.CLS = this.clsValue;
        }
        break;
        
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          currentMetrics.FCP = entry.startTime;
        }
        break;
        
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming;
        currentMetrics.TTFB = navEntry.responseStart - navEntry.requestStart;
        currentMetrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.fetchStart;
        currentMetrics.loadComplete = navEntry.loadEventEnd - navEntry.fetchStart;
        break;
    }
    
    this.updateMetrics(currentMetrics);
  }

  private getCurrentMetrics(): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      timestamp: Date.now(),
      LCP: this.largestContentfulPaint,
      CLS: this.clsValue
    };

    // Memory metrics
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metrics.usedJSHeapSize = memory.usedJSHeapSize;
      metrics.totalJSHeapSize = memory.totalJSHeapSize;
      metrics.jsHeapSizeLimit = memory.jsHeapSizeLimit;
    }

    // Network information
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      metrics.connectionType = connection.type;
      metrics.effectiveType = connection.effectiveType;
      metrics.downlink = connection.downlink;
      metrics.rtt = connection.rtt;
      metrics.saveData = connection.saveData;
    }

    // Resource metrics
    const resources = performance.getEntriesByType('resource');
    metrics.resourceCount = resources.length;
    metrics.resourceSize = resources.reduce((total, resource) => {
      return total + ((resource as any).transferSize || 0);
    }, 0);

    return metrics;
  }

  private updateMetrics(metrics: PerformanceMetrics): void {
    const current = this.metricsSubject.value;
    this.metricsSubject.next([...current, metrics]);
  }

  private setupErrorHandling(): void {
    if (typeof window !== 'undefined') {
      // JavaScript errors
      window.addEventListener('error', (event) => {
        this.recordError({
          type: 'javascript',
          message: event.message,
          stack: event.error?.stack,
          url: event.filename,
          line: event.lineno,
          column: event.colno,
          timestamp: Date.now(),
          page: window.location.pathname,
          userAgent: navigator.userAgent
        });
      });

      // Promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.recordError({
          type: 'promise',
          message: event.reason?.message || String(event.reason),
          stack: event.reason?.stack,
          timestamp: Date.now(),
          page: window.location.pathname,
          userAgent: navigator.userAgent
        });
      });
    }
  }

  private setupUserInteractionTracking(): void {
    if (typeof window !== 'undefined') {
      const events = ['click', 'input', 'scroll', 'keydown'];
      
      events.forEach(eventType => {
        document.addEventListener(eventType, (event) => {
          this.recordInteraction({
            type: eventType,
            element: this.getElementSelector(event.target as Element),
            timestamp: Date.now(),
            page: window.location.pathname
          });
        }, { passive: true });
      });
    }
  }

  private getElementSelector(element: Element): string {
    if (!element) return 'unknown';
    
    let selector = element.tagName.toLowerCase();
    
    if (element.id) {
      selector += `#${element.id}`;
    }
    
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c);
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }
    
    return selector;
  }

  private recordError(error: ErrorMetric): void {
    const current = this.errorSubject.value;
    this.errorSubject.next([...current.slice(-99), error]); // Keep last 100 errors
  }

  private recordInteraction(interaction: UserInteractionMetric): void {
    const current = this.interactionSubject.value;
    this.interactionSubject.next([...current.slice(-499), interaction]); // Keep last 500 interactions
  }

  private measureLayoutShift(): void {
    // Custom layout shift measurement
    // This is a simplified version - real implementation would be more complex
    performance.mark('layout-shift-start');
  }

  private recordViewportChange(): void {
    if (typeof window !== 'undefined') {
      const metrics = this.getCurrentMetrics();
      metrics.timestamp = Date.now();
      this.updateMetrics(metrics);
    }
  }

  private startMemoryMonitoring(): void {
    // Monitor memory usage every 30 seconds
    if (typeof window !== 'undefined') {
      setInterval(() => {
        const metrics = this.getCurrentMetrics();
        this.updateMetrics(metrics);
      }, 30000);
    }
  }

  // Public API methods
  public markFeatureStart(featureName: string): void {
    performance.mark(`${featureName}-start`);
  }

  public markFeatureEnd(featureName: string): void {
    performance.mark(`${featureName}-end`);
    performance.measure(featureName, `${featureName}-start`, `${featureName}-end`);
  }

  public getPerformanceScore(): number {
    const latest = this.metricsSubject.value[this.metricsSubject.value.length - 1];
    if (!latest) return 0;

    let score = 100;
    
    // LCP scoring (0-4s scale)
    if (latest.LCP) {
      if (latest.LCP > 4000) score -= 25;
      else if (latest.LCP > 2500) score -= 15;
      else if (latest.LCP > 1500) score -= 5;
    }
    
    // FID scoring (0-300ms scale)
    if (latest.FID) {
      if (latest.FID > 300) score -= 25;
      else if (latest.FID > 100) score -= 15;
      else if (latest.FID > 50) score -= 5;
    }
    
    // CLS scoring (0-0.25 scale)
    if (latest.CLS) {
      if (latest.CLS > 0.25) score -= 25;
      else if (latest.CLS > 0.1) score -= 15;
      else if (latest.CLS > 0.05) score -= 5;
    }

    return Math.max(0, score);
  }

  public exportMetrics(): any {
    return {
      metrics: this.metricsSubject.value,
      interactions: this.interactionSubject.value,
      errors: this.errorSubject.value,
      performanceScore: this.getPerformanceScore(),
      timestamp: Date.now()
    };
  }

  public clearMetrics(): void {
    this.metricsSubject.next([]);
    this.interactionSubject.next([]);
    this.errorSubject.next([]);
  }

  public destroy(): void {
    this.performanceObserver?.disconnect();
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }
}
