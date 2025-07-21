import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StateManagementService } from './state-management.service';

describe('StateManagementService', () => {
  let service: StateManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateManagementService);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default state', () => {
    const state = service.getState();
    
    expect(state.user).toBeNull();
    expect(state.lounge.selectedPlan).toBeNull();
    expect(state.lounge.reservations).toEqual([]);
    expect(state.ui.loading).toBeFalse();
    expect(state.ui.theme).toBe('light');
  });

  it('should update state correctly', () => {
    const newState = {
      user: { id: 'user123', name: 'Test User' },
      ui: { loading: true, sidebarOpen: true, theme: 'dark' as const }
    };
    
    service.setState(newState);
    const state = service.getState();
    
    expect(state.user).toEqual(newState.user);
    expect(state.ui.loading).toBe(true);
    expect(state.ui.theme).toBe('dark');
  });

  it('should update lounge state specifically', () => {
    const loungeState = {
      selectedPlan: 'premium',
      reservations: [{ id: 'res_1' }]
    };
    
    service.updateLoungeState(loungeState);
    const state = service.getState();
    
    expect(state.lounge.selectedPlan).toBe('premium');
    expect(state.lounge.reservations).toEqual([{ id: 'res_1' }]);
  });

  it('should manage notifications', () => {
    const notification = { id: 'notif_1', message: 'Test notification' };
    
    service.addNotification(notification);
    let state = service.getState();
    expect(state.notifications).toContain(notification);
    
    service.removeNotification('notif_1');
    state = service.getState();
    expect(state.notifications).not.toContain(notification);
  });

  it('should save and load state from localStorage', () => {
    const testState = {
      user: { id: 'user123' }
    };
    
    service.setState(testState);
    service.updateLoungeState({ selectedPlan: 'vip' });
    
    // Create new service instance to test loading
    const newService = new StateManagementService();
    const loadedState = newService.getState();
    
    expect(loadedState.user).toEqual(testState.user);
    expect(loadedState.lounge.selectedPlan).toBe('vip');
  });

  it('should clear state and localStorage', () => {
    service.setState({ user: { id: 'user123' } });
    
    service.clearState();
    const state = service.getState();
    
    expect(state.user).toBeNull();
    expect(localStorage.getItem('truckport_state')).toBeNull();
  });

  it('should emit state changes', (done) => {
    service.state$.subscribe(state => {
      if (state.user) {
        expect(state.user.id).toBe('user123');
        done();
      }
    });
    
    service.setState({ user: { id: 'user123' } });
  });
});
