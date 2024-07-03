import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

export const login = createAsyncThunk("login", async (param) => {
  const { username, password } = param;
  const response = await fetch("http://127.0.0.1:8000/users/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  if (response.status !== 200) {
    return rejectWithValue({ status: response.status });
  }
  const data = await response.json();
  console.log(data.access);
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
});

// Define async thunks for getInfo and token refresh
export const getInfo = createAsyncThunk(
  "getInfo",
  async (arg, { getState }) => {
    const state = getState();
    const access = localStorage.getItem("access_token");
    console.log(access);
    const response = await fetch("http://127.0.0.1:8000/users/myinfo/", {
      headers: {
        Authorization: "Bearer " + access,
      },
    });
    if (!response.ok) {
      // If response is not ok, reject with the response status
      return rejectWithValue({ status: response.status });
    }
    return await response.json();
  }
);

export const refreshTokens = createAsyncThunk(
  "refreshTokens",
  async (arg, { getState }) => {
    const state = getState();
    const refresh = localStorage.getItem("refresh_token");

    const response = await fetch("http://127.0.0.1:8000/users/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refresh, // Correctly access the refresh token from the state
      }),
    });
    if (!response.ok) {
      // If response is not ok, reject with the response status
      return rejectWithValue({ status: response.status });
    }
    return await response.json();
  }
);

// Create the cart slice with initial state and reducers
export const userSlice = createSlice({
  name: "user",
  initialState: {
    access: "",
    refresh: "",
    username: "",
    email: "",
    role: "",
    error: false,
    loaded: false,
    isLog: false,
  },
  reducers: {
    logout: (state) => {
      state.access = "";
      state.refresh = "";
      state.username = "";
      state.email = "";
      state.role = "";
      state.error = false;
    },
    setTokens: (state, action) => {
      const { access, refresh } = action.payload;
      state.access = access;
      state.refresh = refresh;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.isLog = true;
        state.error = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = true;
        state.loaded = false;
      })
      .addCase(getInfo.fulfilled, (state, action) => {
        state.loaded = true;
        state.email = action.payload.email;
        state.username = action.payload.username;
        state.role = action.payload.role;
        state.error = false;
      })
      .addCase(getInfo.rejected, (state, action) => {
        state.error = true;
        state.loaded = false;
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("refresh_token", action.payload.refresh);
        state.error = false;
      })
      .addCase(refreshTokens.rejected, (state, action) => {
        state.error = true;
      });
  },
});

// Export actions
export const { logout, setTokens } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
