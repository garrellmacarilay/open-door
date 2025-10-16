import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindss()],
  root: '.',
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000',
    }
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: 'index.html',
    }
  }
})
