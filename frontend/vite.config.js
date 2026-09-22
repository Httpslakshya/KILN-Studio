import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        signup: resolve(__dirname, 'signup.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        carousel: resolve(__dirname, 'carousel.html'),
        processing: resolve(__dirname, 'processing.html'),
        chat: resolve(__dirname, 'chat.html'),
        document: resolve(__dirname, 'document.html'),
        live_rag: resolve(__dirname, 'live_rag.html')
      }
    }
  }
});
