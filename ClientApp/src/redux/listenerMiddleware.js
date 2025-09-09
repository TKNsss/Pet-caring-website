import { createListenerMiddleware } from "@reduxjs/toolkit";
import { speciesListeners } from "./features/species/speciesListeners";
import { petsListeners } from "./features/pets/petsListeners";
import { usersListeners } from "./features/users/usersListeners";
import { authListeners } from "./features/auth/authListeners";
import { servicesListeners } from "./features/services/servicesListeners";

// create listener middleware instance
// The instance object is not the actual Redux middleware itself
// it contains the middleware and some instance methods used to add and remove listener entries within the middleware.
// it runs logic in response to Redux store updates instead of component props/state updates.
export const listenerMiddleware = createListenerMiddleware();

authListeners(listenerMiddleware);
usersListeners(listenerMiddleware);
speciesListeners(listenerMiddleware);
petsListeners(listenerMiddleware);
servicesListeners(listenerMiddleware);
