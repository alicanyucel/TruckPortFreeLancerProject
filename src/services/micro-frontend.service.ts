import { Injectable, ComponentRef, ViewContainerRef, Type } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface MicroFrontendConfig {
  name: string;
  url: string;
  version: string;
  routes: string[];
  permissions?: string[];
  dependencies?: string[];
  cssUrls?: string[];
  jsUrls?: string[];
}

export interface MicroFrontendModule {
  bootstrap: () => Promise<any>;
  mount: (element: HTMLElement, props?: any) => Promise<void>;
  unmount: (element: HTMLElement) => Promise<void>;
  update?: (props: any) => Promise<void>;
}

export interface SharedEventBus {
  emit(event: string, data?: any): void;
  on(event: string): Observable<any>;
  off(event: string): void;
}

@Injectable({
  providedIn: 'root'
})
export class MicroFrontendService implements SharedEventBus {
  private loadedModules = new Map<string, MicroFrontendModule>();
  private eventBus = new BehaviorSubject<{event: string, data: any}>({event: '', data: null});
  private moduleStates = new Map<string, any>();
  
  // Global shared state for micro-frontends
  private sharedState = new BehaviorSubject<{[key: string]: any}>({
    user: null,
    theme: 'light',
    language: 'tr',
    permissions: []
  });

  constructor() {
    this.setupGlobalCommunication();
  }

  async loadMicroFrontend(config: MicroFrontendConfig): Promise<MicroFrontendModule> {
    if (this.loadedModules.has(config.name)) {
      return this.loadedModules.get(config.name)!;
    }

    try {
      // Load CSS dependencies
      if (config.cssUrls) {
        await Promise.all(config.cssUrls.map(url => this.loadCSS(url)));
      }

      // Load JavaScript module
      const module = await this.loadJavaScriptModule(config.url);
      
      // Validate module interface
      if (!this.isValidMicroFrontendModule(module)) {
        throw new Error(`Invalid micro-frontend module: ${config.name}`);
      }

      // Initialize module with shared services
      await module.bootstrap();
      
      this.loadedModules.set(config.name, module);
      
      console.log(`Micro-frontend '${config.name}' loaded successfully`);
      
      return module;
    } catch (error) {
      console.error(`Failed to load micro-frontend '${config.name}':`, error);
      throw error;
    }
  }

  async mountMicroFrontend(
    config: MicroFrontendConfig, 
    container: HTMLElement, 
    props?: any
  ): Promise<void> {
    const module = await this.loadMicroFrontend(config);
    
    // Prepare props with shared state
    const enhancedProps = {
      ...props,
      sharedState: this.sharedState.value,
      eventBus: this,
      moduleId: config.name
    };

    await module.mount(container, enhancedProps);
    
    // Store module state
    this.moduleStates.set(config.name, {
      container,
      props: enhancedProps,
      mounted: true
    });
  }

  async unmountMicroFrontend(moduleName: string): Promise<void> {
    const module = this.loadedModules.get(moduleName);
    const moduleState = this.moduleStates.get(moduleName);
    
    if (module && moduleState) {
      await module.unmount(moduleState.container);
      moduleState.mounted = false;
    }
  }

  // Shared Event Bus Implementation
  emit(event: string, data?: any): void {
    this.eventBus.next({ event, data });
    
    // Also broadcast to other windows/frames
    if (typeof window !== 'undefined') {
      window.postMessage({
        type: 'MICRO_FRONTEND_EVENT',
        event,
        data,
        source: 'truckport-main'
      }, '*');
    }
  }

  on(event: string): Observable<any> {
    return this.eventBus.pipe(
      filter(msg => msg.event === event),
      map(msg => msg.data)
    );
  }

  off(event: string): void {
    // Implementation for unsubscribing specific events
    // This would require a more complex event management system
  }

  // Shared State Management
  updateSharedState(key: string, value: any): void {
    const currentState = this.sharedState.value;
    this.sharedState.next({
      ...currentState,
      [key]: value
    });
    
    // Notify all mounted micro-frontends
    this.emit('SHARED_STATE_UPDATED', { key, value });
  }

  getSharedState(): Observable<{[key: string]: any}> {
    return this.sharedState.asObservable();
  }

  getSharedStateValue(): {[key: string]: any} {
    return this.sharedState.value;
  }

  // Module Communication
  async communicateWithModule(moduleName: string, action: string, payload?: any): Promise<any> {
    const module = this.loadedModules.get(moduleName);
    const moduleState = this.moduleStates.get(moduleName);
    
    if (module && moduleState && module.update) {
      return await module.update({ action, payload });
    }
    
    throw new Error(`Module '${moduleName}' not found or doesn't support communication`);
  }

  // Route Management for Micro-Frontends
  registerRoutes(moduleName: string, routes: string[]): void {
    // This would integrate with Angular Router
    // Implementation depends on routing strategy
    console.log(`Registering routes for ${moduleName}:`, routes);
  }

  // Performance Monitoring
  getModulePerformance(moduleName: string): any {
    const moduleState = this.moduleStates.get(moduleName);
    if (moduleState) {
      return {
        name: moduleName,
        mounted: moduleState.mounted,
        loadTime: moduleState.loadTime,
        memoryUsage: this.estimateMemoryUsage(moduleName)
      };
    }
    return null;
  }

  // Development Tools Integration
  getDebugInfo(): any {
    return {
      loadedModules: Array.from(this.loadedModules.keys()),
      moduleStates: Object.fromEntries(this.moduleStates),
      sharedState: this.sharedState.value,
      eventHistory: [] // Would track recent events
    };
  }

  private async loadJavaScriptModule(url: string): Promise<MicroFrontendModule> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = url;
      
      script.onload = () => {
        // Assuming the module exports to window[moduleName]
        const moduleName = this.extractModuleNameFromUrl(url);
        const module = (window as any)[moduleName];
        
        if (module) {
          resolve(module);
        } else {
          reject(new Error(`Module not found in global scope: ${moduleName}`));
        }
      };
      
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${url}`));
      };
      
      document.head.appendChild(script);
    });
  }

  private async loadCSS(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
      
      document.head.appendChild(link);
    });
  }

  private isValidMicroFrontendModule(module: any): module is MicroFrontendModule {
    return (
      typeof module === 'object' &&
      typeof module.bootstrap === 'function' &&
      typeof module.mount === 'function' &&
      typeof module.unmount === 'function'
    );
  }

  private extractModuleNameFromUrl(url: string): string {
    // Extract module name from URL
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  }

  private setupGlobalCommunication(): void {
    if (typeof window !== 'undefined') {
      // Listen for messages from other micro-frontends
      window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'MICRO_FRONTEND_EVENT') {
          if (event.data.source !== 'truckport-main') {
            this.eventBus.next({
              event: event.data.event,
              data: event.data.data
            });
          }
        }
      });
    }
  }

  private estimateMemoryUsage(moduleName: string): number {
    // Rough estimation of memory usage
    // In a real implementation, this would use performance APIs
    const moduleState = this.moduleStates.get(moduleName);
    if (moduleState) {
      return JSON.stringify(moduleState).length * 2; // Rough estimate
    }
    return 0;
  }
}
