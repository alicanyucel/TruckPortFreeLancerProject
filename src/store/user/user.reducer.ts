import { createReducer, on } from '@ngrx/store';
import { setUser } from './user.actions';

export interface UserState {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export const initialUserState: UserState = {
  name: '',
  email: '',
  isLoggedIn: false,
};

export const userReducer = createReducer(
  initialUserState,
  on(setUser, (state, { name }) => ({
    ...state,
    name,
    isLoggedIn: true,
  }))
);
