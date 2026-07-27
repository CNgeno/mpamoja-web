// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { 
        target: 'https://localhost:7215', 
        changeOrigin: true, 
        secure: false // Essential for local HTTPS
      },
      '/hubs': { 
        target: 'https://localhost:7215', 
        changeOrigin: true, 
        secure: false, 
        ws: true 
      },
    },
  },
})