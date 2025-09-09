import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import handleApiRequest from "../../../utils/apiHandler";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  status: "idle",
  error: null,
};

// receive 2 arguments: string - action type, "payload creator" - callback function return a promise containing data
export const login = createAsyncThunk(
  "auth/login",
  ({ email, password }, thunkAPI) =>
    handleApiRequest("post", "/auth/login", { email, password }, thunkAPI),
);

export const loginWithGoogle = createAsyncThunk(
  "auth/googleLogin",
  async (idToken, thunkAPI) => {
    try {
      const decoded = jwtDecode(idToken);
      const { email, given_name, family_name, picture } = decoded;

      return handleApiRequest(
        "post",
        "/auth/google-login",
        {
          idToken,
          email,
          firstName: given_name,
          lastName: family_name,
          picture,
        },
        thunkAPI,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  ({ username, email, password, confirmPassword, otpCode }, thunkAPI) =>
    handleApiRequest(
      "post",
      "/auth/register",
      {
        username,
        email,
        password,
        confirmPassword,
        ...(otpCode && { otpCode }),
      },
      thunkAPI,
    ),
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  ({ email }, thunkAPI) =>
    handleApiRequest("post", "/auth/forgot-password", { email }, thunkAPI),
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  ({ email, otpCode }, thunkAPI) =>
    handleApiRequest(
      "post",
      "/auth/reset-password",
      { email, otpCode },
      thunkAPI,
    ),
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      toast.info("Logged out successfully! 👋");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      // register
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
      })
      // forgotPassword
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      // resetPassword
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      // generic matchers for loading & error states
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        },
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
