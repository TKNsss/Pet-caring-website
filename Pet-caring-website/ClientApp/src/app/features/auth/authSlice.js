import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../constants";

const initialState = {
  username: null,
  password: null,
  status: "idle",
  error: null,
};

// receive 2 arguments: string - action type, "payload creator" - callback function return a promise containing data
export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {
        username,
        password,
      });
      return response.data;
    } catch (err) {
      // rejectWithValue ensures error is being customized
      // it allows to pass a custom error message to the rejected state in Redux.
      // Axios typically stores the error response in error.response.
      // error.message - a general error message from JavaScript
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password, confirmPassword }, thunkAPI) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/register`, {
        username,
        email,
        password,
        confirmPassword,
      });
      return response.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message)
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.username = action.payload.username;
        state.password = action.payload.password;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // error message
      });
  },
});

export default authSlice.reducer;
