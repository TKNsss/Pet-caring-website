import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axiosCustom from "../../../api/axiosCustom";

export const fetchUserProfile = createAsyncThunk(
  "users/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const response = await axiosCustom.get(`/user/profile`);

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

export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (userData, thunkAPI) => {
    try {
      const response = await axiosCustom.patch(
        `/user/update-profile`,
        userData,
      );

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

export const changePassword = createAsyncThunk(
  "users/changePassword",
  async (passwordData, thunkAPI) => {
    try {
      const response = await axiosCustom.patch(
        `/user/change-password`,
        passwordData,
      );

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

export const uploadUserAvatar = createAsyncThunk(
  "users/uploadUserAvatar",
  async (formData, thunkAPI) => {
    try {
      // the headers here will override the one within axiosCustom
      const response = await axiosCustom.post(`/user/upload-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

const usersAdapter = createEntityAdapter({
  selectId: (users) => users.user_id,
});

const initialState = usersAdapter.getInitialState({
  fetchStatus: "idle",
  updateStatus: "idle",
  changePwStatus: "idle",
  uploadAvaStatus: "idle",
  error: null,
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.fetchStatus = "pending";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        usersAdapter.setOne(state, action.payload);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.fetchStatus = "rejected";
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updateStatus = "pending";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        usersAdapter.updateOne(state, {
          id: action.payload.user.user_id,
          changes: action.payload.user,
        });
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateStatus = "rejected";
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.changePwStatus = "pending";
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePwStatus = "succeeded";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePwStatus = "rejected";
        state.error = action.payload;
      })
      .addCase(uploadUserAvatar.pending, (state) => {
        state.uploadAvaStatus = "pending";
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        state.uploadAvaStatus = "succeeded";
        usersAdapter.updateOne(state, {
          id: action.payload.user_id,
          changes: {
            avatar_url: action.payload.url,
          },
        });
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.uploadAvaStatus = "rejected";
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
export const { selectById: selectUser } = usersAdapter.getSelectors(
  (state) => state.users,
);

export const selectCurrentUser = (state) => {
  const token = state.auth.token;
  if (!token) return null;

  try {
    // decoding token package
    const decoded = jwtDecode(token);
    const userId =
      decoded?.[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];

    if (!userId) return null;

    const user = selectUser(state, userId);
    return user || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
