import { fetchSpecies } from "./speciesSlice";
import { addToastListeners } from "../../listeners/addToastListener";
import formatApiError from "../../../utils/formatApiError";

export const speciesListeners = (listenerMiddleware) => {
  addToastListeners(listenerMiddleware, {
    actionCreator: fetchSpecies,
    getErrorMessage: (action) => formatApiError(action.payload || action.error),
  });
};
