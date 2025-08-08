import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  apiCalls: number;
  errors: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitorService {
  private metricsSubject = new BehaviorSubject<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    apiCalls: 0,
    errors: 0
  });

  public metrics$ = this.metricsSubject.asObservable();
  private startTime = performance.now();
  private componentCounter = 0;
  private apiCallCounter = 0;
  private errorCounter = 0;

  constructor() {
    this.initializeMonitoring();
    this.startMemoryMonitoring();
  }

  markPageLoad(): void {
    const loadTime = performance.now() - this.startTime;
    this.updateMetrics({ loadTime });
  }

  markRenderStart(): number {
    return performance.now();
  }

  markRenderEnd(startTime: number): void {
    const renderTime = performance.now() - startTime;
    this.updateMetrics({ renderTime });
  }

  incrementComponentCount(): void {
    this.componentCounter++;
    this.updateMetrics({ componentCount: this.componentCounter });
  }

  decrementComponentCount(): void {
    this.componentCounter--;
    this.updateMetrics({ componentCount: this.componentCounter });
  }

  recordApiCall(): void {
    this.apiCallCounter++;
    this.updateMetrics({ apiCalls: this.apiCallCounter });
  }

  recordError(): void {
    this.errorCounter++;
    this.updateMetrics({ errors: this.errorCounter });
  }

  getMetrics(): PerformanceMetrics {
    return this.metricsSubject.value;
  }

  resetMetrics(): void {
    this.componentCounter = 0;
    this.apiCallCounter = 0;
    this.errorCounter = 0;
    this.startTime = performance.now();

    this.metricsSubject.next({
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      componentCount: 0,
      apiCalls: 0,
      errors: 0
    });
  }

  getPerformanceStatus(): Observable<'good' | 'warning' | 'critical'> {
    return this.metrics$.pipe(
      map(metrics => {
        if (metrics.loadTime > 3000 || metrics.renderTime > 100 || metrics.memoryUsage > 50) {
          return 'critical' as 'good' | 'warning' | 'critical';
        } else if (metrics.loadTime > 1500 || metrics.renderTime > 50 || metrics.memoryUsage > 25) {
          return 'warning' as 'good' | 'warning' | 'critical';
        }
        return 'good' as 'good' | 'warning' | 'critical';
      }),
      distinctUntilChanged()
    );
  }

  private updateMetrics(partialMetrics: Partial<PerformanceMetrics>): void {
    const currentMetrics = this.metricsSubject.value;
    this.metricsSubject.next({ ...currentMetrics, ...partialMetrics });
  }

  private initializeMonitoring(): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.markPageLoad();
        }, 0);
      });
    }
  }

  private startMemoryMonitoring(): void {
    if (typeof window !== 'undefined' && (window.performance as any).memory) {
      interval(5000).subscribe(() => {
        const memory = (window.performance as any).memory;
        const memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        this.updateMetrics({ memoryUsage: Math.round(memoryUsage) });
      });
    }
  }
}
