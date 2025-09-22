import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "/", // важно для BrowserRouter
  plugins: [react()],
  resolve: {
    alias: {
      path: "path-browserify",
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
