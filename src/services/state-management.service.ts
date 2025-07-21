import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppState {
  user: any;
  lounge: {
    selectedPlan: string | null;
    reservations: any[];
    facilities: any[];
  };
  ui: {
    loading: boolean;
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
  };
  notifications: any[];
}

@Injectable({
  providedIn: 'root'
})
export class StateManagementService {
  private initialState: AppState = {
    user: null,
    lounge: {
      selectedPlan: null,
      reservations: [],
      facilities: []
    },
    ui: {
      loading: false,
      sidebarOpen: false,
      theme: 'light'
    },
    notifications: []
  };

  private stateSubject = new BehaviorSubject<AppState>(this.initialState);
  public state$ = this.stateSubject.asObservable();

  constructor() {
    // Load state from localStorage on init
    this.loadStateFromStorage();
  }

  getState(): AppState {
    return this.stateSubject.value;
  }

  setState(newState: Partial<AppState>): void {
    const currentState = this.getState();
    const updatedState = { ...currentState, ...newState };
    this.stateSubject.next(updatedState);
    this.saveStateToStorage(updatedState);
  }

  updateLoungeState(loungeState: Partial<AppState['lounge']>): void {
    const currentState = this.getState();
    this.setState({
      lounge: { ...currentState.lounge, ...loungeState }
    });
  }

  updateUIState(uiState: Partial<AppState['ui']>): void {
    const currentState = this.getState();
    this.setState({
      ui: { ...currentState.ui, ...uiState }
    });
  }

  addNotification(notification: any): void {
    const currentState = this.getState();
    this.setState({
      notifications: [...currentState.notifications, notification]
    });
  }

  removeNotification(id: string): void {
    const currentState = this.getState();
    this.setState({
      notifications: currentState.notifications.filter(n => n.id !== id)
    });
  }

  clearState(): void {
    this.stateSubject.next(this.initialState);
    localStorage.removeItem('truckport_state');
  }

  private saveStateToStorage(state: AppState): void {
    try {
      localStorage.setItem('truckport_state', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }

  private loadStateFromStorage(): void {
    try {
      const savedState = localStorage.getItem('truckport_state');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        this.stateSubject.next({ ...this.initialState, ...parsedState });
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
    }
  }
}
