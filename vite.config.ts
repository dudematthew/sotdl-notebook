/// <reference types="vitest" />

import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    legacy(),
    {
      name: "markdown-loader",
      transform(code, id) {
        if (id.endsWith(".md")) {
          return {
            code: `export default ${JSON.stringify(code)}`,
            map: null,
          };
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
  define: {
    "import.meta.env.DEV": mode === "development",
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ionic-vendor': ['@ionic/react', '@ionic/react-router', 'ionicons'],
          'sentry-vendor': ['@sentry/react', '@sentry/replay', '@sentry/tracing'],
          'capacitor-vendor': [
            '@capacitor/core',
            '@capacitor/camera',
            '@capacitor/filesystem',
            '@capacitor/preferences',
          ],
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  assetsInclude: ["**/*.md"],
}));
