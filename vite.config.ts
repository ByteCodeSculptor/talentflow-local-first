import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add this 'build' section to fix the production build
  build: {
    rollupOptions: {
      // This tells Vite's bundler to treat these packages as "external"
      // and not try to bundle them. Since the 'msw/browser' entry
      // point never actually uses them, this is safe to do.
      external: [
        '@inquirer/confirm',
        'yargs',
        'yargs-parser',
        'cli-width',
        'mute-stream',
        'signal-exit'
      ]
    }
  }
}));
