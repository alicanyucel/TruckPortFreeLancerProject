import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

export interface GrafanaDashboard {
  id: string;
  title: string;
  tags: string[];
  url: string;
  uid: string;
}

export interface MetricData {
  metric: string;
  value: number;
  timestamp: number;
  labels: { [key: string]: string };
}

export interface AlertRule {
  name: string;
  query: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

/**
 * Grafana Integration Service
 * Real-time analytics dashboard entegrasyonu
 * Grafana ve Prometheus ile business metrics tracking
 */
@Injectable({
  providedIn: 'root'
})
export class GrafanaIntegrationService {
  private readonly grafanaBaseUrl = environment.grafanaUrl || 'http://localhost:3000';
  private readonly prometheusUrl = environment.prometheusUrl || 'http://localhost:9090';
  
  private dashboardsSubject = new BehaviorSubject<GrafanaDashboard[]>([]);
  public dashboards$ = this.dashboardsSubject.asObservable();
  
  private metricsSubject = new BehaviorSubject<MetricData[]>([]);
  public metrics$ = this.metricsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeGrafanaDashboards();
    this.startMetricsCollection();
  }

  /**
   * Grafana dashboard'larını initialize et
   */
  private initializeGrafanaDashboards(): void {
    const defaultDashboards: GrafanaDashboard[] = [
      {
        id: 'truckport-overview',
        title: 'TruckPort Genel Bakış',
        tags: ['business', 'overview'],
        url: `${this.grafanaBaseUrl}/d/truckport-overview`,
        uid: 'truckport-overview'
      },
      {
        id: 'user-analytics',
        title: 'Kullanıcı Analitiği',
        tags: ['users', 'behavior'],
        url: `${this.grafanaBaseUrl}/d/user-analytics`,
        uid: 'user-analytics'
      },
      {
        id: 'performance-metrics',
        title: 'Performans Metrikleri',
        tags: ['performance', 'core-web-vitals'],
        url: `${this.grafanaBaseUrl}/d/performance-metrics`,
        uid: 'performance-metrics'
      },
      {
        id: 'business-kpis',
        title: 'İş KPI\'ları',
        tags: ['business', 'kpi'],
        url: `${this.grafanaBaseUrl}/d/business-kpis`,
        uid: 'business-kpis'
      }
    ];

    this.dashboardsSubject.next(defaultDashboards);
  }

  /**
   * Prometheus'tan metrics toplama başlat
   */
  private startMetricsCollection(): void {
    setInterval(() => {
      this.collectBusinessMetrics();
      this.collectPerformanceMetrics();
      this.collectUserMetrics();
    }, 30000); // Her 30 saniyede bir
  }

  /**
   * İş metriklerini topla
   */
  private collectBusinessMetrics(): void {
    const businessMetrics: MetricData[] = [
      {
        metric: 'truckport_active_users_total',
        value: this.generateRandomMetric(100, 500),
        timestamp: Date.now(),
        labels: { type: 'active_users' }
      },
      {
        metric: 'truckport_reservations_total',
        value: this.generateRandomMetric(50, 200),
        timestamp: Date.now(),
        labels: { type: 'reservations' }
      },
      {
        metric: 'truckport_truck_searches_total',
        value: this.generateRandomMetric(200, 800),
        timestamp: Date.now(),
        labels: { type: 'searches' }
      },
      {
        metric: 'truckport_revenue_eur',
        value: this.generateRandomMetric(1000, 5000),
        timestamp: Date.now(),
        labels: { type: 'revenue', currency: 'EUR' }
      }
    ];

    const currentMetrics = this.metricsSubject.value;
    this.metricsSubject.next([...currentMetrics, ...businessMetrics]);
  }

  /**
   * Performans metriklerini topla
   */
  private collectPerformanceMetrics(): void {
    const performanceMetrics: MetricData[] = [
      {
        metric: 'truckport_page_load_time_seconds',
        value: this.generateRandomMetric(1.2, 3.5),
        timestamp: Date.now(),
        labels: { page: 'home' }
      },
      {
        metric: 'truckport_api_response_time_seconds',
        value: this.generateRandomMetric(0.1, 1.0),
        timestamp: Date.now(),
        labels: { endpoint: '/api/trucks' }
      },
      {
        metric: 'truckport_error_rate_percent',
        value: this.generateRandomMetric(0.1, 5.0),
        timestamp: Date.now(),
        labels: { type: 'client_errors' }
      }
    ];

    const currentMetrics = this.metricsSubject.value;
    this.metricsSubject.next([...currentMetrics, ...performanceMetrics]);
  }

