import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import handleError from "../../../utils/error";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: null,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  "users/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token; // Get token from auth state

      if (!token) {
        toast.warning("No authenticated token found.");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      }); // ✅ Success message
      return response.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
