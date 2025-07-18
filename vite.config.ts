import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as process from "process";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist', // Assure que le build sort dans dist/
    emptyOutDir: true, // Nettoie le dossier dist avant build
  },
  define: {
    'process.env': process.env, // Permet d'utiliser les variables d'env comme import.meta.env
  },
});
