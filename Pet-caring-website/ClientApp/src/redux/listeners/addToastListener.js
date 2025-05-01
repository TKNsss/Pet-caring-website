import { toast } from "react-toastify";

// startListening: Adds a new listener entry to the middleware
// listenerMiddleware.startListening — what it is, why it's async
// effect is a function that gets called when a specific action occurs (like a thunk being fulfilled or rejected).
// Think of effect as the “side-effect handler” — kind of like useEffect in React, but for Redux actions.
// Redux Toolkit automatically passes the dispatched action to your effect when that action matches the one you’re listening for:

export const addToastListeners = (
  listenerMiddleware,
  { actionCreator, getSuccessMessage, getErrorMessage },
) => {
  if (getSuccessMessage) {
    listenerMiddleware.startListening({
      actionCreator: actionCreator.fulfilled,
      effect: async (action) => {
        // It calls getSuccessMessage(action) if provided, passing the action object.
        const msg = getSuccessMessage?.(action);
        toast.success(`${msg} 🎉`);
      },
    });
  }

  if (getErrorMessage) {
    listenerMiddleware.startListening({
      actionCreator: actionCreator.rejected,
      effect: async (action) => {
        const msg = getErrorMessage?.(action);
        toast.error(msg);
      },
    });
  }
};
