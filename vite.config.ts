import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://namishou.github.io/pwa_sudoku/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
