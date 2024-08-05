import { createSlice } from "@reduxjs/toolkit";

// Create the cart slice with initial state and reducers
export const userSlice = createSlice({
  name: "user",
  initialState: {
    access: null,
    refresh: null,
    username: null,
    email: null,
    role: null,
    error: false,
    loaded: false,
    isLog: false,
  },
  reducers: {
    logout: (state) => {
      state.access = null;
      state.refresh = null;
      state.username = null;
      state.email = null;
      state.role = null;
      state.error = false;
      state.isLog = false;
    },
    setTokens: (state, action) => {
      const { access, refresh } = action.payload;
      state.access = access;
      state.refresh = refresh;
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    setInfos: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.isLog = true;
    },
  },
});

// Export actions
export const { logout, setTokens, clearTokens, setInfos } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
