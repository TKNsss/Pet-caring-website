import { fetchServices } from "./servicesSlice";
import { addToastListeners } from "../../listeners/addToastListener";
import formatApiError from "../../../utils/formatApiError";

export const servicesListeners = (listenerMiddleware) => {
  addToastListeners(listenerMiddleware, {
    actionCreator: fetchServices,
    getErrorMessage: (action) => {
      const err = action.payload || action.error;
      return formatApiError(err);
    },
  });
};
