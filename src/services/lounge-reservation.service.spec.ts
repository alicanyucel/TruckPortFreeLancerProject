import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoungeReservationService, Reservation } from './lounge-reservation.service';

describe('LoungeReservationService', () => {
  let service: LoungeReservationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoungeReservationService]
    });
    service = TestBed.inject(LoungeReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get reservations with fallback to mock data', () => {
    service.getReservations().subscribe(reservations => {
      expect(reservations).toBeDefined();
      expect(Array.isArray(reservations)).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/lounge/reservations');
    expect(req.request.method).toBe('GET');
    
    // Simulate network error to test fallback
    req.error(new ErrorEvent('Network error'));
  });

  it('should get availability data', () => {
    const startDate = '2025-07-25';
    const endDate = '2025-07-26';
    
    service.getAvailability(startDate, endDate).subscribe(availability => {
      expect(availability).toBeDefined();
      expect(Array.isArray(availability)).toBeTruthy();
    });

    const req = httpMock.expectOne(`/api/lounge/availability?startDate=${startDate}&endDate=${endDate}`);
    expect(req.request.method).toBe('GET');
    
    // Simulate error to test mock fallback
    req.error(new ErrorEvent('API Error'));
  });

  it('should create reservation', () => {
    const reservationData = {
      userId: 'user123',
      planType: 'premium' as const,
      startDate: new Date('2025-07-25'),
      endDate: new Date('2025-07-26'),
      totalPrice: 200,
      facilities: ['restaurant', 'wifi']
    };

    service.createReservation(reservationData).subscribe(reservation => {
      expect(reservation).toBeDefined();
      expect(reservation.id).toBeDefined();
      expect(reservation.status).toBe('pending');
      expect(reservation.planType).toBe('premium');
    });

    const req = httpMock.expectOne('/api/lounge/reservations');
    expect(req.request.method).toBe('POST');
    
    // Simulate error to test local fallback
    req.error(new ErrorEvent('Create Error'));
  });

  it('should update reservation', () => {
    const reservationId = 'res_123';
    const updates = { status: 'confirmed' as const };

    service.updateReservation(reservationId, updates).subscribe(reservation => {
      expect(reservation).toBeDefined();
    });

    const req = httpMock.expectOne(`/api/lounge/reservations/${reservationId}`);
    expect(req.request.method).toBe('PUT');
    
    // Simulate error to test local fallback
    req.error(new ErrorEvent('Update Error'));
  });

  it('should cancel reservation', () => {
    const reservationId = 'res_123';

    service.cancelReservation(reservationId).subscribe(result => {
      expect(result).toBeTruthy();
    });

    const req = httpMock.expectOne(`/api/lounge/reservations/${reservationId}`);
    expect(req.request.method).toBe('DELETE');
    
    // Simulate error to test local fallback
    req.error(new ErrorEvent('Cancel Error'));
  });

  it('should calculate pricing correctly', () => {
    service.getPricing('basic', 3).subscribe(price => {
      expect(price).toBe(150); // 50 * 3
    });

    service.getPricing('premium', 2).subscribe(price => {
      expect(price).toBe(200); // 100 * 2
    });

    service.getPricing('vip', 1).subscribe(price => {
      expect(price).toBe(200); // 200 * 1
    });
  });

  it('should validate reservation availability', () => {
    const startDate = new Date('2025-07-25');
    const endDate = new Date('2025-07-26');

    service.validateReservation('premium', startDate, endDate).subscribe(isAvailable => {
      expect(typeof isAvailable).toBe('boolean');
    });

    const req = httpMock.expectOne(req => 
      req.url.includes('/api/lounge/availability') && 
      req.params.get('startDate') === startDate.toISOString() &&
      req.params.get('endDate') === endDate.toISOString()
    );
    
    // Simulate error to test mock fallback
    req.error(new ErrorEvent('Availability Error'));
  });

  it('should generate unique reservation IDs', () => {
    const id1 = service['generateId']();
    const id2 = service['generateId']();
    
    expect(id1).toMatch(/^res_[a-z0-9]{9}$/);
    expect(id2).toMatch(/^res_[a-z0-9]{9}$/);
    expect(id1).not.toBe(id2);
  });

  it('should emit reservations updates', (done) => {
    service.reservations$.subscribe(reservations => {
      if (reservations.length > 0) {
        expect(reservations[0]).toBeDefined();
        done();
      }
    });
    
    // Trigger initial load
    service['loadReservations']();
    
    const req = httpMock.expectOne('/api/lounge/reservations');
    req.error(new ErrorEvent('Load Error')); // This will use mock data
  });
});
