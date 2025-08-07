import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface DomainEvent {
  id: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  data: any;
  eventData: any;
  eventVersion: number;
  timestamp: Date;
  userId?: string;
  metadata?: { [key: string]: any };
}

export interface Command {
  id: string;
  aggregateId: string;
  commandType: string;
  payload: any;
  userId: string;
  timestamp: Date;
  expectedVersion?: number;
}

export interface EventStream {
  aggregateId: string;
  aggregateType: string;
  events: DomainEvent[];
  version: number;
}

export interface Snapshot {
  aggregateId: string;
  aggregateType: string;
  data: any;
  version: number;
  timestamp: Date;
}

export interface Projection {
  id: string;
  name: string;
  lastUpdate: Date;
  position: number;
  eventTypes: string[];
  lastProcessedEvent: string;
  status: 'active' | 'paused' | 'rebuilding';
}

/**
 * Event Sourcing & CQRS Service
 * CQRS pattern ile event store implementasyonu
 * Domain events, commands, projections yönetimi
 */
@Injectable({
  providedIn: 'root'
})
export class EventSourcingService {
  private readonly eventStoreUrl = environment.apiUrl + 'eventstore/';
  
  private eventsSubject = new BehaviorSubject<DomainEvent[]>([]);
  public events$ = this.eventsSubject.asObservable();
  
  private commandsSubject = new Subject<Command>();
  public commands$ = this.commandsSubject.asObservable();
  
