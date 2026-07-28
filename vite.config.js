// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,  // ← Add this
  },
  server: {
    sourcemap: true,
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
   // ⭐ ADD THIS FOR PRODUCTION BUILD
  define: {
    'process.env.VITE_API_URL': JSON.stringify(
      process.env.NODE_ENV === 'production' 
        ? 'https://emotionalistic-audient-darrick.ngrok-free.dev/mpamoja'
        : ''
    )
  }
})