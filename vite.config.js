import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: change "base" to match your GitHub repo name for GitHub Pages.
// If deploying to https://mohking999.github.io/portfilo/ keep it as "/portfilo/".
// If deploying to a custom domain or user/organization root page, set base to "/".
export default defineConfig({
  plugins: [react()],
  base: "/portfilo/",
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
