
import { PerformanceState } from './performance/performance.reducer';
import { UserState } from './user/user.reducer';

export interface AppState {
  user: UserState;
  performance: PerformanceState;
}
