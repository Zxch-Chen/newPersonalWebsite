import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { vitePluginSubstackApi } from './vite-plugin-substack-api.js'

function oldSiteRedirect() {
  return {
    name: 'old-site-redirect',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/old' || req.url === '/old/') {
          req.url = '/old/index.html'
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    oldSiteRedirect(),
    vitePluginSubstackApi(),
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80 },
      avif: { quality: 50 },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        old: resolve(__dirname, 'old/index.html'),
      },
    },
  },
  server: {
    port: 3000,
  },
})
