import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  // GitHub Pages base path configuration
  // For GitHub Pages project sites, set base to: /${REPOSITORY_NAME}/
  // For GitHub Pages user/org sites, set base to: /
  // For local development or non-GitHub hosting, set base to: /
  base: '/fiasco-futball/',
  define: {
    'process.env': {},
  },
});