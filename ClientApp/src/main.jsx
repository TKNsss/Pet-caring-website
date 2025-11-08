import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { MediaQueryProvider } from "./contexts/MediaQueryProvider.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <MediaQueryProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MediaQueryProvider>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
