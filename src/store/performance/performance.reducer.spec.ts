import { performanceReducer, initialPerformanceState } from './performance.reducer';
import * as PerformanceActions from './performance.actions';

describe('performanceReducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'unknown' };
    const state = performanceReducer(undefined, action);
    expect(state).toEqual(initialPerformanceState);
  });

  it('should set API latency', () => {
    const action = PerformanceActions.setApiLatency({ apiLatency: 123 });
    const state = performanceReducer(initialPerformanceState, action);
    expect(state.apiLatency).toBe(123);
  });

  it('should increment error count', () => {
    const action = PerformanceActions.incrementErrorCount();
    const state = performanceReducer(initialPerformanceState, action);
    expect(state.errorCount).toBe(initialPerformanceState.errorCount + 1);
  });

  it('should set last load time', () => {
    const now = Date.now();
    const action = PerformanceActions.setLastLoadTime({ lastLoadTime: now });
    const state = performanceReducer(initialPerformanceState, action);
    expect(state.lastLoadTime).toBe(now);
  });
});
