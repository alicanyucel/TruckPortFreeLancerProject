import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SecurityPolicy {
  contentSecurityPolicy: {
    defaultSrc: string[];
    scriptSrc: string[];
    styleSrc: string[];
    imgSrc: string[];
    connectSrc: string[];
    fontSrc: string[];
    objectSrc: string[];
    mediaSrc: string[];
    frameSrc: string[];
  };
  enableHSTS: boolean;
  enableXFrameOptions: boolean;
  enableXContentTypeOptions: boolean;
  enableReferrerPolicy: boolean;
  enablePermissionsPolicy: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly defaultPolicy: SecurityPolicy = {
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.truckport.com", "wss://api.truckport.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://maps.google.com"]
    },
    enableHSTS: true,
    enableXFrameOptions: true,
    enableXContentTypeOptions: true,
    enableReferrerPolicy: true,
    enablePermissionsPolicy: true
  };

  constructor() {
    this.initializeSecurityHeaders();
    this.setupCSP();
    this.setupSecurityEventListeners();
  }

  private initializeSecurityHeaders(): void {
    if (typeof document !== 'undefined') {
      // Add security meta tags
      this.addMetaTag('X-Content-Type-Options', 'nosniff');
      this.addMetaTag('X-Frame-Options', 'DENY');
      this.addMetaTag('X-XSS-Protection', '1; mode=block');
      this.addMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
      this.addMetaTag('Permissions-Policy', this.generatePermissionsPolicy());
      
      // Add HSTS (this should ideally be done server-side)
      if (location.protocol === 'https:') {
        this.addMetaTag('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      }
    }
  }

  private setupCSP(): void {
    if (typeof document !== 'undefined') {
      const cspDirectives = this.generateCSPDirectives();
      const cspMetaTag = document.createElement('meta');
      cspMetaTag.httpEquiv = 'Content-Security-Policy';
      cspMetaTag.content = cspDirectives;
      document.head.appendChild(cspMetaTag);

      // Also set up CSP reporting
      this.setupCSPReporting();
    }
  }

  private generateCSPDirectives(): string {
    const policy = this.defaultPolicy.contentSecurityPolicy;
    const directives = [
      `default-src ${policy.defaultSrc.join(' ')}`,
      `script-src ${policy.scriptSrc.join(' ')}`,
      `style-src ${policy.styleSrc.join(' ')}`,
      `img-src ${policy.imgSrc.join(' ')}`,
      `connect-src ${policy.connectSrc.join(' ')}`,
      `font-src ${policy.fontSrc.join(' ')}`,
      `object-src ${policy.objectSrc.join(' ')}`,
      `media-src ${policy.mediaSrc.join(' ')}`,
      `frame-src ${policy.frameSrc.join(' ')}`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `frame-ancestors 'none'`,
      `upgrade-insecure-requests`
    ];

    return directives.join('; ');
  }

  private generatePermissionsPolicy(): string {
    const policies = [
      'camera=()',
      'microphone=()',
      'geolocation=(self)',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
      'ambient-light-sensor=()',
      'autoplay=(self)',
      'encrypted-media=(self)',
      'fullscreen=(self)',
      'picture-in-picture=()'
    ];

    return policies.join(', ');
  }

  private addMetaTag(name: string, content: string): void {
    const existingTag = document.querySelector(`meta[http-equiv="${name}"]`);
    if (existingTag) {
      existingTag.setAttribute('content', content);
    } else {
      const metaTag = document.createElement('meta');
      metaTag.httpEquiv = name;
      metaTag.content = content;
      document.head.appendChild(metaTag);
    }
  }

  private setupCSPReporting(): void {
    // Listen for CSP violations
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleCSPViolation({
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        effectiveDirective: event.effectiveDirective,
        originalPolicy: event.originalPolicy,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
        columnNumber: event.columnNumber,
        statusCode: event.statusCode,
        timestamp: Date.now()
      });
    });
  }

  private handleCSPViolation(violation: any): void {
    console.warn('CSP Violation detected:', violation);
    
    // Send violation report to server
    this.reportSecurityViolation('csp-violation', violation);
    
    // In development, provide helpful debugging information
    if (!this.isProduction()) {
      console.group('CSP Violation Details');
      console.log('Blocked URI:', violation.blockedURI);
      console.log('Violated Directive:', violation.violatedDirective);
      console.log('Effective Directive:', violation.effectiveDirective);
      console.log('Source File:', violation.sourceFile);
      console.log('Line Number:', violation.lineNumber);
      console.groupEnd();
    }
  }

  private setupSecurityEventListeners(): void {
    if (typeof window !== 'undefined') {
      // Detect potential XSS attempts
      this.setupXSSDetection();
      
      // Monitor for suspicious activities
      this.setupSuspiciousActivityDetection();
      
      // Content integrity monitoring
      this.setupContentIntegrityMonitoring();
    }
  }

  private setupXSSDetection(): void {
    // Monitor for potentially dangerous DOM manipulations
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // Check for suspicious script injections
              if (element.tagName === 'SCRIPT') {
                this.analyzeScriptElement(element as HTMLScriptElement);
              }
              
              // Check for suspicious event handlers
              this.checkForSuspiciousEventHandlers(element);
            }
          });
        }
        
        if (mutation.type === 'attributes') {
          const element = mutation.target as Element;
          this.checkForSuspiciousEventHandlers(element);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['onclick', 'onload', 'onerror', 'onmouseover']
    });
  }

  private analyzeScriptElement(script: HTMLScriptElement): void {
    const suspiciousPatterns = [
      /eval\s*\(/,
      /document\.write/,
      /innerHTML\s*=/,
      /outerHTML\s*=/,
      /javascript:/,
      /vbscript:/,
      /data:text\/html/
    ];

    const scriptContent = script.textContent || script.innerHTML || '';
    const scriptSrc = script.src;

    let isSuspicious = false;
    let reason = '';

    // Check content for suspicious patterns
    if (scriptContent) {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(scriptContent)) {
          isSuspicious = true;
          reason = `Suspicious pattern detected: ${pattern.source}`;
          break;
        }
      }
    }

    // Check source for suspicious URLs
    if (scriptSrc && !this.isAllowedScriptSource(scriptSrc)) {
      isSuspicious = true;
      reason = `Suspicious script source: ${scriptSrc}`;
    }

    if (isSuspicious) {
      this.reportSecurityThreat('suspicious-script', {
        src: scriptSrc,
        content: scriptContent.substring(0, 200), // First 200 chars
        reason,
        timestamp: Date.now()
      });
      
      // Optionally remove the suspicious script
      if (this.shouldBlockSuspiciousContent()) {
        script.remove();
      }
    }
  }

  private checkForSuspiciousEventHandlers(element: Element): void {
    const dangerousEvents = ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus'];
    
    dangerousEvents.forEach(event => {
      const handler = element.getAttribute(event);
      if (handler && this.isSuspiciousEventHandler(handler)) {
        this.reportSecurityThreat('suspicious-event-handler', {
          element: element.tagName,
          event,
          handler: handler.substring(0, 100), // First 100 chars
          timestamp: Date.now()
        });
        
        // Remove suspicious event handler
        if (this.shouldBlockSuspiciousContent()) {
          element.removeAttribute(event);
        }
      }
    });
  }

  private isSuspiciousEventHandler(handler: string): boolean {
    const suspiciousPatterns = [
      /eval\s*\(/,
      /javascript:/,
      /vbscript:/,
      /data:/,
      /document\.write/,
      /innerHTML/,
      /outerHTML/
    ];

    return suspiciousPatterns.some(pattern => pattern.test(handler));
  }

  private setupSuspiciousActivityDetection(): void {
    // Monitor for rapid-fire requests (potential DDoS)
    let requestCount = 0;
    const requestWindow = 10000; // 10 seconds
    
    setInterval(() => {
      if (requestCount > 100) { // More than 100 requests in 10 seconds
        this.reportSecurityThreat('potential-ddos', {
          requestCount,
          timeWindow: requestWindow,
          timestamp: Date.now()
        });
      }
      requestCount = 0;
    }, requestWindow);

    // Track requests (this would be integrated with HTTP interceptor)
    this.trackHttpRequests = () => {
      requestCount++;
    };
  }

  private trackHttpRequests(): void {
    // This method is called by HTTP interceptor
  }

  private setupContentIntegrityMonitoring(): void {
    // Monitor for unexpected changes to critical elements
    const criticalSelectors = [
      'script[src]',
      'link[rel="stylesheet"]',
      'meta[http-equiv]',
      '[data-critical]'
    ];

    criticalSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.monitorElementIntegrity(element);
      });
    });
  }

  private monitorElementIntegrity(element: Element): void {
    const originalAttributes = Array.from(element.attributes).reduce((acc, attr) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {} as {[key: string]: string});

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attributeName = mutation.attributeName!;
          const currentValue = element.getAttribute(attributeName);
          const originalValue = originalAttributes[attributeName];

          if (currentValue !== originalValue) {
            this.reportSecurityThreat('content-integrity-violation', {
              element: element.tagName,
              attribute: attributeName,
              originalValue,
              currentValue,
              timestamp: Date.now()
            });
          }
        }
      });
    });

    observer.observe(element, { attributes: true });
  }

  private isAllowedScriptSource(src: string): boolean {
    const allowedDomains = [
      'self',
      'apis.google.com',
      'cdn.jsdelivr.net',
      'unpkg.com',
      'truckport.com'
    ];

    try {
      const url = new URL(src, window.location.origin);
      return allowedDomains.some(domain => {
        if (domain === 'self') {
          return url.origin === window.location.origin;
        }
        return url.hostname.endsWith(domain);
      });
    } catch {
      return false;
    }
  }

  private shouldBlockSuspiciousContent(): boolean {
    // In production, be more aggressive about blocking
    return this.isProduction();
  }

  private isProduction(): boolean {
    return !window.location.hostname.includes('localhost') && 
           !window.location.hostname.includes('127.0.0.1');
  }

  private reportSecurityViolation(type: string, details: any): void {
    this.reportSecurityThreat(type, details);
  }

  private reportSecurityThreat(type: string, details: any): void {
    const report = {
      type,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
      userId: this.getCurrentUserId() // If available
    };

    // Send to security monitoring endpoint
    if (this.isProduction()) {
      fetch('/api/security/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      }).catch(error => {
        console.error('Failed to report security threat:', error);
      });
    } else {
      console.warn('Security threat detected:', report);
    }
  }

  private getCurrentUserId(): string | null {
    // Get user ID from your auth service
    return localStorage.getItem('userId');
  }

  // Public API
  public updateCSP(newPolicy: Partial<SecurityPolicy>): void {
    // Update CSP dynamically (limited support)
    Object.assign(this.defaultPolicy, newPolicy);
    console.warn('CSP updated. Full effect requires page reload.');
  }

  public validateURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      
      // Check against allowed protocols
      const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
      if (!allowedProtocols.includes(urlObj.protocol)) {
        return false;
      }
      
      // Check against blocked domains
      const blockedDomains = ['malicious-site.com', 'suspicious-domain.org'];
      if (blockedDomains.some(domain => urlObj.hostname.includes(domain))) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  public sanitizeHTML(html: string): string {
    // Basic HTML sanitization (use DOMPurify in production)
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  public encodeOutput(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  constructor(private securityService: SecurityService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add security headers to outgoing requests
    let secureReq = req.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    // Remove sensitive headers for external domains
    if (!this.isInternalDomain(req.url)) {
      secureReq = secureReq.clone({
        setHeaders: {
          'Authorization': ''
        }
      });
    }

    // Track request for security monitoring
    (this.securityService as any).trackHttpRequests();

    return next.handle(secureReq);
  }

  private isInternalDomain(url: string): boolean {
    try {
      const requestUrl = new URL(url, window.location.origin);
      const allowedOrigins = [
        window.location.origin,
        'https://api.truckport.com'
      ];
      
      return allowedOrigins.includes(requestUrl.origin);
    } catch {
      return false;
    }
  }
}
