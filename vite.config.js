import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: change "base" to match your GitHub repo name for GitHub Pages.
// For this repository, the site is served from:
// https://mohking999.github.io/mystyle-portfolio/
// If deploying to a custom domain or user/organization root page, set base to "/".
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
