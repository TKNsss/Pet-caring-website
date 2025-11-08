import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5247/api/v1", // Proxy API calls to ASP.NET Core backend (avoid cors issues)
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
