import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axiosCustom from "../../../api/axiosCustom";

export const fetchSpecies = createAsyncThunk(
  "species/fetchSpecies",
  async (_, thunkAPI) => {
    try {
      const response = await axiosCustom.get("/species");

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue({
        message: err?.message || "Unable to fetch species",
      });
    }
  },
);

// by default redux/toolkit read id not spc_id
const speciesAdapter = createEntityAdapter({
  // This tells Redux Toolkit how to uniquely identify each entity using spcId instead of the default id.
  selectId: (species) => species.spc_id,
});

// species are being kept as a lookup table in state.entities (just like hashmap) -> O(1) for accessing a specific item with entities[id]
const initialState = speciesAdapter.getInitialState({
  fetchStatus: "idle",
  error: null,
});

const speciesSlice = createSlice({
  name: "species",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecies.pending, (state) => {
        state.fetchStatus = "pending";
      })
      .addCase(fetchSpecies.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        // When we receive the fetchSpecies.fulfilled action, we can use the speciesAdapter.setAll function to add all of the incoming species to the state, by passing in the draft state and the array of species in action.payload.
        speciesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchSpecies.rejected, (state, action) => {
        state.fetchStatus = "rejected";
        state.error = action.payload;
      });
  },
});

export default speciesSlice.reducer;

export const { selectAll: selectAllSpecies } = speciesAdapter.getSelectors(
  (state) => state.species,
);
