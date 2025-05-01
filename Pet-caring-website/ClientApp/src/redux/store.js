import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice.js";
import usersReducer from "./features/users/usersSlice.js";
import speciesReducer from "./features/species/speciesSlice.js";
import petsReducer from "./features/pets/petsSlice.js";
import { listenerMiddleware } from "./listenerMiddleware.js";

// getDefaultMiddleware returns a middleware array.
// listenerMiddleware often listens for dispatched actions before any reducers or thunks touch them.

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    species: speciesReducer,
    pets: petsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
