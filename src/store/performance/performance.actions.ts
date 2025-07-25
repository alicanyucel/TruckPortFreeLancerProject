import { createAction, props } from '@ngrx/store';

export const setApiLatency = createAction(
  '[Performance] Set API Latency',
  props<{ apiLatency: number }>()
);

export const incrementErrorCount = createAction(
  '[Performance] Increment Error Count'
);

export const setLastLoadTime = createAction(
  '[Performance] Set Last Load Time',
  props<{ lastLoadTime: number }>()
);
