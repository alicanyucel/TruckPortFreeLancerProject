import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, interval, fromEvent } from 'rxjs';
import { map, filter, throttleTime, debounceTime } from 'rxjs/operators';

export interface BusinessMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: { [key: string]: string };
}

export interface UserFlow {
  sessionId: string;
  userId?: string;
  flowName: string;
  steps: UserFlowStep[];
  startTime: number;
  endTime?: number;
  completed: boolean;
  abandoned: boolean;
  abandonReason?: string;
}

export interface UserFlowStep {
  stepName: string;
  timestamp: number;
  duration?: number;
  data?: any;
  success: boolean;
  errorMessage?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  actions: AlertAction[];
}

export interface AlertAction {
  type: 'email' | 'webhook' | 'notification' | 'log';
  config: any;
}

@Injectable({
  providedIn: 'root'
})
export class ObservabilityService {
  private businessMetrics = new BehaviorSubject<BusinessMetric[]>([]);
  private userFlows = new BehaviorSubject<UserFlow[]>([]);
  private alerts = new BehaviorSubject<AlertRule[]>([]);
  private activeFlows = new Map<string, UserFlow>();
  
  public readonly businessMetrics$ = this.businessMetrics.asObservable();
  public readonly userFlows$ = this.userFlows.asObservable();
  public readonly alerts$ = this.alerts.asObservable();

  constructor(private ngZone: NgZone) {
    this.initializeBusinessMetricsTracking();
    this.initializeUserFlowTracking();
    this.initializeAlertSystem();
    this.setupRealTimeMonitoring();
  }

  // Business Metrics Tracking
  public trackBusinessMetric(name: string, value: number, unit: string = '', tags?: { [key: string]: string }): void {
    const metric: BusinessMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags
    };

    const current = this.businessMetrics.value;
    this.businessMetrics.next([...current.slice(-999), metric]); // Keep last 1000 metrics

    // Check alerts
    this.checkAlerts(metric);

