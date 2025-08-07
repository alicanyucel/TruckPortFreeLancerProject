import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GrafanaIntegrationService, GrafanaDashboard, MetricData } from '../../services/grafana-integration.service';
import { AIMLIntegrationService, PredictionModel, RouteOptimization } from '../../services/aiml-integration.service';
import { EventSourcingService, DomainEvent, Projection } from '../../services/event-sourcing.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  // Grafana Integration
  dashboards$: Observable<GrafanaDashboard[]>;
  metrics$: Observable<MetricData[]>;
  businessKPIs: { [key: string]: number } = {};

  // AI/ML Integration
  mlModels$: Observable<PredictionModel[]>;
  routeOptimization: RouteOptimization | null = null;
  demandForecasts: any[] = [];

  // Event Sourcing
  events$: Observable<DomainEvent[]>;
  projections$: Observable<Projection[]>;
  eventStoreStats: any = {};

  // Dashboard State
  selectedTimeframe: string = '24h';
  isLoading: boolean = false;

  constructor(
    private grafanaService: GrafanaIntegrationService,
    private aimlService: AIMLIntegrationService,
    private eventSourcingService: EventSourcingService
  ) {
    this.dashboards$ = this.grafanaService.getDashboards();
    this.metrics$ = this.grafanaService.getMetrics();
    this.mlModels$ = this.aimlService.getModels();
    this.events$ = this.eventSourcingService.events$;
    this.projections$ = this.eventSourcingService.projections$;
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.setupRealtimeUpdates();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Dashboard verilerini yükle
   */
  private loadDashboardData(): void {
    this.isLoading = true;

    // Business KPI'ları hesapla
    this.businessKPIs = this.grafanaService.calculateBusinessKPIs();

    // Event store istatistiklerini getir
    const eventStatsSubscription = this.eventSourcingService.getEventStoreStatistics()
      .subscribe(stats => {
        this.eventStoreStats = stats;
      });

    this.subscriptions.add(eventStatsSubscription);

    // Demand forecasting yap
    const demandSubscription = this.aimlService.forecastDemand('istanbul', '7d')
      .subscribe(forecasts => {
        this.demandForecasts = forecasts;
      });

    this.subscriptions.add(demandSubscription);

    this.isLoading = false;
  }

  /**
   * Real-time güncellemeleri setup et
   */
  private setupRealtimeUpdates(): void {
    // Metrics'leri dinle
    const metricsSubscription = this.metrics$.subscribe(metrics => {
      this.updateMetricsCharts(metrics);
    });

    // Events'leri dinle
    const eventsSubscription = this.events$.subscribe(events => {
      this.updateEventTimeline(events.slice(-10)); // Son 10 event
    });

    this.subscriptions.add(metricsSubscription);
    this.subscriptions.add(eventsSubscription);
  }

  /**
   * Grafana dashboard'unu aç
   */
  openGrafanaDashboard(dashboardId: string): void {
    this.grafanaService.openDashboard(dashboardId);
  }

  /**
   * Rota optimizasyonu çalıştır
   */
  optimizeRoute(): void {
    const origin = { lat: 41.0082, lng: 28.9784 }; // Istanbul
    const destination = { lat: 39.9334, lng: 32.8597 }; // Ankara

    const optimizationSubscription = this.aimlService.optimizeRoute(origin, destination)
      .subscribe(optimization => {
        this.routeOptimization = optimization;
      });

    this.subscriptions.add(optimizationSubscription);
  }

  /**
   * ML modelini yeniden eğit
   */
  retrainModel(modelId: string): void {
    // Model retraining trigger
    console.log(`Retraining model: ${modelId}`);
    
    // Bu normalde API çağrısı olurdu
    // this.aimlService.retrainModel(modelId).subscribe();
  }

  /**
   * Event replay başlat
   */
  replayEvents(): void {
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const today = new Date();

    const replaySubscription = this.eventSourcingService.replayEvents(lastWeek, today)
      .subscribe(result => {
        console.log('Event replay completed:', result);
      });

    this.subscriptions.add(replaySubscription);
  }

  /**
   * Projection'ı rebuild et
   */
  rebuildProjection(projectionId: string): void {
    const rebuildSubscription = this.eventSourcingService.rebuildProjection(projectionId)
      .subscribe(result => {
        console.log(`Projection ${projectionId} rebuilt:`, result);
      });

    this.subscriptions.add(rebuildSubscription);
  }

  /**
   * Command gönder
   */
  sendCommand(commandType: string, aggregateId: string, payload: any): void {
    const command = {
      id: this.generateId(),
      aggregateId,
      commandType,
      payload,
      userId: 'admin',
      timestamp: new Date()
    };

    const commandSubscription = this.eventSourcingService.sendCommand(command)
      .subscribe(result => {
        console.log('Command sent:', result);
      });

    this.subscriptions.add(commandSubscription);
  }

  /**
   * AI model karşılaştırması yap
   */
  compareModels(): void {
    const modelA = 'route-optimizer-v2';
    const modelB = 'route-optimizer-v1';
    const testData = { /* test data */ };

    const comparisonSubscription = this.aimlService.compareModels(modelA, modelB, testData)
      .subscribe(comparison => {
        console.log('Model comparison:', comparison);
      });

    this.subscriptions.add(comparisonSubscription);
  }

  /**
   * Fraud detection çalıştır
   */
  runFraudDetection(): void {
    const transactionData = {
      amount: 1500,
      location: 'Istanbul',
      userId: 'user123',
      timestamp: new Date()
    };

    const fraudSubscription = this.aimlService.detectFraud(transactionData)
      .subscribe(result => {
        console.log('Fraud detection result:', result);
      });

    this.subscriptions.add(fraudSubscription);
  }

  /**
   * Event store backup oluştur
   */
  createEventStoreBackup(): void {
    const backupSubscription = this.eventSourcingService.createBackup()
      .subscribe(result => {
        console.log('Backup created:', result);
      });

    this.subscriptions.add(backupSubscription);
  }

  /**
   * Metrics charts'ları güncelle
   */
  private updateMetricsCharts(metrics: MetricData[]): void {
    // Chart.js veya başka bir charting library ile güncellemeler
    console.log('Updating metrics charts:', metrics.length, 'metrics');
  }

  /**
   * Event timeline'ını güncelle
   */
  private updateEventTimeline(recentEvents: DomainEvent[]): void {
    // Event timeline UI'ını güncelle
    console.log('Updating event timeline:', recentEvents.length, 'recent events');
  }

  /**
   * Timeframe değiştir
   */
  changeTimeframe(timeframe: string): void {
    this.selectedTimeframe = timeframe;
    this.loadDashboardData();
  }

  /**
   * Dashboard'u export et
   */
  exportDashboard(): void {
    const dashboardData = {
      businessKPIs: this.businessKPIs,
      eventStoreStats: this.eventStoreStats,
      demandForecasts: this.demandForecasts,
      routeOptimization: this.routeOptimization,
      timestamp: new Date()
    };

    // JSON olarak download et
    const blob = new Blob([JSON.stringify(dashboardData, null, 2)], 
      { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `truckport-dashboard-${Date.now()}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * ID generate et
   */
  private generateId(): string {
    return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Format number for display
   */
  formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  }

  /**
   * Get metric trend
   */
  getMetricTrend(metricName: string): 'up' | 'down' | 'stable' {
    // Simplified trend calculation
    return Math.random() > 0.5 ? 'up' : 'down';
  }

  /**
   * Get status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'green';
      case 'training': return 'orange';
      case 'inactive': return 'red';
      case 'rebuilding': return 'blue';
      default: return 'gray';
    }
  }
}
