import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from './types';

interface AuthState {
  token: string | null;
  user: JwtPayload | null;
}

const storedToken = localStorage.getItem('token');

const initialState: AuthState = {
  token: storedToken,
  user: storedToken ? jwtDecode<JwtPayload>(storedToken) : null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.user = jwtDecode<JwtPayload>(action.payload.token);
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;