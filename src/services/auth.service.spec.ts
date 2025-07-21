import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService, AuthGuard, AdminGuard } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with correct credentials', (done) => {
    service.login('admin@truckport.com', 'admin123').subscribe(
      user => {
        expect(user.email).toBe('admin@truckport.com');
        expect(user.role).toBe('admin');
        expect(user.isAuthenticated).toBe(true);
        expect(service.isAuthenticated()).toBe(true);
        done();
      }
    );
  });

  it('should fail login with incorrect credentials', (done) => {
    service.login('wrong@email.com', 'wrongpassword').subscribe(
      () => {
        fail('Should not succeed with wrong credentials');
      },
      error => {
        expect(error).toBe('Invalid credentials');
        expect(service.isAuthenticated()).toBe(false);
        done();
      }
    );
  });

  it('should logout and clear user data', () => {
    // First login
    service.login('admin@truckport.com', 'admin123').subscribe(() => {
      expect(service.isAuthenticated()).toBe(true);
      
      // Then logout
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.getCurrentUser()).toBe(null);
      expect(localStorage.getItem('currentUser')).toBe(null);
    });
  });

  it('should check user role correctly', (done) => {
    service.login('admin@truckport.com', 'admin123').subscribe(() => {
      expect(service.hasRole('admin')).toBe(true);
      expect(service.hasRole('driver')).toBe(false);
      expect(service.hasRole('user')).toBe(false);
      done();
    });
  });

  it('should restore user from localStorage', () => {
    const testUser = {
      id: '1',
      email: 'test@truckport.com',
      role: 'admin' as const,
      isAuthenticated: true
    };
    
    localStorage.setItem('currentUser', JSON.stringify(testUser));
    
    const newService = new AuthService();
    expect(newService.isAuthenticated()).toBe(true);
    expect(newService.getCurrentUser()?.email).toBe('test@truckport.com');
  });
});

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'hasRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);
    
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/test' } as RouterStateSnapshot;

    const result = guard.canActivate(route, state);
    
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);
    
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/test' } as RouterStateSnapshot;

    const result = guard.canActivate(route, state);
    
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/giris'], { 
      queryParams: { returnUrl: '/test' } 
    });
  });

  it('should check role when required', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.hasRole.and.returnValue(false);
    
    const route = { data: { role: 'admin' } } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/admin' } as RouterStateSnapshot;

    const result = guard.canActivate(route, state);
    
    expect(result).toBe(false);
    expect(authService.hasRole).toHaveBeenCalledWith('admin');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should allow access when user has required role', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.hasRole.and.returnValue(true);
    
    const route = { data: { role: 'admin' } } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/admin' } as RouterStateSnapshot;

    const result = guard.canActivate(route, state);
    
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'hasRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AdminGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access for authenticated admin', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.hasRole.and.returnValue(true);

    const result = guard.canActivate();
    
    expect(result).toBe(true);
    expect(authService.hasRole).toHaveBeenCalledWith('admin');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access for non-admin user', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.hasRole.and.returnValue(false);

    const result = guard.canActivate();
    
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should deny access for unauthenticated user', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate();
    
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
