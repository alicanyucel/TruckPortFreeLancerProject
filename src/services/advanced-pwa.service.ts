import { Injectable } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { take, filter } from 'rxjs/operators';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  silent?: boolean;
  timestamp?: number;
}

export interface UpdateAvailableEvent {
  type: 'UPDATE_AVAILABLE';
  current: { hash: string; appData?: object };
  available: { hash: string; appData?: object };
}

export interface BackgroundSyncTask {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedPWAService {
  private readonly VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY'; // Replace with actual key
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  private updateAvailableSubject = new BehaviorSubject<boolean>(false);
  private installPromptSubject = new BehaviorSubject<any>(null);
  private backgroundSyncTasks: BackgroundSyncTask[] = [];
  
  public readonly isOnline$ = this.isOnlineSubject.asObservable();
  public readonly updateAvailable$ = this.updateAvailableSubject.asObservable();
  public readonly installPrompt$ = this.installPromptSubject.asObservable();

  constructor(
    private swUpdate: SwUpdate,
    private swPush: SwPush
  ) {
    this.initializeServiceWorker();
    this.setupNetworkDetection();
    this.setupInstallPrompt();
    this.setupBackgroundSync();
  }

  private initializeServiceWorker(): void {
    if (this.swUpdate.isEnabled) {
      // Check for updates every 30 minutes
      interval(30 * 60 * 1000).subscribe(() => {
        this.checkForUpdates();
      });

      // Handle available updates
      this.swUpdate.available.subscribe((event: any) => {
        console.log('Update available:', event);
        this.updateAvailableSubject.next(true);
        this.showUpdateNotification(event);
      });

      // Handle activated updates
      this.swUpdate.activated.subscribe((event: any) => {
        console.log('Update activated:', event);
        this.showUpdateSuccessNotification();
      });

      // Handle unrecoverable state
      this.swUpdate.unrecoverable.subscribe((event: any) => {
        console.error('Unrecoverable state:', event);
        this.handleUnrecoverableState(event);
      });

      // Initial update check
      this.checkForUpdates();
    }
  }

