import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosCustom from "../../../api/axiosCustom";
import { toast } from "react-toastify";

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
      const response = await axiosCustom.post("/auth/login", {
        email,
        password,
      });
      // save to localStorage
      localStorage.setItem("token", response.data.token);

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password, confirmPassword, otpCode }, thunkAPI) => {
    try {
      // Build payload object
      const payload = {
        username,
        email,
        password,
        confirmPassword,
      };

      // Add OTP only if it's provided
      if (otpCode) {
        payload.otpCode = otpCode;
      }

      const response = await axiosCustom.post("/auth/register", payload);

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, thunkAPI) => {
    try {
      const response = await axiosCustom.post("/auth/forgot-password", {
        email,
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.message || err.message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otpCode }, thunkAPI) => {
    try {
      const response = await axiosCustom.post("/auth/reset-password", {
        email,
        otpCode,
      });
      
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.message || err.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      localStorage.removeItem("token");
      toast.info("Logged out successfully! 👋");
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
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

export const { updateToken, logout } = authSlice.actions;
export default authSlice.reducer;
