import {
  deletePet,
  addPet,
  updateSinglePet,
  fetchPets,
  uploadPetImage,
} from "../pets/petsSlice";
import { addToastListeners } from "../../listeners/addToastListener";
import formatApiError from "../../../utils/formatApiError";

export const petsListeners = (listenerMiddleware) => {
  addToastListeners(listenerMiddleware, {
    actionCreator: deletePet,
    getSuccessMessage: (action) => action.payload?.message ?? "Pet deleted 🎉",
    getErrorMessage: (action) => {
      const err = action.payload || action.error;
      return formatApiError(err);
    },
  });

  addToastListeners(listenerMiddleware, {
    actionCreator: addPet,
    getSuccessMessage: (action) => action.payload?.message ?? "Pet added 🎉",
    getErrorMessage: (action) => {
      const err = action.payload || action.error;
      return formatApiError(err);
    },
  });

  addToastListeners(listenerMiddleware, {
    actionCreator: updateSinglePet,
    getSuccessMessage: (action) => action.payload?.message ?? "Pet updated 🎉",
    getErrorMessage: (action) => {
      const err = action.payload || action.error;
      return formatApiError(err);
    },
  });

  addToastListeners(listenerMiddleware, {
    actionCreator: fetchPets,
    getErrorMessage: (action) => {
      const err = action.payload || action.error;
      return formatApiError(err);
    },
  });

  addToastListeners(listenerMiddleware, {
    actionCreator: uploadPetImage,
    getSuccessMessage: (action) => action.payload?.message ?? "Pet image uploaded 🎉",
    getErrorMessage: (action) => {
      const err = action.payload || action.error;
      return formatApiError(err);
    },
  });
};
