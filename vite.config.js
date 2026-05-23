import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/BINGLE_MVP/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        presentation: 'bingle_presentation.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});

