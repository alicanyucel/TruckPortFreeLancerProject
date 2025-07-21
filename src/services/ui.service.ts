import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingTasks: Set<string> = new Set();

  loading$ = this.loadingSubject.asObservable();

  startLoading(taskId: string = 'default'): void {
    this.loadingTasks.add(taskId);
    this.updateLoadingState();
  }

  stopLoading(taskId: string = 'default'): void {
    this.loadingTasks.delete(taskId);
    this.updateLoadingState();
  }

  private updateLoadingState(): void {
    this.loadingSubject.next(this.loadingTasks.size > 0);
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}

// Global Loading Component
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  
  notifications$ = this.notifications.asObservable();

  showSuccess(message: string, duration: number = 3000): void {
    this.showNotification({
      type: 'success',
      message,
      duration
    });
  }

  showError(message: string, duration: number = 5000): void {
    this.showNotification({
      type: 'error',
      message,
      duration
    });
  }

  showWarning(message: string, duration: number = 4000): void {
    this.showNotification({
      type: 'warning',
      message,
      duration
    });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.showNotification({
      type: 'info',
      message,
      duration
    });
  }

  private showNotification(notification: Notification): void {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    const current = this.notifications.value;
    this.notifications.next([...current, newNotification]);

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(id);
      }, notification.duration);
    }
  }

  removeNotification(id: string): void {
    const current = this.notifications.value;
    this.notifications.next(current.filter(n => n.id !== id));
  }
}

interface Notification {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
