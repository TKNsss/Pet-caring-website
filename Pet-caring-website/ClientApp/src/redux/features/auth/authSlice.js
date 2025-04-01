import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import handleError from "../../../utils/error";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  status: "idle",
  error: null,
};

// receive 2 arguments: string - action type, "payload creator" - callback function return a promise containing data
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      // save to localStorage
      localStorage.setItem("token", response.data.token);
      toast.success(`${response.data.message} 🎉`);
      return response.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password, confirmPassword }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password,
        confirmPassword,
      });
      toast.success(`${response.data.message} 🎉`);
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/logout`);
    localStorage.removeItem("token");
    toast.info(`${response.data.message} 👋`);
    return null;
  } catch (err) {
    return handleError(err, thunkAPI);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.token = null;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateToken } = authSlice.actions;
export default authSlice.reducer;
