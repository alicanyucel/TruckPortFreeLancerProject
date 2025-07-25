import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PerformanceState } from './performance.reducer';

export const selectPerformanceState = createFeatureSelector<PerformanceState>('performance');

export const selectApiLatency = createSelector(
  selectPerformanceState,
  (state: PerformanceState) => state.apiLatency
);

export const selectErrorCount = createSelector(
  selectPerformanceState,
  (state: PerformanceState) => state.errorCount
);

export const selectLastLoadTime = createSelector(
  selectPerformanceState,
  (state: PerformanceState) => state.lastLoadTime
);
