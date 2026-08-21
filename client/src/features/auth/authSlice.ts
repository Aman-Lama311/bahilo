import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from './types';

interface AuthState {
  user: AuthUser | null;
}

const storedUser = localStorage.getItem('authUser');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AuthUser }>) => {
      state.user = action.payload.user;
      localStorage.setItem('authUser', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('authUser');
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;