  /**
   * Kullanıcı metriklerini topla
   */
  private collectUserMetrics(): void {
    const userMetrics: MetricData[] = [
      {
        metric: 'truckport_user_sessions_total',
        value: this.generateRandomMetric(50, 300),
        timestamp: Date.now(),
        labels: { device: 'desktop' }
      },
      {
        metric: 'truckport_user_sessions_total',
        value: this.generateRandomMetric(30, 150),
        timestamp: Date.now(),
        labels: { device: 'mobile' }
      },
      {
        metric: 'truckport_conversion_rate_percent',
        value: this.generateRandomMetric(2.5, 8.0),
        timestamp: Date.now(),
        labels: { funnel: 'registration' }
      }
    ];

    const currentMetrics = this.metricsSubject.value;
    this.metricsSubject.next([...currentMetrics, ...userMetrics]);
  }

  /**
   * Grafana dashboard'ları getir
   */
  getDashboards(): Observable<GrafanaDashboard[]> {
    return this.dashboards$;
  }

  /**
   * Belirli bir dashboard'u aç
   */
  openDashboard(dashboardId: string): void {
    const dashboard = this.dashboardsSubject.value.find(d => d.id === dashboardId);
    if (dashboard) {
      window.open(dashboard.url, '_blank');
    }
  }

  /**
   * Real-time metrics getir
   */
  getMetrics(): Observable<MetricData[]> {
    return this.metrics$;
  }

  /**
   * Prometheus'a custom metric gönder
   */
  sendMetricToPrometheus(metric: MetricData): Observable<any> {
    const prometheusFormat = `${metric.metric}{${this.formatLabels(metric.labels)}} ${metric.value} ${metric.timestamp}`;
    
    return this.http.post(`${this.prometheusUrl}/api/v1/write`, prometheusFormat, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  /**
   * Alert rule'ları konfigüre et
   */
  configureAlertRules(): AlertRule[] {
    return [
      {
        name: 'Yüksek Hata Oranı',
        query: 'rate(truckport_error_rate_percent[5m]) > 5',
        condition: 'gt',
        threshold: 5,
        severity: 'high',
        enabled: true
      },
      {
        name: 'Düşük Kullanıcı Aktivitesi',
        query: 'truckport_active_users_total < 50',
        condition: 'lt',
        threshold: 50,
        severity: 'medium',
        enabled: true
      },
      {
        name: 'Yavaş Sayfa Yüklenme',
        query: 'avg(truckport_page_load_time_seconds) > 3',
        condition: 'gt',
        threshold: 3,
        severity: 'medium',
        enabled: true
      },
      {
        name: 'Kritik API Hatası',
        query: 'rate(truckport_api_errors_total[1m]) > 10',
        condition: 'gt',
        threshold: 10,
        severity: 'critical',
        enabled: true
      }
    ];
  }

  /**
   * Dashboard embed URL'i oluştur
   */
  getDashboardEmbedUrl(dashboardId: string, panelId?: number): string {
    const dashboard = this.dashboardsSubject.value.find(d => d.id === dashboardId);
    if (!dashboard) return '';

    let embedUrl = `${dashboard.url}?embed=true&theme=light`;
    if (panelId) {
      embedUrl += `&panelId=${panelId}`;
    }
    
    return embedUrl;
  }

  /**
   * Metric labels'ı formatla
   */
  private formatLabels(labels: { [key: string]: string }): string {
    return Object.entries(labels)
      .map(([key, value]) => `${key}="${value}"`)
      .join(',');
  }

  /**
   * Random metric değeri üret (demo için)
   */
  private generateRandomMetric(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Grafana annotation oluştur
   */
  createAnnotation(title: string, text: string, tags: string[] = []): Observable<any> {
    const annotation = {
      title,
      text,
      tags,
      time: Date.now(),
      timeEnd: Date.now()
    };

    return this.http.post(`${this.grafanaBaseUrl}/api/annotations`, annotation);
  }

  /**
   * Business dashboard'u için KPI'ları hesapla
   */
  calculateBusinessKPIs(): { [key: string]: number } {
    const currentMetrics = this.metricsSubject.value;
    
    return {
      activeUsers: this.getLatestMetricValue('truckport_active_users_total'),
      totalReservations: this.getLatestMetricValue('truckport_reservations_total'),
      searchVolume: this.getLatestMetricValue('truckport_truck_searches_total'),
      revenue: this.getLatestMetricValue('truckport_revenue_eur'),
      conversionRate: this.getLatestMetricValue('truckport_conversion_rate_percent'),
      avgPageLoadTime: this.getLatestMetricValue('truckport_page_load_time_seconds'),
      errorRate: this.getLatestMetricValue('truckport_error_rate_percent')
    };
  }

  /**
   * En son metric değerini getir
   */
  private getLatestMetricValue(metricName: string): number {
    const currentMetrics = this.metricsSubject.value;
    const matchingMetrics = currentMetrics.filter(m => m.metric === metricName);
    
    if (matchingMetrics.length === 0) return 0;
    
    return matchingMetrics[matchingMetrics.length - 1].value;
  }
}
