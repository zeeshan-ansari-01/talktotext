import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  fetchCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
} from "@/services/authService";
import { getErrorMessage } from "@/services/api";

// Page khulte hi: kya user pehle se logged-in hai?
export const loadCurrentUser = createAsyncThunk(
  "auth/loadCurrentUser",
  async () => fetchCurrentUser()
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      await loginUser(credentials);
      return await fetchCurrentUser();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (details, { rejectWithValue }) => {
    try {
      await registerUser(details);
      return await fetchCurrentUser();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutUser();
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    // false jab tak pehli baar /me ka jawab nahi aata
    initialized: false,
  },
  reducers: {
    // Naya post banne par ginti badhao
    postCreated(state) {
      if (state.user) state.user.postsCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        // Logged-in nahi hai (401), ye koi error nahi
        state.user = null;
        state.initialized = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { postCreated } = authSlice.actions;
export default authSlice.reducer;