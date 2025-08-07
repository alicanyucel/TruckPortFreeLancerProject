import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

export interface PredictionModel {
  id: string;
  name: string;
  type: 'route_optimization' | 'demand_forecasting' | 'user_behavior' | 'maintenance_prediction';
  accuracy: number;
  lastTrained: Date;
  version: string;
  status: 'active' | 'training' | 'inactive';
}

export interface RouteOptimization {
  routeId: string;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  distance: number;
  duration: number;
  fuelSavings: number;
  waypoints: Array<{ lat: number; lng: number }>;
  optimizedRoute: Array<{ lat: number; lng: number }>;
  estimatedTime: number;
  estimatedFuel: number;
  confidenceScore: number;
  trafficFactors: string[];
}

export interface DemandForecast {
  region: string;
  date: Date;
  predictedDemand: number;
  confidence: number;
  factors: Array<{ factor: string; impact: number }>;
  seasonality: number;
}

export interface UserBehaviorPrediction {
  userId: string;
  nextActions: Array<{
    action: string;
    probability: number;
    timeframe: string;
  }>;
  churnRisk: number;
  lifetimeValue: number;
  recommendations: string[];
}

export interface MaintenancePrediction {
  truckId: string;
  component: string;
  maintenanceDate: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  costEstimate: number;
  recommendedActions: string[];
}

/**
 * AI/ML Integration Service
 * Predictive analytics ve machine learning entegrasyonu
 * Route optimization, demand forecasting, user behavior prediction
 */
@Injectable({
  providedIn: 'root'
})
export class AIMLIntegrationService {
  private readonly mlApiBaseUrl = environment.apiUrl + 'ml/';
  
  private modelsSubject = new BehaviorSubject<PredictionModel[]>([]);
  public models$ = this.modelsSubject.asObservable();
  
