import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any fetch starting with '/steam-api' will be proxied to Steam
      '/steam-api': {
        target: 'https://store.steampowered.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/steam-api/, '')
      },
      '/bgg-api': {
        target: 'https://boardgamegeek.com', // Must be bare domain, no 'www'
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/bgg-api/, '')
      }
    }
  },
    test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  }
})