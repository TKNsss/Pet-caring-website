import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import handleApiRequest from "../../../utils/apiHandler";
import axiosCustom from "../../../api/axiosCustom";

export const fetchPets = createAsyncThunk("/pets/fetchPets", (_, thunkAPI) =>
  handleApiRequest("get", "/pets", null, thunkAPI),
);

export const addPet = createAsyncThunk("/pets/addPet", (petFormData, thunkAPI) =>
  handleApiRequest("post", "/pets", petFormData, thunkAPI, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
);

export const updateSinglePet = createAsyncThunk(
  "pets/updateSinglePet",
  ({ petId, petData }, thunkAPI) =>
    handleApiRequest("patch", `/pets/${petId}`, petData, thunkAPI),
);

export const deletePet = createAsyncThunk("pets/deletePet", (petId, thunkAPI) =>
  handleApiRequest("delete", `/pets/${petId}`, null, thunkAPI),
);

export const uploadPetImage = createAsyncThunk(
  "pets/uploadPetImage",
  (formData, thunkAPI) =>
    handleApiRequest("post", "/pets/upload-pet-image", formData, thunkAPI, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
);

const petsAdapter = createEntityAdapter({
  selectId: (pets) => pets.petId,
});

const initialState = petsAdapter.getInitialState({
  fetchStatus: "idle",
  addStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  uploadPetImgStatus: "idle",
  error: null,
  selectedPetId: null,
});

const petsSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    setSelectedPet: (state, action) => {
      state.selectedPetId = action.payload;
    },
    clearSelectedPet: (state) => {
      state.selectedPetId = null;
    },
    clearPets: (state) => {
      petsAdapter.removeAll(state);
      state.fetchStatus = "idle";
      state.selectedPetId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending, (state) => {
        state.fetchStatus = "pending";
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        petsAdapter.setAll(state, action.payload.data);
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.fetchStatus = "rejected";
        state.error = action.payload;
      })
      .addCase(addPet.pending, (state) => {
        state.addStatus = "pending";
      })
      .addCase(addPet.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        petsAdapter.addOne(state, action.payload.data);
      })
      .addCase(addPet.rejected, (state, action) => {
        state.addStatus = "rejected";
        state.error = action.payload;
      })
      .addCase(updateSinglePet.pending, (state) => {
        state.updateStatus = "pending";
      })
      .addCase(updateSinglePet.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        petsAdapter.updateOne(state, {
          id: action.payload.data.petId,
          changes: action.payload.data, // updated pet data
        });
      })
      .addCase(updateSinglePet.rejected, (state, action) => {
        state.updateStatus = "rejected";
        state.error = action.payload;
      })
      .addCase(deletePet.pending, (state) => {
        state.deleteStatus = "pending";
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        petsAdapter.removeOne(state, action.payload.data); // receive { data: petId } from BE
      })
      .addCase(deletePet.rejected, (state) => {
        state.deleteStatus = "rejected";
        state.error = action.payload;
      })
      .addCase(uploadPetImage.pending, (state) => {
        state.uploadPetImgStatus = "pending";
      })
      .addCase(uploadPetImage.fulfilled, (state, action) => {
        state.uploadPetImgStatus = "succeeded";
        petsAdapter.updateOne(state, {
          id: action.payload.data.petId,
          changes: {
            avatarUrl: action.payload.data.avatarUrl,
          },
        });
      })
      .addCase(uploadPetImage.rejected, (state, action) => {
        state.uploadPetImgStatus = "rejected";
        state.error = action.payload;
      });
  },
});

export default petsSlice.reducer;
export const { setSelectedPet, clearSelectedPet, clearPets } =
  petsSlice.actions;

// selectAllPets is already memoized by createEntityAdatper
export const { selectAll: selectAllPets, selectById: selectPetById } =
  petsAdapter.getSelectors((state) => state.pets);

export const selectCurrentPetId = (state) => state.pets.selectedPetId;

// memoize the result - recalculates only when input values change (current pet's id or specific pet's data) => performance boost
export const selectCurrentPet = createSelector(
  [selectCurrentPetId, selectAllPets], // Select both the selected pet ID and all pets
  (selectedPetId, allPets) => {
    return selectedPetId
      ? allPets.find((pet) => pet.petId === selectedPetId)
      : null;
  },
);
