import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axiosCustom from "../../../api/axiosCustom";

export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async (_, thunkAPI) => {
    try {
      const response = await axiosCustom.get("/services");
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

const servicesAdapter = createEntityAdapter({
  selectId: (services) => services.serviceId,
});

const initialState = servicesAdapter.getInitialState({
  fetchStatus: "idle",
  error: null,
});

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.fetchStatus = "pending";
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        servicesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchServices.rejected, (state) => {
        state.fetchStatus = "rejected";
        state.error = action.payload;
      });
  },
});

export default servicesSlice.reducer;

export const {
  selectAll: selectAllServices,
  selectById: selectServiceById,
  selectIds: selectServiceIds,
} = servicesAdapter.getSelectors((state) => state.services);
