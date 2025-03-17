import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { MediaQueryProvider } from "./hooks/MediaQueryProvider.jsx";

import { Provider } from "react-redux";
import { store } from "./app/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <MediaQueryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MediaQueryProvider>
    </Provider>
  </StrictMode>,
);
