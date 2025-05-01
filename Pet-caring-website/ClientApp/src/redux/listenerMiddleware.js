import { createListenerMiddleware } from "@reduxjs/toolkit";
import { speciesListeners } from "./features/species/speciesListeners";
import { petsListeners } from "./features/pets/petsListeners";
import { usersListeners } from "./features/users/usersListeners";
import { authListeners } from "./features/auth/authListeners";

// create listener middleware instance
// The instance object is not the actual Redux middleware itself
// it contains the middleware and some instance methods used to add and remove listener entries within the middleware.
export const listenerMiddleware = createListenerMiddleware();

speciesListeners(listenerMiddleware);
petsListeners(listenerMiddleware);
usersListeners(listenerMiddleware);
authListeners(listenerMiddleware);