    // Send to analytics service
    this.sendToAnalytics('business_metric', metric);
  }

  // User Flow Tracking
  public startUserFlow(flowName: string, userId?: string): string {
    const sessionId = this.generateSessionId();
    const userFlow: UserFlow = {
      sessionId,
      userId,
      flowName,
      steps: [],
      startTime: Date.now(),
      completed: false,
      abandoned: false
    };

    this.activeFlows.set(sessionId, userFlow);
    this.trackBusinessMetric('user_flow_started', 1, 'count', { flowName });

    return sessionId;
  }

  public trackUserFlowStep(sessionId: string, stepName: string, success: boolean = true, data?: any, errorMessage?: string): void {
    const flow = this.activeFlows.get(sessionId);
    if (!flow) {
      console.warn(`User flow not found: ${sessionId}`);
      return;
    }

    const step: UserFlowStep = {
      stepName,
      timestamp: Date.now(),
      success,
      data,
      errorMessage
    };

    // Calculate duration from previous step
    if (flow.steps.length > 0) {
      const previousStep = flow.steps[flow.steps.length - 1];
      step.duration = step.timestamp - previousStep.timestamp;
    } else {
      step.duration = step.timestamp - flow.startTime;
    }

    flow.steps.push(step);

    this.trackBusinessMetric('user_flow_step', 1, 'count', {
      flowName: flow.flowName,
      stepName,
      success: success.toString()
    });

    if (!success) {
      this.trackBusinessMetric('user_flow_error', 1, 'count', {
        flowName: flow.flowName,
        stepName,
        error: errorMessage || 'unknown'
      });
    }
  }

  public completeUserFlow(sessionId: string, success: boolean = true, abandonReason?: string): void {
    const flow = this.activeFlows.get(sessionId);
    if (!flow) {
      console.warn(`User flow not found: ${sessionId}`);
      return;
    }

    flow.endTime = Date.now();
    flow.completed = success;
    flow.abandoned = !success;
    flow.abandonReason = abandonReason;

    const totalDuration = flow.endTime - flow.startTime;

    this.trackBusinessMetric('user_flow_completed', 1, 'count', {
      flowName: flow.flowName,
      success: success.toString(),
      duration: totalDuration.toString()
    });

    if (success) {
      this.trackBusinessMetric('user_flow_conversion', 1, 'count', { flowName: flow.flowName });
      this.trackBusinessMetric('user_flow_duration', totalDuration, 'ms', { flowName: flow.flowName });
    } else {
      this.trackBusinessMetric('user_flow_abandonment', 1, 'count', {
        flowName: flow.flowName,
        reason: abandonReason || 'unknown'
      });
    }

    // Move to completed flows
    const current = this.userFlows.value;
    this.userFlows.next([...current.slice(-99), flow]); // Keep last 100 flows

    this.activeFlows.delete(sessionId);
    this.sendToAnalytics('user_flow_completed', flow);
  }

  // Real User Monitoring (RUM)
  private initializeBusinessMetricsTracking(): void {
    if (typeof window !== 'undefined') {
      // Track page views
      this.trackPageViews();
      
      // Track user interactions
      this.trackUserInteractions();
      
      // Track feature usage
      this.trackFeatureUsage();
      
      // Track conversion events
      this.trackConversionEvents();
    }
  }

  private trackPageViews(): void {
    // Track initial page view
    this.trackBusinessMetric('page_view', 1, 'count', {
      page: window.location.pathname,
      referrer: document.referrer || 'direct'
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.trackBusinessMetric('page_visible', 1, 'count', {
          page: window.location.pathname
        });
      } else {
        this.trackBusinessMetric('page_hidden', 1, 'count', {
          page: window.location.pathname
        });
      }
    });
  }

  private trackUserInteractions(): void {
    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target as Element;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.classList.contains('btn')) {
        const buttonText = target.textContent?.trim().substring(0, 50) || 'unknown';
        this.trackBusinessMetric('button_click', 1, 'count', {
          buttonText,
          page: window.location.pathname
        });
      }

      // Track link clicks
      if (target.tagName === 'A') {
        const href = (target as HTMLAnchorElement).href;
        const isExternal = href && !href.includes(window.location.hostname);
        
        this.trackBusinessMetric('link_click', 1, 'count', {
          href: href || 'unknown',
          external: isExternal.toString(),
          page: window.location.pathname
        });
      }
    }, { passive: true });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      const formName = form.name || form.id || 'unnamed';
      
      this.trackBusinessMetric('form_submit', 1, 'count', {
        formName,
        page: window.location.pathname
      });
    }, { passive: true });
  }

  private trackFeatureUsage(): void {
    // Track service worker usage
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'FEATURE_USAGE') {
          this.trackBusinessMetric('feature_usage', 1, 'count', {
            feature: event.data.feature,
            context: event.data.context || 'unknown'
          });
        }
      });
    }

    // Track PWA installation
    window.addEventListener('beforeinstallprompt', () => {
      this.trackBusinessMetric('pwa_install_prompt_shown', 1, 'count');
    });

    window.addEventListener('appinstalled', () => {
      this.trackBusinessMetric('pwa_installed', 1, 'count');
    });
  }

  private trackConversionEvents(): void {
    // Track truck search events
    this.trackCustomEvent('truck_search', 'search_performed');
    
    // Track lounge reservations
    this.trackCustomEvent('lounge_reservation', 'reservation_started');
    this.trackCustomEvent('lounge_reservation', 'reservation_completed');
    
    // Track service inquiries
    this.trackCustomEvent('service_inquiry', 'inquiry_submitted');
    
    // Track user registrations
    this.trackCustomEvent('user_registration', 'registration_started');
    this.trackCustomEvent('user_registration', 'registration_completed');
  }

  private trackCustomEvent(category: string, action: string): void {
    document.addEventListener(action, (event: any) => {
      this.trackBusinessMetric('conversion_event', 1, 'count', {
        category,
        action,
        page: window.location.pathname,
        ...event.detail
      });
    });
  }

  // User Flow Tracking Implementation
  private initializeUserFlowTracking(): void {
    // Auto-track common user flows
    this.setupAutoFlowTracking();
    
    // Track abandoned flows
    this.trackAbandonedFlows();
  }

  private setupAutoFlowTracking(): void {
    // Service inquiry flow
    this.autoTrackFlow('service_inquiry', [
      { selector: '[routerLink="/hizmetler"]', step: 'services_page_visit' },
      { selector: '.service-card', step: 'service_selected' },
      { selector: '.inquiry-form', step: 'inquiry_form_opened' },
      { selector: '.inquiry-submit', step: 'inquiry_submitted' }
    ]);

    // Truck search flow
    this.autoTrackFlow('truck_search', [
      { selector: '[routerLink="/truckstore"]', step: 'truckstore_visit' },
      { selector: '.search-form', step: 'search_initiated' },
      { selector: '.truck-card', step: 'truck_viewed' },
      { selector: '.contact-seller', step: 'seller_contacted' }
    ]);

    // User registration flow
    this.autoTrackFlow('user_registration', [
      { selector: '[routerLink="/uye-ol"]', step: 'registration_page_visit' },
      { selector: '.registration-form', step: 'form_started' },
      { selector: '.registration-submit', step: 'form_submitted' }
    ]);
  }

  private autoTrackFlow(flowName: string, steps: { selector: string; step: string }[]): void {
    let currentSessionId: string | null = null;

    steps.forEach((stepConfig, index) => {
      document.addEventListener('click', (event) => {
        const target = event.target as Element;
        if (target.matches(stepConfig.selector) || target.closest(stepConfig.selector)) {
          if (index === 0) {
            // Start new flow
            currentSessionId = this.startUserFlow(flowName);
          }
          
          if (currentSessionId) {
            this.trackUserFlowStep(currentSessionId, stepConfig.step);
            
            // Complete flow on last step
            if (index === steps.length - 1) {
              this.completeUserFlow(currentSessionId, true);
              currentSessionId = null;
            }
          }
        }
      }, { passive: true });
    });
  }

  private trackAbandonedFlows(): void {
    // Track page unload for active flows
    window.addEventListener('beforeunload', () => {
      this.activeFlows.forEach((flow, sessionId) => {
        this.completeUserFlow(sessionId, false, 'page_unload');
      });
    });

    // Track flows abandoned due to inactivity
    let lastActivity = Date.now();
    
    ['click', 'keypress', 'scroll', 'mousemove'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        lastActivity = Date.now();
      }, { passive: true });
    });

    // Check for inactive flows every 30 seconds
    setInterval(() => {
      const now = Date.now();
      const inactivityThreshold = 5 * 60 * 1000; // 5 minutes

      if (now - lastActivity > inactivityThreshold) {
        this.activeFlows.forEach((flow, sessionId) => {
          if (now - flow.startTime > inactivityThreshold) {
            this.completeUserFlow(sessionId, false, 'inactivity');
          }
        });
      }
    }, 30000);
  }

  // Alert System
  private initializeAlertSystem(): void {
    // Default alert rules
    const defaultAlerts: AlertRule[] = [
      {
        id: 'high_error_rate',
        name: 'High Error Rate',
        metric: 'user_flow_error',
        condition: 'gt',
        threshold: 10,
        severity: 'high',
        enabled: true,
        actions: [
          { type: 'notification', config: { title: 'High Error Rate Detected' } },
          { type: 'log', config: { level: 'error' } }
        ]
      },
      {
        id: 'low_conversion_rate',
        name: 'Low Conversion Rate',
        metric: 'user_flow_conversion',
        condition: 'lt',
        threshold: 5,
        severity: 'medium',
        enabled: true,
        actions: [
          { type: 'notification', config: { title: 'Conversion Rate Below Threshold' } }
        ]
      },
      {
        id: 'high_abandonment_rate',
        name: 'High Abandonment Rate',
        metric: 'user_flow_abandonment',
        condition: 'gt',
        threshold: 50,
        severity: 'high',
        enabled: true,
        actions: [
          { type: 'notification', config: { title: 'High Abandonment Rate' } },
          { type: 'webhook', config: { url: '/api/alerts/webhook' } }
        ]
      }
    ];

    this.alerts.next(defaultAlerts);
  }

  private checkAlerts(metric: BusinessMetric): void {
    const rules = this.alerts.value;
    
    rules.forEach(rule => {
      if (!rule.enabled || rule.metric !== metric.name) {
        return;
      }

      const shouldAlert = this.evaluateAlertCondition(metric.value, rule.condition, rule.threshold);
      
      if (shouldAlert) {
        this.triggerAlert(rule, metric);
      }
    });
  }

  private evaluateAlertCondition(value: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case 'gt': return value > threshold;
      case 'lt': return value < threshold;
      case 'eq': return value === threshold;
      case 'gte': return value >= threshold;
      case 'lte': return value <= threshold;
      default: return false;
    }
  }

  private triggerAlert(rule: AlertRule, metric: BusinessMetric): void {
    console.warn(`Alert triggered: ${rule.name}`, { rule, metric });

    rule.actions.forEach(action => {
      switch (action.type) {
        case 'notification':
          this.showNotification(action.config.title, `${rule.name}: ${metric.value}`);
          break;
        case 'webhook':
          this.sendWebhook(action.config.url, { rule, metric });
          break;
        case 'log':
          console.log(`Alert: ${rule.name}`, { rule, metric });
          break;
      }
    });

    // Track alert occurrence
    this.trackBusinessMetric('alert_triggered', 1, 'count', {
      alertId: rule.id,
      alertName: rule.name,
      severity: rule.severity
    });
  }

  // Real-time Monitoring
  private setupRealTimeMonitoring(): void {
    // Monitor performance metrics every 10 seconds
    interval(10000).subscribe(() => {
      this.collectPerformanceMetrics();
    });

    // Monitor memory usage every 30 seconds
    interval(30000).subscribe(() => {
      this.collectMemoryMetrics();
    });

    // Monitor user engagement every minute
    interval(60000).subscribe(() => {
      this.collectEngagementMetrics();
    });
  }

  private collectPerformanceMetrics(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.trackBusinessMetric('page_load_time', navigation.loadEventEnd - navigation.fetchStart, 'ms');
        this.trackBusinessMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'ms');
        this.trackBusinessMetric('time_to_first_byte', navigation.responseStart - navigation.requestStart, 'ms');
      }

      // Track resource timing
      const resources = performance.getEntriesByType('resource');
      if (resources.length > 0) {
        const totalResourceSize = resources.reduce((total, resource) => {
          return total + ((resource as any).transferSize || 0);
        }, 0);
        
        this.trackBusinessMetric('total_resource_size', totalResourceSize, 'bytes');
        this.trackBusinessMetric('resource_count', resources.length, 'count');
      }
    }
  }

  private collectMemoryMetrics(): void {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      
      this.trackBusinessMetric('js_heap_used', memory.usedJSHeapSize, 'bytes');
      this.trackBusinessMetric('js_heap_total', memory.totalJSHeapSize, 'bytes');
      this.trackBusinessMetric('js_heap_limit', memory.jsHeapSizeLimit, 'bytes');
      
      const memoryUsagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      this.trackBusinessMetric('memory_usage_percent', memoryUsagePercent, 'percent');
    }
  }

  private collectEngagementMetrics(): void {
    // Track session duration
    const sessionStart = parseInt(sessionStorage.getItem('sessionStart') || '0');
    if (sessionStart) {
      const sessionDuration = Date.now() - sessionStart;
      this.trackBusinessMetric('session_duration', sessionDuration, 'ms');
    } else {
      sessionStorage.setItem('sessionStart', Date.now().toString());
    }

    // Track active flows count
    this.trackBusinessMetric('active_flows_count', this.activeFlows.size, 'count');
  }

  // Utility Methods
  private generateSessionId(): string {
    return 'flow_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private sendToAnalytics(eventType: string, data: any): void {
    // Send to external analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventType, data);
    }
    
    // Send to internal analytics endpoint
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, data, timestamp: Date.now() })
    }).catch(error => {
      console.warn('Failed to send analytics data:', error);
    });
  }

  private showNotification(title: string, body: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }

  private sendWebhook(url: string, data: any): void {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(error => {
      console.warn('Failed to send webhook:', error);
    });
  }

  // Public API
  public getBusinessMetricsSummary(): any {
    const metrics = this.businessMetrics.value;
    const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
    
    const recentMetrics = metrics.filter(m => m.timestamp > last24Hours);
    
    return {
      totalMetrics: metrics.length,
      recentMetrics: recentMetrics.length,
      uniqueMetricNames: [...new Set(metrics.map(m => m.name))].length,
      topMetrics: this.getTopMetrics(recentMetrics, 5)
    };
  }

  public getActiveFlowsSummary(): any {
    return {
      activeFlows: this.activeFlows.size,
      flowsByType: this.groupFlowsByType(),
      averageFlowDuration: this.calculateAverageFlowDuration()
    };
  }

  private getTopMetrics(metrics: BusinessMetric[], limit: number): any[] {
    const metricCounts = metrics.reduce((acc, metric) => {
      acc[metric.name] = (acc[metric.name] || 0) + metric.value;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(metricCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([name, value]) => ({ name, value }));
  }

  private groupFlowsByType(): { [key: string]: number } {
    const flowsByType: { [key: string]: number } = {};
    
    this.activeFlows.forEach(flow => {
      flowsByType[flow.flowName] = (flowsByType[flow.flowName] || 0) + 1;
    });
    
    return flowsByType;
  }

  private calculateAverageFlowDuration(): number {
    const completedFlows = this.userFlows.value.filter(f => f.endTime);
    
    if (completedFlows.length === 0) return 0;
    
    const totalDuration = completedFlows.reduce((total, flow) => {
      return total + ((flow.endTime || 0) - flow.startTime);
    }, 0);
    
    return totalDuration / completedFlows.length;
  }
}
