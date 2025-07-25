import { userReducer, initialUserState } from './user.reducer';
import { setUser } from './user.actions';

describe('userReducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'unknown' };
    const state = userReducer(undefined, action);
    expect(state).toEqual(initialUserState);
  });

  it('should set user and mark as logged in', () => {
    const action = setUser({ name: 'Ali', email: 'ali@truckport.com' });
    const state = userReducer(initialUserState, action);
    expect(state.name).toBe('Ali');
    expect(state.email).toBe('ali@truckport.com');
    expect(state.isLoggedIn).toBe(true);
  });
});

describe('userReducer', () => {
  it('should return initial state', () => {
    const state = userReducer(undefined, { type: '@@INIT' } as any);
    expect(state).toEqual(initialUserState);
  });

  it('should set user and isLoggedIn true', () => {
    const action = setUser({ name: 'Ali', email: 'ali@truckport.net' });
    const state = userReducer(initialUserState, action);
    expect(state.name).toBe('Ali');
    expect(state.email).toBe('ali@truckport.net');
    expect(state.isLoggedIn).toBeTrue();
  });
});
