import { createSlice } from '@reduxjs/toolkit';

const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const storedToken = localStorage.getItem('accessToken') || null;

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedUser,
  isInitializing: true,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      if (user) {
        state.user = user;
        try {
          localStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
          console.error("Error storing user in localStorage", e);
        }
      }
      if (accessToken) {
        state.token = accessToken;
        localStorage.setItem('accessToken', accessToken);
      }
      state.isAuthenticated = true;
      state.isInitializing = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    },
    setAuthLoading: (state, action) => {
      state.isInitializing = action.payload;
    },
  },
});

export const { setCredentials, logoutUser, setAuthLoading } = authSlice.actions;

export default authSlice.reducer;
