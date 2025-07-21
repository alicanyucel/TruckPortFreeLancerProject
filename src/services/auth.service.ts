import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'driver' | 'user';
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor() {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  login(email: string, password: string): Observable<User> {
    // Simulate API call
    return new Observable(observer => {
      setTimeout(() => {
        if (email === 'admin@truckport.com' && password === 'admin123') {
          const user: User = {
            id: '1',
            email: email,
            role: 'admin',
            isAuthenticated: true
          };
          this.currentUser = user;
          localStorage.setItem('currentUser', JSON.stringify(user));
          observer.next(user);
        } else {
          observer.error('Invalid credentials');
        }
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser?.isAuthenticated || false;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    if (this.authService.isAuthenticated()) {
      // Check if route requires specific role
      const requiredRole = route.data['role'];
      if (requiredRole && !this.authService.hasRole(requiredRole)) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }

    // Redirect to login page
    this.router.navigate(['/giris'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && this.authService.hasRole('admin')) {
      return true;
    }
    
    this.router.navigate(['/']);
    return false;
  }
}
