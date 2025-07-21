import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Reservation {
  id: string;
  userId: string;
  planType: 'basic' | 'premium' | 'vip';
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  facilities: string[];
  specialRequests?: string;
  createdAt: Date;
}

export interface LoungeAvailability {
  date: string;
  basicSlots: number;
  premiumSlots: number;
  vipSlots: number;
  totalSlots: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoungeReservationService {
  private apiUrl = '/api/lounge';
  private reservationsSubject = new BehaviorSubject<Reservation[]>([]);
  public reservations$ = this.reservationsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadReservations();
  }

  // Get all reservations for current user
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations`).pipe(
      catchError(() => of(this.getMockReservations()))
    );
  }

  // Get availability for specific date range
  getAvailability(startDate: string, endDate: string): Observable<LoungeAvailability[]> {
    return this.http.get<LoungeAvailability[]>(`${this.apiUrl}/availability`, {
      params: { startDate, endDate }
    }).pipe(
      catchError(() => of(this.getMockAvailability()))
    );
  }

  // Create new reservation
  createReservation(reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>): Observable<Reservation> {
    const newReservation: Reservation = {
      ...reservation,
      id: this.generateId(),
      status: 'pending',
      createdAt: new Date()
    };

    return this.http.post<Reservation>(`${this.apiUrl}/reservations`, newReservation).pipe(
      catchError(() => {
        // Mock successful creation
        this.addReservationToLocal(newReservation);
        return of(newReservation);
      })
    );
  }

  // Update reservation
  updateReservation(id: string, updates: Partial<Reservation>): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/reservations/${id}`, updates).pipe(
      catchError(() => {
        const currentReservations = this.reservationsSubject.value;
        const updatedReservations = currentReservations.map(r => 
          r.id === id ? { ...r, ...updates } : r
        );
        this.reservationsSubject.next(updatedReservations);
        return of(updatedReservations.find(r => r.id === id)!);
      })
    );
  }

  // Cancel reservation
  cancelReservation(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/reservations/${id}`).pipe(
      catchError(() => {
        return this.updateReservation(id, { status: 'cancelled' }).pipe(
          map(() => true)
        );
      })
    );
  }

  // Get pricing for plan type
  getPricing(planType: 'basic' | 'premium' | 'vip', duration: number): Observable<number> {
    const pricing = {
      basic: 50,
      premium: 100,
      vip: 200
    };

    const basePrice = pricing[planType];
    const totalPrice = basePrice * duration;

    return of(totalPrice);
  }

  // Validate reservation availability
  validateReservation(planType: string, startDate: Date, endDate: Date): Observable<boolean> {
    return this.getAvailability(startDate.toISOString(), endDate.toISOString()).pipe(
      map(availability => {
        return availability.some(slot => {
          const slotDate = new Date(slot.date);
          return slotDate >= startDate && slotDate <= endDate && 
                 this.hasAvailableSlots(slot, planType);
        });
      })
    );
  }

  private hasAvailableSlots(availability: LoungeAvailability, planType: string): boolean {
    switch (planType) {
      case 'basic': return availability.basicSlots > 0;
      case 'premium': return availability.premiumSlots > 0;
      case 'vip': return availability.vipSlots > 0;
      default: return false;
    }
  }

  private loadReservations(): void {
    this.getReservations().subscribe(reservations => {
      this.reservationsSubject.next(reservations);
    });
  }

  private addReservationToLocal(reservation: Reservation): void {
    const currentReservations = this.reservationsSubject.value;
    this.reservationsSubject.next([...currentReservations, reservation]);
  }

  private generateId(): string {
    return 'res_' + Math.random().toString(36).substr(2, 9);
  }

  private getMockReservations(): Reservation[] {
    return [
      {
        id: 'res_001',
        userId: 'user_001',
        planType: 'premium',
        startDate: new Date('2025-07-25'),
        endDate: new Date('2025-07-26'),
        status: 'confirmed',
        totalPrice: 200,
        facilities: ['restaurant', 'wifi', 'shower'],
        createdAt: new Date('2025-07-20')
      }
    ];
  }

  private getMockAvailability(): LoungeAvailability[] {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        basicSlots: Math.floor(Math.random() * 10) + 5,
        premiumSlots: Math.floor(Math.random() * 5) + 2,
        vipSlots: Math.floor(Math.random() * 3) + 1,
        totalSlots: 20
      });
    }
    return dates;
  }
}
