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
        manualChunks: {
          "three-vendor": ["three", "@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
});
