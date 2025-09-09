import {
  changePassword,
  fetchUserProfile,
  updateUserProfile,
  uploadUserAvatar,
} from "./usersSlice";
import { addToastListeners } from "../../listeners/addToastListener";
import formatApiError from "../../../utils/formatApiError";

export const usersListeners = (listenerMiddleware) => {
  addToastListeners(listenerMiddleware, {
    actionCreator: fetchUserProfile,
    getErrorMessage: (action) => formatApiError(action.payload || action.error),
  });

  addToastListeners(listenerMiddleware, {
    actionCreator: updateUserProfile,
    getSuccessMessage: (action) =>
      action.payload?.message ?? "User profile updated 🎉",
    getErrorMessage: (action) => formatApiError(action.payload || action.error),
  });

  addToastListeners(listenerMiddleware, {
    actionCreator: changePassword,
    getSuccessMessage: (action) =>
      action.payload?.message ?? "Password changed 🎉",
    getErrorMessage: (action) => formatApiError(action.payload || action.error),
  });

  addToastListeners(listenerMiddleware, {
    actionCreator: uploadUserAvatar,
    getSuccessMessage: (action) =>
      action.payload?.message ?? "Avatar uploaded 🎉",
    getErrorMessage: (action) => formatApiError(action.payload || action.error),
  });
};
