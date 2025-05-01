import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import handleError from "../../../utils/error";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSpecies = createAsyncThunk(
  "species/fetchSpecies",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/species`);
      return response.data;
    } catch (err) {
      return handleError(err, thunkAPI);
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
  status: "idle",
  error: null,
});

const speciesSlice = createSlice({
  name: "species",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecies.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchSpecies.fulfilled, (state, action) => {
        state.status = "succeeded";
        // When we receive the fetchSpecies.fulfilled action, we can use the speciesAdapter.setAll function to add all of the incoming species to the state, by passing in the draft state and the array of species in action.payload.
        speciesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchSpecies.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      });
  },
});

export default speciesSlice.reducer;

export const { selectAll: selectAllSpecies } = speciesAdapter.getSelectors(
  (state) => state.species,
);
