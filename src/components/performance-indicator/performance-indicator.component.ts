import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { Observable } from 'rxjs';
import { selectApiLatency } from '../../store/performance/performance.selectors';

@Component({
  selector: 'app-performance-indicator',
  template: `
    <div class="performance-indicator">
      <span>API Gecikmesi: {{ apiLatency$ | async }} ms</span>
    </div>
  `,
  styles: [`
    .performance-indicator {
      font-size: 1.1rem;
      color: #1976d2;
      font-weight: 600;
      margin: 12px 0;
    }
  `]
})
export class PerformanceIndicatorComponent {
  apiLatency$: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.apiLatency$ = this.store.select(selectApiLatency);
  }
}
