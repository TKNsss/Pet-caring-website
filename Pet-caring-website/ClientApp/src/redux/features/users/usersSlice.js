import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import handleError from "../../../utils/error";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: null,
  error: null,
  refreshTrigger: 0,
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
      });
      return response.data.user;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.patch(
        `${API_BASE_URL}/user/update-profile`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(`${response.data.message} 🎉`);
      return response.data.user;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.patch(
        `${API_BASE_URL}/user/change-password`,
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(`${response.data.message} 🎉`);
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  },
);

export const uploadUserAvatar = createAsyncThunk("users/uploadUserAvatar", async (formData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token; 

    const response = await axios.post(`${API_BASE_URL}/user/upload-avatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success(`${response.data.message} 🎉`);
  } catch (err) {
    return handleError(err, thunkAPI);
  }
})

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    triggerRefreshUserProfile: (state) => {
      state.refreshTrigger += 1;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
      })
  },
});

export const { triggerRefreshUserProfile } = usersSlice.actions;
export default usersSlice.reducer;
