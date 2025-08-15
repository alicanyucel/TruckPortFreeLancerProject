import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  // Observable stream of breadcrumb arrays
  public breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.breadcrumbs$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.buildBreadCrumb(this.activatedRoute.snapshot))
    );
  }

  private buildBreadCrumb(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    // Add root/home
    if (breadcrumbs.length === 0) {
      breadcrumbs.push({ label: 'Ana Sayfa', url: '/' });
    }

    if (!route) {
      return breadcrumbs;
    }

    for (const child of route.children) {
      const routeURL = child.url.map(segment => segment.path).join('/');
      const nextUrl = routeURL ? `${url}/${routeURL}` : url;

      const label = (child.data && child.data['breadcrumb']) ? child.data['breadcrumb'] : (routeURL || null);

      if (label) {
        breadcrumbs.push({ label, url: nextUrl });
      }

      return this.buildBreadCrumb(child, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }
}
