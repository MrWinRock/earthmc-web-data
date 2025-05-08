// filepath: d:\Coding\earthmc-web-data\vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/earthmc-web-data/",
  server: {
    // Add this server configuration
    proxy: {
      // Proxy API requests starting with /api/v3 to the target server
      "/api/v3": {
        // Using a distinct prefix like /api helps avoid conflicts
        target: "https://api.earthmc.net",
        changeOrigin: true, // Important for the target server to correctly process the request
        secure: false, // Usually false for development unless target has strict SSL needs not met by proxy
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix before forwarding
      },
    },
  },
});