  private predictionsSubject = new BehaviorSubject<any[]>([]);
  public predictions$ = this.predictionsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeMLModels();
    this.startModelMonitoring();
  }

  /**
   * ML modellerini initialize et
   */
  private initializeMLModels(): void {
    const defaultModels: PredictionModel[] = [
      {
        id: 'route-optimizer-v2',
        name: 'Akıllı Rota Optimizasyonu',
        type: 'route_optimization',
        accuracy: 0.94,
        lastTrained: new Date('2025-08-01'),
        version: '2.1.0',
        status: 'active'
      },
      {
        id: 'demand-forecaster-v1',
        name: 'Talep Tahmin Modeli',
        type: 'demand_forecasting',
        accuracy: 0.87,
        lastTrained: new Date('2025-07-25'),
        version: '1.3.2',
        status: 'active'
      },
      {
        id: 'user-behavior-analyzer-v3',
        name: 'Kullanıcı Davranış Analizi',
        type: 'user_behavior',
        accuracy: 0.91,
        lastTrained: new Date('2025-08-05'),
        version: '3.0.1',
        status: 'active'
      },
      {
        id: 'maintenance-predictor-v1',
        name: 'Bakım Tahmin Sistemi',
        type: 'maintenance_prediction',
        accuracy: 0.89,
        lastTrained: new Date('2025-07-30'),
        version: '1.2.0',
        status: 'training'
      }
    ];

    this.modelsSubject.next(defaultModels);
  }

  /**
   * Model performansını izleme başlat
   */
  private startModelMonitoring(): void {
    setInterval(() => {
      this.monitorModelPerformance();
      this.updateModelMetrics();
    }, 60000); // Her dakika kontrol et
  }

  /**
   * Rota optimizasyonu yap
   */
  optimizeRoute(
    origin: { lat: number; lng: number }, 
    destination: { lat: number; lng: number },
    truckSpecs?: any
  ): Observable<RouteOptimization> {
    const requestPayload = {
      origin,
      destination,
      truckSpecs,
      timestamp: Date.now(),
      includeTraffic: true,
      optimizeFor: ['time', 'fuel', 'safety']
    };

    return this.http.post<RouteOptimization>(
      `${this.mlApiBaseUrl}route/optimize`, 
      requestPayload
    );
  }

  /**
   * Talep tahmini yap
   */
  forecastDemand(
    region: string, 
    timeframe: string = '7d',
    includeSeasonality: boolean = true
  ): Observable<DemandForecast[]> {
    const requestPayload = {
      region,
      timeframe,
      includeSeasonality,
      factors: ['weather', 'events', 'economic_indicators'],
      granularity: 'daily'
    };

    return this.http.post<DemandForecast[]>(
      `${this.mlApiBaseUrl}demand/forecast`, 
      requestPayload
    );
  }

  /**
   * Kullanıcı davranış tahmini
   */
  predictUserBehavior(userId: string): Observable<UserBehaviorPrediction> {
    const requestPayload = {
      userId,
      includeChurnRisk: true,
      includeLTV: true,
      timeHorizon: '30d',
      features: ['browsing_history', 'transaction_history', 'session_data']
    };

    return this.http.post<UserBehaviorPrediction>(
      `${this.mlApiBaseUrl}user/predict`, 
      requestPayload
    );
  }

  /**
   * Bakım tahmini yap
   */
  predictMaintenance(truckId: string): Observable<MaintenancePrediction[]> {
    const requestPayload = {
      truckId,
      components: ['engine', 'brakes', 'tires', 'transmission'],
      timeHorizon: '90d',
      includeInSufficialLearning: true
    };

    return this.http.post<MaintenancePrediction[]>(
      `${this.mlApiBaseUrl}maintenance/predict`, 
      requestPayload
    );
  }

  /**
   * Toplu kullanıcı segmentasyonu
   */
  segmentUsers(): Observable<any> {
    const requestPayload = {
      algorithm: 'k-means',
      features: ['usage_frequency', 'transaction_value', 'engagement_score'],
      numberOfSegments: 5,
      includeProfileSummary: true
    };

    return this.http.post(
      `${this.mlApiBaseUrl}users/segment`, 
      requestPayload
    );
  }

  /**
   * Fraud detection
   */
  detectFraud(transactionData: any): Observable<any> {
    const requestPayload = {
      ...transactionData,
      modelVersion: 'fraud-detector-v2.1',
      features: ['amount', 'location', 'time', 'user_behavior', 'device']
    };

    return this.http.post(
      `${this.mlApiBaseUrl}fraud/detect`, 
      requestPayload
    );
  }

  /**
   * Dinamik fiyatlandırma önerisi
   */
  suggestPricing(serviceData: any): Observable<any> {
    const requestPayload = {
      ...serviceData,
      factors: ['demand', 'supply', 'competition', 'seasonality', 'market_conditions'],
      strategy: 'profit_maximization',
      constraints: {
        minMargin: 0.15,
        maxIncrease: 0.25
      }
    };

    return this.http.post(
      `${this.mlApiBaseUrl}pricing/suggest`, 
      requestPayload
    );
  }

  /**
   * Inventory optimization
   */
  optimizeInventory(warehouseData: any): Observable<any> {
    const requestPayload = {
      ...warehouseData,
      optimizationGoal: 'minimize_cost',
      constraints: ['storage_capacity', 'budget', 'service_level'],
      timeHorizon: '30d'
    };

    return this.http.post(
      `${this.mlApiBaseUrl}inventory/optimize`, 
      requestPayload
    );
  }

  /**
   * Model performansını izle
   */
  private monitorModelPerformance(): void {
    this.models$.subscribe(models => {
      models.forEach(model => {
        if (model.status === 'active') {
          this.checkModelDrift(model);
          this.validateModelAccuracy(model);
        }
      });
    });
  }

  /**
   * Model drift kontrolü
   */
  private checkModelDrift(model: PredictionModel): void {
    // Model drift detection logic
    const driftThreshold = 0.05;
    const currentAccuracy = this.getCurrentModelAccuracy(model.id);
    
    if (Math.abs(currentAccuracy - model.accuracy) > driftThreshold) {
      console.warn(`Model drift detected for ${model.name}. Retraining recommended.`);
      this.scheduleModelRetraining(model.id);
    }
  }

  /**
   * Model doğruluğunu validate et
   */
  private validateModelAccuracy(model: PredictionModel): void {
    const minimumAccuracy = 0.80;
    
    if (model.accuracy < minimumAccuracy) {
      console.error(`Model ${model.name} accuracy below threshold. Immediate retraining required.`);
      this.flagModelForRetraining(model.id);
    }
  }

  /**
   * Mevcut model doğruluğunu getir
   */
  private getCurrentModelAccuracy(modelId: string): number {
    // Simulated accuracy calculation
    return 0.92 + (Math.random() - 0.5) * 0.1;
  }

  /**
   * Model yeniden eğitimini planla
   */
  private scheduleModelRetraining(modelId: string): void {
    this.http.post(`${this.mlApiBaseUrl}models/${modelId}/retrain`, {
      priority: 'high',
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 saat sonra
    }).subscribe();
  }

  /**
   * Model'i yeniden eğitim için işaretle
   */
  private flagModelForRetraining(modelId: string): void {
    const models = this.modelsSubject.value;
    const updatedModels = models.map(model => 
      model.id === modelId 
        ? { ...model, status: 'training' as const }
        : model
    );
    this.modelsSubject.next(updatedModels);
  }

  /**
   * Model metriklerini güncelle
   */
  private updateModelMetrics(): void {
    // Update model metrics periodically
    const models = this.modelsSubject.value;
    const updatedModels = models.map(model => ({
      ...model,
      accuracy: this.getCurrentModelAccuracy(model.id)
    }));
    this.modelsSubject.next(updatedModels);
  }

  /**
   * A/B test için model karşılaştırması
   */
  compareModels(modelA: string, modelB: string, testData: any): Observable<any> {
    const requestPayload = {
      modelA,
      modelB,
      testData,
      metrics: ['accuracy', 'precision', 'recall', 'f1_score', 'latency'],
      sampleSize: 1000
    };

    return this.http.post(
      `${this.mlApiBaseUrl}models/compare`, 
      requestPayload
    );
  }

  /**
   * Feature importance analizi
   */
  analyzeFeatureImportance(modelId: string): Observable<any> {
    return this.http.get(
      `${this.mlApiBaseUrl}models/${modelId}/feature-importance`
    );
  }

  /**
   * Model explanation (SHAP values)
   */
  explainPrediction(modelId: string, inputData: any): Observable<any> {
    const requestPayload = {
      inputData,
      explanationType: 'shap',
      includeFeatureImportance: true
    };

    return this.http.post(
      `${this.mlApiBaseUrl}models/${modelId}/explain`, 
      requestPayload
    );
  }

  /**
   * Automated ML pipeline tetikle
   */
  triggerAutoML(datasetId: string, task: string): Observable<any> {
    const requestPayload = {
      datasetId,
      task, // 'classification', 'regression', 'clustering'
      autoFeatureEngineering: true,
      hyperparameterTuning: true,
      modelSelection: true,
      maxTrainingTime: '2h'
    };

    return this.http.post(
      `${this.mlApiBaseUrl}automl/start`, 
      requestPayload
    );
  }

  /**
   * Model deployment
   */
  deployModel(modelId: string, environment: string = 'production'): Observable<any> {
    const requestPayload = {
      modelId,
      environment,
      scalingConfig: {
        minInstances: 2,
        maxInstances: 10,
        targetCPU: 70
      },
      monitoringEnabled: true
    };

    return this.http.post(
      `${this.mlApiBaseUrl}models/${modelId}/deploy`, 
      requestPayload
    );
  }

  /**
   * ML modelleri listesi getir
   */
  getModels(): Observable<PredictionModel[]> {
    return this.models$;
  }

  /**
   * Model detaylarını getir
   */
  getModelDetails(modelId: string): Observable<any> {
    return this.http.get(`${this.mlApiBaseUrl}models/${modelId}`);
  }

  /**
   * Prediction history getir
   */
  getPredictionHistory(modelId: string, limit: number = 100): Observable<any> {
    return this.http.get(`${this.mlApiBaseUrl}models/${modelId}/predictions?limit=${limit}`);
  }
}
