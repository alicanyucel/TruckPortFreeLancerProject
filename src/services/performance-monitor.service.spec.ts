import { TestBed } from '@angular/core/testing';
import { interval } from 'rxjs';
import { PerformanceMonitorService } from './performance-monitor.service';

describe('PerformanceMonitorService', () => {
  let service: PerformanceMonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerformanceMonitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default metrics', () => {
    const metrics = service.getMetrics();
    
    expect(metrics.loadTime).toBe(0);
    expect(metrics.renderTime).toBe(0);
    expect(metrics.componentCount).toBe(0);
    expect(metrics.apiCalls).toBe(0);
    expect(metrics.errors).toBe(0);
  });

  it('should track component lifecycle', () => {
    service.incrementComponentCount();
    service.incrementComponentCount();
    
    let metrics = service.getMetrics();
    expect(metrics.componentCount).toBe(2);
    
    service.decrementComponentCount();
    metrics = service.getMetrics();
    expect(metrics.componentCount).toBe(1);
  });

  it('should measure render time', () => {
    const startTime = service.markRenderStart();
    expect(typeof startTime).toBe('number');
    expect(startTime).toBeGreaterThan(0);
    
    // Simulate some processing time
    setTimeout(() => {
      service.markRenderEnd(startTime);
      const metrics = service.getMetrics();
      expect(metrics.renderTime).toBeGreaterThan(0);
    }, 10);
  });

  it('should track API calls', () => {
    service.recordApiCall();
    service.recordApiCall();
    service.recordApiCall();
    
    const metrics = service.getMetrics();
    expect(metrics.apiCalls).toBe(3);
  });

  it('should track errors', () => {
    service.recordError();
    service.recordError();
    
    const metrics = service.getMetrics();
    expect(metrics.errors).toBe(2);
  });

  it('should reset metrics', () => {
    service.incrementComponentCount();
    service.recordApiCall();
    service.recordError();
    
    service.resetMetrics();
    const metrics = service.getMetrics();
    
    expect(metrics.componentCount).toBe(0);
    expect(metrics.apiCalls).toBe(0);
    expect(metrics.errors).toBe(0);
    expect(metrics.loadTime).toBe(0);
    expect(metrics.renderTime).toBe(0);
  });

  it('should calculate performance status', (done) => {
    // Test good performance
    service.getPerformanceStatus().subscribe(status => {
      expect(status).toBe('good');
      done();
    });
  });

  it('should mark page load', () => {
    service.markPageLoad();
    const metrics = service.getMetrics();
    expect(metrics.loadTime).toBeGreaterThan(0);
  });

  it('should emit metrics updates', (done) => {
    service.metrics$.subscribe(metrics => {
      if (metrics.componentCount > 0) {
        expect(metrics.componentCount).toBe(1);
        done();
      }
    });
    
    service.incrementComponentCount();
  });
});
