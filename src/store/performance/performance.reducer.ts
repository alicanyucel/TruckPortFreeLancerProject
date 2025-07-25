export interface PerformanceState {
  lastLoadTime: number;
  apiLatency: number;
  errorCount: number;
}

export const initialPerformanceState: PerformanceState = {
  lastLoadTime: Date.now(),
  apiLatency: 0,
  errorCount: 0,
};

import { Action } from '@ngrx/store';
import * as PerformanceActions from './performance.actions';

export function performanceReducer(state = initialPerformanceState, action: Action): PerformanceState {
  switch (action.type) {
    case PerformanceActions.setApiLatency.type:
      return { ...state, apiLatency: (action as any).apiLatency };
    case PerformanceActions.incrementErrorCount.type:
      return { ...state, errorCount: state.errorCount + 1 };
    case PerformanceActions.setLastLoadTime.type:
      return { ...state, lastLoadTime: (action as any).lastLoadTime };
    default:
      return state;
  }
}