  private projectionsSubject = new BehaviorSubject<Projection[]>([]);
  public projections$ = this.projectionsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeEventStore();
    this.setupCommandHandlers();
    this.initializeProjections();
  }

  /**
   * Event Store'u initialize et
   */
  private initializeEventStore(): void {
    this.setupEventStreamSubscription();
    this.startEventReplay();
  }

  /**
   * Command'ları gönder
   */
  sendCommand(command: Command): Observable<any> {
    // Command validation
    this.validateCommand(command);
    
    // Command'ı subject'e publish et
    this.commandsSubject.next(command);
    
    // Command'ı event store'a gönder
    return this.http.post(`${this.eventStoreUrl}commands`, command);
  }

  /**
   * Event yayınla
   */
  publishEvent(event: DomainEvent): Observable<any> {
    // Event validation
    this.validateEvent(event);
    
    // Event'i local stream'e ekle
    const currentEvents = this.eventsSubject.value;
    this.eventsSubject.next([...currentEvents, event]);
    
    // Event'i event store'a kaydet
    return this.http.post(`${this.eventStoreUrl}events`, event);
  }

  /**
   * Aggregate için event stream getir
   */
  getEventStream(aggregateId: string, fromVersion?: number): Observable<EventStream> {
    let url = `${this.eventStoreUrl}streams/${aggregateId}`;
    if (fromVersion) {
      url += `?fromVersion=${fromVersion}`;
    }
    
    return this.http.get<EventStream>(url);
  }

  /**
   * Event history getir
   */
  getEventHistory(
    aggregateType?: string, 
    eventType?: string, 
    fromDate?: Date, 
    toDate?: Date,
    limit: number = 100
  ): Observable<DomainEvent[]> {
    let url = `${this.eventStoreUrl}events?limit=${limit}`;
    
    if (aggregateType) url += `&aggregateType=${aggregateType}`;
    if (eventType) url += `&eventType=${eventType}`;
    if (fromDate) url += `&fromDate=${fromDate.toISOString()}`;
    if (toDate) url += `&toDate=${toDate.toISOString()}`;
    
    return this.http.get<DomainEvent[]>(url);
  }

  /**
   * Snapshot oluştur
   */
  createSnapshot(aggregateId: string, aggregateType: string, data: any): Observable<any> {
    const snapshot: Snapshot = {
      aggregateId,
      aggregateType,
      data,
      version: this.getCurrentVersion(aggregateId),
      timestamp: new Date()
    };
    
    return this.http.post(`${this.eventStoreUrl}snapshots`, snapshot);
  }

  /**
   * Snapshot getir
   */
  getSnapshot(aggregateId: string): Observable<Snapshot> {
    return this.http.get<Snapshot>(`${this.eventStoreUrl}snapshots/${aggregateId}`);
  }

  /**
   * Aggregate'i rebuild et
   */
  rebuildAggregate(aggregateId: string, toVersion?: number): Observable<any> {
    return new Observable(observer => {
      this.getEventStream(aggregateId).subscribe(stream => {
        const eventsToApply = toVersion 
          ? stream.events.filter(e => e.eventVersion <= toVersion)
          : stream.events;
        
        const rebuiltAggregate = this.applyEventsToAggregate(aggregateId, eventsToApply);
        observer.next(rebuiltAggregate);
        observer.complete();
      });
    });
  }

  /**
   * Event replay yap
   */
  replayEvents(fromDate: Date, toDate: Date, aggregateType?: string): Observable<any> {
    const requestPayload = {
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      aggregateType,
      batchSize: 1000
    };
    
    return this.http.post(`${this.eventStoreUrl}replay`, requestPayload);
  }

  /**
   * Projection oluştur
   */
  createProjection(
    name: string, 
    eventTypes: string[], 
    projectionHandler: (event: DomainEvent) => void
  ): Observable<any> {
    const projection: Projection = {
      id: this.generateId(),
      name,
      lastUpdate: new Date(),
      position: 0,
      eventTypes,
      lastProcessedEvent: '',
      status: 'active'
    };
    
    // Local projection'ı kaydet
    const currentProjections = this.projectionsSubject.value;
    this.projectionsSubject.next([...currentProjections, projection]);
    
    // Event handler'ı subscribe et
    this.events$.subscribe(events => {
      const relevantEvents = events.filter(e => eventTypes.includes(e.eventType));
      relevantEvents.forEach(projectionHandler);
    });
    
    // Server'a projection'ı kaydet
    return this.http.post(`${this.eventStoreUrl}projections`, projection);
  }

  /**
   * Projection'ı yeniden build et
   */
  rebuildProjection(projectionId: string): Observable<any> {
    // Projection'ı rebuilding status'e al
    this.updateProjectionStatus(projectionId, 'rebuilding');
    
    return this.http.post(`${this.eventStoreUrl}projections/${projectionId}/rebuild`, {});
  }

  /**
   * Command handler'ları setup et
   */
  private setupCommandHandlers(): void {
    this.commands$.subscribe(command => {
      this.processCommand(command);
    });
  }

  /**
   * Command'ı işle
   */
  private processCommand(command: Command): void {
    switch (command.commandType) {
      case 'CreateTruck':
        this.handleCreateTruckCommand(command);
        break;
      case 'UpdateTruckLocation':
        this.handleUpdateTruckLocationCommand(command);
        break;
      case 'CreateReservation':
        this.handleCreateReservationCommand(command);
        break;
      case 'CancelReservation':
        this.handleCancelReservationCommand(command);
        break;
      default:
        console.warn(`Unhandled command type: ${command.commandType}`);
    }
  }

  /**
   * CreateTruck command'ını handle et
   */
  private handleCreateTruckCommand(command: Command): void {
    const event: DomainEvent = {
      id: this.generateId(),
      aggregateId: command.aggregateId,
      aggregateType: 'Truck',
      eventType: 'TruckCreated',
      data: command.payload,
      eventData: command.payload,
      eventVersion: 1,
      timestamp: new Date(),
      userId: command.userId
    };
    
    this.publishEvent(event).subscribe();
  }

  /**
   * UpdateTruckLocation command'ını handle et
   */
  private handleUpdateTruckLocationCommand(command: Command): void {
    const event: DomainEvent = {
      id: this.generateId(),
      aggregateId: command.aggregateId,
      aggregateType: 'Truck',
      eventType: 'TruckLocationUpdated',
      data: command.payload,
      eventData: command.payload,
      eventVersion: this.getNextVersion(command.aggregateId),
      timestamp: new Date(),
      userId: command.userId
    };
    
    this.publishEvent(event).subscribe();
  }

  /**
   * CreateReservation command'ını handle et
   */
  private handleCreateReservationCommand(command: Command): void {
    const event: DomainEvent = {
      id: this.generateId(),
      aggregateId: command.aggregateId,
      aggregateType: 'Reservation',
      eventType: 'ReservationCreated',
      data: command.payload,
      eventData: command.payload,
      eventVersion: 1,
      timestamp: new Date(),
      userId: command.userId
    };
    
    this.publishEvent(event).subscribe();
  }

  /**
   * CancelReservation command'ını handle et
   */
  private handleCancelReservationCommand(command: Command): void {
    const event: DomainEvent = {
      id: this.generateId(),
      aggregateId: command.aggregateId,
      aggregateType: 'Reservation',
      eventType: 'ReservationCancelled',
      data: command.payload,
      eventData: command.payload,
      eventVersion: this.getNextVersion(command.aggregateId),
      timestamp: new Date(),
      userId: command.userId
    };
    
    this.publishEvent(event).subscribe();
  }

  /**
   * Event stream subscription setup
   */
  private setupEventStreamSubscription(): void {
    // WebSocket veya Server-Sent Events ile real-time event stream
    if (environment.features.eventSourcing) {
      // const eventSource = new EventSource(`${this.eventStoreUrl}stream`);
      // eventSource.onmessage = (event) => {
      //   const domainEvent: DomainEvent = JSON.parse(event.data);
      //   const currentEvents = this.eventsSubject.value;
      //   this.eventsSubject.next([...currentEvents, domainEvent]);
      // };
    }
  }

  /**
   * Event replay başlat
   */
  private startEventReplay(): void {
    // Uygulama başlarken son events'leri replay et
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    this.getEventHistory(undefined, undefined, lastWeek, new Date(), 1000)
      .subscribe(events => {
        this.eventsSubject.next(events);
      });
  }

  /**
   * Projection'ları initialize et
   */
  private initializeProjections(): void {
    // Truck location projection
    this.createProjection(
      'TruckLocationProjection',
      ['TruckCreated', 'TruckLocationUpdated'],
      (event) => this.handleTruckLocationProjection(event)
    );
    
    // Reservation analytics projection
    this.createProjection(
      'ReservationAnalyticsProjection',
      ['ReservationCreated', 'ReservationCancelled', 'ReservationCompleted'],
      (event) => this.handleReservationAnalyticsProjection(event)
    );
    
    // User activity projection
    this.createProjection(
      'UserActivityProjection',
      ['UserLoggedIn', 'UserSearched', 'UserMadeReservation'],
      (event) => this.handleUserActivityProjection(event)
    );
  }

  /**
   * Truck location projection handler
   */
  private handleTruckLocationProjection(event: DomainEvent): void {
    if (event.eventType === 'TruckLocationUpdated') {
      // Update truck location in read model
      console.log(`Updating truck location for ${event.aggregateId}:`, event.eventData);
    }
  }

  /**
   * Reservation analytics projection handler
   */
  private handleReservationAnalyticsProjection(event: DomainEvent): void {
    // Update reservation analytics in read model
    console.log(`Processing reservation analytics for event ${event.eventType}:`, event.eventData);
  }

  /**
   * User activity projection handler
   */
  private handleUserActivityProjection(event: DomainEvent): void {
    // Update user activity analytics
    console.log(`Processing user activity for event ${event.eventType}:`, event.eventData);
  }

  /**
   * Event'leri aggregate'e uygula
   */
  private applyEventsToAggregate(aggregateId: string, events: DomainEvent[]): any {
    // Event sourcing - aggregate'i events'lerden rebuild et
    let aggregate: any = {};
    
    events.forEach(event => {
      aggregate = this.applyEventToAggregate(aggregate, event);
    });
    
    return aggregate;
  }

  /**
   * Tek event'i aggregate'e uygula
   */
  private applyEventToAggregate(aggregate: any, event: DomainEvent): any {
    switch (event.eventType) {
      case 'TruckCreated':
        return { ...aggregate, ...event.eventData, id: event.aggregateId };
      case 'TruckLocationUpdated':
        return { ...aggregate, location: event.eventData.location };
      case 'ReservationCreated':
        return { ...aggregate, ...event.eventData, id: event.aggregateId };
      case 'ReservationCancelled':
        return { ...aggregate, status: 'cancelled', cancelledAt: event.timestamp };
      default:
        return aggregate;
    }
  }

  /**
   * Command validation
   */
  private validateCommand(command: Command): void {
    if (!command.id || !command.aggregateId || !command.commandType) {
      throw new Error('Invalid command: missing required fields');
    }
  }

  /**
   * Event validation
   */
  private validateEvent(event: DomainEvent): void {
    if (!event.id || !event.aggregateId || !event.eventType) {
      throw new Error('Invalid event: missing required fields');
    }
  }

  /**
   * Mevcut version getir
   */
  private getCurrentVersion(aggregateId: string): number {
    const events = this.eventsSubject.value.filter(e => e.aggregateId === aggregateId);
    return events.length > 0 ? Math.max(...events.map(e => e.eventVersion)) : 0;
  }

  /**
   * Sonraki version getir
   */
  private getNextVersion(aggregateId: string): number {
    return this.getCurrentVersion(aggregateId) + 1;
  }

  /**
   * Projection status güncelle
   */
  private updateProjectionStatus(projectionId: string, status: Projection['status']): void {
    const projections = this.projectionsSubject.value;
    const updatedProjections = projections.map(p => 
      p.id === projectionId ? { ...p, status } : p
    );
    this.projectionsSubject.next(updatedProjections);
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
   * Event store statistics getir
   */
  getEventStoreStatistics(): Observable<any> {
    return this.http.get(`${this.eventStoreUrl}statistics`);
  }

  /**
   * Event store health check
   */
  healthCheck(): Observable<any> {
    return this.http.get(`${this.eventStoreUrl}health`);
  }

  /**
   * Event store backup oluştur
   */
  createBackup(): Observable<any> {
    return this.http.post(`${this.eventStoreUrl}backup`, {
      timestamp: new Date().toISOString(),
      includeSnapshots: true
    });
  }
}
