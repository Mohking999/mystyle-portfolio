import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: change "base" to match the GitHub Pages URL for the repository.
// For a user/organization repo served at:
// https://mohking999.github.io/portfolio/
// the correct Vite base is "/portfolio/".
export default defineConfig({
  plugins: [react()],
  base: "/portfolio/",
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          "three-vendor": ["three", "@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
});
