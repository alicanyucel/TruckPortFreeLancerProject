import { ErrorHandler, Injectable } from '@angular/core';

export interface AppError {
  message: string;
  stack?: string;
  timestamp: Date;
  url?: string;
  userId?: string;
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  
  handleError(error: any): void {
    const appError: AppError = {
      message: error.message || 'An unexpected error occurred',
      stack: error.stack,
      timestamp: new Date(),
      url: window.location.href
    };

    // Log to console in development
    if (!this.isProduction()) {
      console.error('Global Error:', appError);
    }

    // Send to logging service in production
    this.logError(appError);

    // Show user-friendly notification
    this.showErrorNotification(appError.message);
  }

  private isProduction(): boolean {
    return window.location.hostname !== 'localhost';
  }

  private logError(error: AppError): void {
    // In production, send to external logging service
    // Example: Sentry, LogRocket, etc.
    if (this.isProduction()) {
      // this.loggerService.logError(error);
    }
  }

  private showErrorNotification(message: string): void {
    // Show user-friendly error message
    // Could integrate with a toast/notification service
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = 'Bir hata oluştu. Lütfen tekrar deneyin.';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 16px;
      border-radius: 4px;
      z-index: 10000;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
}
