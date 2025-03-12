import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { MediaQueryProvider } from "./hooks/MediaQueryProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MediaQueryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MediaQueryProvider>
  </StrictMode>,
);
