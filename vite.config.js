import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5215',
        changeOrigin: true,
        secure: false,
        // ✅ Force headers to be forwarded
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Forward all headers
            const authHeader = req.headers.authorization;
            if (authHeader) {
              proxyReq.setHeader('Authorization', authHeader);
              console.log('✅ Auth header forwarded to backend');
            } else {
              console.log('❌ No auth header in request');
            }
          });
        }
      },
      '/hubs': {  // ← Add this for SignalR
        target: 'https://localhost:7215',
        changeOrigin: true,
        secure: false,
        ws: true  // ← Important for WebSockets
      }
    }
  }
})