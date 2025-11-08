import { addToastListeners } from "../../listeners/addToastListener";
import { forgotPassword, login, register, resetPassword } from "./authSlice";
import formatApiError from "../../../utils/formatApiError";

/*
  - action.payload → is whatever you return inside your thunk when calling rejectWithValue() (or a successful return in fulfilled case).
  - action.error → is an automatically generated error object by Redux Toolkit, containing at least { message, name, code, stack } (if available).
*/

export const authListeners = (listenerMiddleware) => {
  addToastListeners(listenerMiddleware, {
    actionCreator: login,
    getSuccessMessage: (action) =>
      action.payload?.message ?? "User logged in 🎉",
    getErrorMessage: (action) => {
      const err = action.payload || action.error;
      return formatApiError(err);
    },
  });

  addToastListeners(listenerMiddleware, {
    actionCreator: register,
    getSuccessMessage: (action) =>
      action.payload?.message ?? "User registerd 🎉",
    getErrorMessage: (action) => {
      const err = action.payload || action.error;
      return formatApiError(err);
    },
  });

  addToastListeners(listenerMiddleware, {
    actionCreator: forgotPassword,
    getSuccessMessage: (action) =>
      action.payload?.message ?? "OTP sent 🎉",
    getErrorMessage: (action) => {
      const err = action.payload || action.error;
      return formatApiError(err);
    },
  });

  addToastListeners(listenerMiddleware, {
    actionCreator: resetPassword,
    getSuccessMessage: (action) =>
      action.payload?.message ?? "New password sent via email 🎉",
    getErrorMessage: (action) => {
      const err = action.payload || action.error;
      return formatApiError(err);
    },
  });
  
};