  private setupNetworkDetection(): void {
    window.addEventListener('online', () => {
      this.isOnlineSubject.next(true);
      this.handleOnlineEvent();
    });

    window.addEventListener('offline', () => {
      this.isOnlineSubject.next(false);
      this.handleOfflineEvent();
    });

    // Advanced network monitoring
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', () => {
        this.handleNetworkChange(connection);
      });
    }
  }

  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.installPromptSubject.next(event);
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.installPromptSubject.next(null);
      this.trackInstallEvent();
    });
  }

  private setupBackgroundSync(): void {
    // Listen for background sync messages from service worker
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'BACKGROUND_SYNC') {
          this.handleBackgroundSyncMessage(event.data);
        }
      });
    }
  }

  // Update Management
  public async checkForUpdates(): Promise<boolean> {
    if (!this.swUpdate.isEnabled) {
      return false;
    }

    try {
      const hasUpdate = await this.swUpdate.checkForUpdate();
      console.log('Update check result:', hasUpdate);
      return hasUpdate;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return false;
    }
  }

  public async activateUpdate(): Promise<boolean> {
    if (!this.swUpdate.isEnabled) {
      return false;
    }

    try {
      await this.swUpdate.activateUpdate();
      this.updateAvailableSubject.next(false);
      // Reload the page to apply updates
      window.location.reload();
      return true;
    } catch (error) {
      console.error('Error activating update:', error);
      return false;
    }
  }

  // Push Notifications
  public async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  public async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.swPush.isEnabled) {
      console.warn('Push notifications not enabled');
      return null;
    }

    try {
      const subscription = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      });

      console.log('Push subscription:', subscription);
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }

  public async unsubscribeFromPushNotifications(): Promise<boolean> {
    if (!this.swPush.isEnabled) {
      return false;
    }

    try {
      await this.swPush.unsubscribe();
      console.log('Unsubscribed from push notifications');
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  public showLocalNotification(payload: NotificationPayload): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/assets/icons/icon-192x192.png',
        badge: payload.badge || '/assets/icons/badge-72x72.png',
        tag: payload.tag,
        data: payload.data,
        silent: payload.silent
      });

      notification.onclick = () => {
        window.focus();
        if (payload.data && payload.data.url) {
          window.location.href = payload.data.url;
        }
        notification.close();
      };

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }

  // App Installation
  public async promptInstall(): Promise<boolean> {
    const installPrompt = this.installPromptSubject.value;
    
    if (!installPrompt) {
      console.warn('Install prompt not available');
      return false;
    }

    try {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error prompting install:', error);
      return false;
    }
  }

  public isInstallable(): boolean {
    return this.installPromptSubject.value !== null;
  }

  public isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  // Background Sync
  public registerBackgroundSync(task: Omit<BackgroundSyncTask, 'timestamp' | 'retryCount'>): void {
    const syncTask: BackgroundSyncTask = {
      ...task,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.backgroundSyncTasks.push(syncTask);
    this.requestBackgroundSync(syncTask);
  }

  private async requestBackgroundSync(task: BackgroundSyncTask): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Background sync API is experimental, fallback to message passing
        registration.active?.postMessage({
          type: 'BACKGROUND_SYNC_TASK',
          task
        });
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }

  // Cache Management
  public async clearCache(cachePattern?: string): Promise<boolean> {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        const targetCaches = cachePattern 
          ? cacheNames.filter(name => name.includes(cachePattern))
          : cacheNames;

        await Promise.all(
          targetCaches.map(cacheName => caches.delete(cacheName))
        );

        console.log('Cache cleared:', targetCaches);
        return true;
      } catch (error) {
        console.error('Error clearing cache:', error);
        return false;
      }
    }
    return false;
  }

  public async getCacheInfo(): Promise<any> {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        const cacheInfo = await Promise.all(
          cacheNames.map(async (name) => {
            const cache = await caches.open(name);
            const keys = await cache.keys();
            return {
              name,
              size: keys.length,
              requests: keys.map(req => req.url)
            };
          })
        );
        return cacheInfo;
      } catch (error) {
        console.error('Error getting cache info:', error);
        return [];
      }
    }
    return [];
  }

  // Offline Capabilities
  public async cacheImportantPages(urls: string[]): Promise<void> {
    if ('caches' in window) {
      try {
        const cache = await caches.open('important-pages-v1');
        await cache.addAll(urls);
        console.log('Important pages cached:', urls);
      } catch (error) {
        console.error('Error caching important pages:', error);
      }
    }
  }

  public async preloadCriticalResources(resources: string[]): Promise<void> {
    if ('caches' in window) {
      try {
        const cache = await caches.open('critical-resources-v1');
        await cache.addAll(resources);
        console.log('Critical resources preloaded:', resources);
      } catch (error) {
        console.error('Error preloading critical resources:', error);
      }
    }
  }

  // Event Handlers
  private showUpdateNotification(event: any): void {
    this.showLocalNotification({
      title: 'TruckPort Güncellemesi Mevcut',
      body: 'Yeni özellikler ve iyileştirmeler var. Şimdi güncelleyin!',
      tag: 'app-update',
      data: { type: 'update' }
    });
  }

  private showUpdateSuccessNotification(): void {
    this.showLocalNotification({
      title: 'TruckPort Güncellendi',
      body: 'Uygulama başarıyla güncellendi.',
      tag: 'update-success'
    });
  }

  private handleUnrecoverableState(event: any): void {
    console.error('App in unrecoverable state:', event);
    
    this.showLocalNotification({
      title: 'TruckPort Yenileme Gerekli',
      body: 'Bir sorun oluştu. Lütfen sayfayı yenileyin.',
      tag: 'unrecoverable-state',
      data: { type: 'reload' }
    });
  }

  private handleOnlineEvent(): void {
    console.log('App came online');
    
    this.showLocalNotification({
      title: 'İnternet Bağlantısı Geri Geldi',
      body: 'TruckPort tekrar çevrimiçi!',
      tag: 'online-status'
    });

    // Process pending background sync tasks
    this.processPendingBackgroundSyncTasks();
  }

  private handleOfflineEvent(): void {
    console.log('App went offline');
    
    this.showLocalNotification({
      title: 'İnternet Bağlantısı Kesildi',
      body: 'TruckPort çevrimdışı modda çalışmaya devam ediyor.',
      tag: 'offline-status'
    });
  }

  private handleNetworkChange(connection: any): void {
    console.log('Network changed:', {
      type: connection.type,
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    });

    // Adjust behavior based on connection quality
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      this.enableDataSavingMode();
    } else {
      this.disableDataSavingMode();
    }
  }

  private handleBackgroundSyncMessage(data: any): void {
    console.log('Background sync message:', data);
    
    if (data.success) {
      // Remove completed task
      this.backgroundSyncTasks = this.backgroundSyncTasks.filter(
        task => task.id !== data.taskId
      );
    } else {
      // Handle failed task
      const failedTask = this.backgroundSyncTasks.find(task => task.id === data.taskId);
      if (failedTask) {
        failedTask.retryCount++;
        if (failedTask.retryCount < failedTask.maxRetries) {
          // Retry the task
          setTimeout(() => {
            this.requestBackgroundSync(failedTask);
          }, 5000 * failedTask.retryCount); // Exponential backoff
        } else {
          // Remove failed task after max retries
          this.backgroundSyncTasks = this.backgroundSyncTasks.filter(
            task => task.id !== data.taskId
          );
        }
      }
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  }

  private trackInstallEvent(): void {
    // Track app installation for analytics
    console.log('PWA installed successfully');
  }

  private processPendingBackgroundSyncTasks(): void {
    this.backgroundSyncTasks.forEach(task => {
      this.requestBackgroundSync(task);
    });
  }

  private enableDataSavingMode(): void {
    console.log('Data saving mode enabled');
    // Implement data saving strategies
  }

  private disableDataSavingMode(): void {
    console.log('Data saving mode disabled');
    // Restore normal data usage
  }

  // Utility Methods
  public getConnectionInfo(): any {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        type: connection.type,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }

  public getBatteryInfo(): Promise<any> {
    if ('getBattery' in navigator) {
      return (navigator as any).getBattery().then((battery: any) => ({
        charging: battery.charging,
        level: battery.level,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      }));
    }
    return Promise.resolve(null);
  }

  public async getStorageQuota(): Promise<any> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          quota: estimate.quota,
          usage: estimate.usage,
          available: (estimate.quota || 0) - (estimate.usage || 0),
          usagePercentage: estimate.quota ? (estimate.usage || 0) / estimate.quota * 100 : 0
        };
      } catch (error) {
        console.error('Error getting storage quota:', error);
        return null;
      }
    }
    return null;
  }
}
