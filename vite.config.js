import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: change "base" to match the GitHub Pages URL for the repository.
// This project is served from the repository path on GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: "/mystyle-portfolio/",
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "three-vendor",
              test: /node_modules[\\/](?:three|@react-three[\\/](?:fiber|drei))[\\/]/,
            },
          ],
        },
      },
    },
  },
});
