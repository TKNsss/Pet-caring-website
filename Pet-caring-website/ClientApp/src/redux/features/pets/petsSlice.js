import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import axiosCustom from "../../../api/axiosCustom";

export const fetchPets = createAsyncThunk(
  "pets/fetchPets",
  async (_, thunkAPI) => {
    try {
      const response = await axiosCustom.get("/pets");
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const addPet = createAsyncThunk(
  "pets/addPet",
  async (petData, thunkAPI) => {
    try {
      const response = await axiosCustom.post("/pets", petData);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updateSinglePet = createAsyncThunk(
  "pets/updateSinglePet",
  async ({ petId, petData }, thunkAPI) => {
    try {
      const response = await axiosCustom.patch(`/pets/${petId}`, petData);

      if (response.status >= 200 && response.status < 300) {
        return { pet: response.data.pet, message: response.data.message };
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deletePet = createAsyncThunk(
  "pets/deletePet",
  async (petId, thunkAPI) => {
    try {
      const response = await axiosCustom.delete(`/pets/${petId}`);
      if (response.status >= 200 && response.status < 300) {
        return { id: petId, message: response.data.message };
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const uploadPetImage = createAsyncThunk(
  "pets/uploadPetImage",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosCustom.post(
        "/pets/upload-pet-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
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

const petsAdapter = createEntityAdapter({
  selectId: (pets) => pets.pet_id,
});

const initialState = petsAdapter.getInitialState({
  fetchStatus: "idle",
  addStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  uploadPetImgStatus: 'idle',
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending, (state) => {
        state.fetchStatus = "pending";
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        petsAdapter.setAll(state, action.payload);
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
        petsAdapter.addOne(state, action.payload.pet);
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
          id: action.payload.pet.pet_id,
          changes: action.payload.pet, // updated pet data
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
        petsAdapter.removeOne(state, action.payload.id);
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
          id: action.payload.pet_id,
          changes: {
            avatar_url: action.payload.url,
          },
        });
      })
      .addCase(uploadPetImage.rejected, (state, action) => {
        state.uploadPetImgStatus = "rejected";
        state.error = action.payload;
      })
  },
});

export default petsSlice.reducer;
export const { setSelectedPet, clearSelectedPet } = petsSlice.actions;

export const { selectAll: selectAllPets, selectById: selectPetById } =
  petsAdapter.getSelectors((state) => state.pets);

export const selectCurrentPetId = (state) => state.pets.selectedPetId;

// memoize the result - recalculates only when input values change (current pet's id or specific pet's data) => performance boost
export const selectCurrentPet = createSelector(
  [selectCurrentPetId, selectAllPets], // Select both the selected pet ID and all pets
  (selectedPetId, allPets) => {
    return selectedPetId
      ? allPets.find((pet) => pet.pet_id === selectedPetId)
      : null;
  },
);
