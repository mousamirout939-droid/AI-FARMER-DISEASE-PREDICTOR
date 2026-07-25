import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('af_user') || 'null'),
  accessToken: localStorage.getItem('af_token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('af_user', JSON.stringify(action.payload.user));
      localStorage.setItem('af_token', action.payload.accessToken);
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem('af_token', action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem('af_user');
      localStorage.removeItem('af_token');
    },
  },
});

export const { setCredentials, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
