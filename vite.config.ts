import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "components": path.resolve(__dirname, "src/components"),
      "utils": path.resolve(__dirname, "src/utils"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: '@root-entry-name: default;',
      },
    },
  },
  server: {
    proxy: {
      "/api/v2": {
        target: "https://www.48.club",
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/v2/, 'api/v2'),
        secure: false,
      },
      "/api": {
        target: "https://inscription.48.club",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/v2": {
        target: "https://www.48.club",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/v2/, 'api/v2'),
        secure: false,
      },
      "/v3": {
        target: "https://explore.48.club/v3",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/v3/, ''),
        secure: false,
      },
    },
  },
})
