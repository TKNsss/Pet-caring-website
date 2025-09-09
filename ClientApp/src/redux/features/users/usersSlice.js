import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import handleApiRequest from "../../../utils/apiHandler";

// --- Async Thunks ---
export const fetchUserProfile = createAsyncThunk(
  "users/fetchUserProfile",
  (_, thunkAPI) => handleApiRequest("get", "/user/profile", null, thunkAPI),
);

export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  (userData, thunkAPI) =>
    handleApiRequest("patch", "/user/update-profile", userData, thunkAPI),
);

export const changePassword = createAsyncThunk(
  "users/changePassword",
  (passwordData, thunkAPI) =>
    handleApiRequest("patch", "/user/change-password", passwordData, thunkAPI),
);

export const uploadUserAvatar = createAsyncThunk(
  "users/uploadUserAvatar",
  (formData, thunkAPI) =>
    handleApiRequest("post", "/user/upload-avatar", formData, thunkAPI, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
);

// --- Entity Adapter ---
const usersAdapter = createEntityAdapter({
  selectId: (users) => users.userId,
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
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.fetchStatus = "pending";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        usersAdapter.setOne(state, action.payload.data);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.fetchStatus = "rejected";
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.updateStatus = "pending";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        usersAdapter.updateOne(state, {
          id: action.payload.data.userId,
          changes: action.payload.data,
        });
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateStatus = "rejected";
        state.error = action.payload;
      })
      // Change Password
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
      // Upload Avatar
      .addCase(uploadUserAvatar.pending, (state) => {
        state.uploadAvaStatus = "pending";
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        state.uploadAvaStatus = "succeeded";
        usersAdapter.updateOne(state, {
          id: action.payload.data.userId,
          changes: {
            avatarUrl: action.payload.data.avatarUrl,
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

// --- Selectors ---
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
