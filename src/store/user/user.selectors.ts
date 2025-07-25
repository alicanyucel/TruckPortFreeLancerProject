import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserName = createSelector(
  selectUserState,
  (state: UserState) => state.name
);

export const selectUserEmail = createSelector(
  selectUserState,
  (state: UserState) => state.email
);

export const selectIsLoggedIn = createSelector(
  selectUserState,
  (state: UserState) => state.isLoggedIn
);
