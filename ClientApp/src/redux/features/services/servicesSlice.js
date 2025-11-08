import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import handleApiRequest from "../../../utils/apiHandler";

const sanitizeParams = (params = {}) => {
  const merged = {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 6,
  };

  if (params.search?.trim()) merged.search = params.search.trim();
  if (params.type?.trim()) merged.type = params.type.trim();
  if (params.isActive !== undefined) merged.isActive = params.isActive;
  if (params.sortBy?.trim()) merged.sortBy = params.sortBy.trim();
  if (params.sortDescending !== undefined)
    merged.sortDescending = params.sortDescending;

  return merged;
};

export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  (params = {}, thunkAPI) =>
    handleApiRequest("get", "/services", null, thunkAPI, {
      params: sanitizeParams(params),
    }),
);

const servicesAdapter = createEntityAdapter({
  selectId: (service) => service.serviceId,
});

const initialState = servicesAdapter.getInitialState({
  fetchStatus: "idle",
  error: null,
  meta: {
    totalCount: 0,
    totalPages: 0,
    page: 1,
    pageSize: 6,
  },
  lastQuery: {
    page: 1,
    pageSize: 6,
  },
});

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state, action) => {
        state.fetchStatus = "pending";
        state.lastQuery = {
          ...state.lastQuery,
          ...(action.meta.arg || {}),
        };
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        const payload = action.payload ?? {};
        servicesAdapter.setAll(state, payload.data || []);
        state.meta = payload.meta
          ? {
              totalCount: payload.meta.totalCount ?? payload.meta.TotalCount ?? 0,
              totalPages: payload.meta.totalPages ?? payload.meta.TotalPages ?? 0,
              page: payload.meta.page ?? payload.meta.Page ?? state.lastQuery.page,
              pageSize:
                  payload.meta.pageSize ??
                  payload.meta.PageSize ??
                  state.lastQuery.pageSize,
            }
          : state.meta;
      })
      .addCase(fetchServices.rejected, (state, action) => {
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

export const selectServicesMeta = (state) => state.services.meta;
export const selectServicesFetchStatus = (state) => state.services.fetchStatus;
