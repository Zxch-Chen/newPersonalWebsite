import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { vitePluginSubstackApi } from './vite-plugin-substack-api.js'

// Every design of the site stays up under its own version prefix:
//   /v1/...  the halftone site with the city backgrounds   (v1/index.html)
//   /v2/...  the beige/dark React site                      (index.html + src/, built to app.html)
//   /v3/...  the horizon-film site, also served at /        (v3/index.html)
// Dev mirrors what vercel.json does in production.
const V3_PATHS = ['/', '/writing', '/quotes', '/aesthetics']
const REDIRECTS = { '/old': '/v1', '/launch': '/', '/paper': '/', '/resume': '/', '/thoughts': '/quotes', '/v2/resume': '/v2' }

function versionRouter() {
  const middleware = (req, res, next) => {
    const [raw, query] = req.url.split('?')
    const path = raw.replace(/\/+$/, '') || '/'
    const q = query ? `?${query}` : ''
    if (REDIRECTS[path]) { res.statusCode = 307; res.setHeader('Location', REDIRECTS[path] + q); return res.end() }
    if (/\.[a-z0-9]+$/i.test(path)) return next()           // real files pass through
    if (path === '/v1' || path.startsWith('/v1/')) req.url = '/v1/index.html' + q
    else if (path === '/v2' || path.startsWith('/v2/')) req.url = '/index.html' + q
    else if (path === '/v3' || path.startsWith('/v3/') || V3_PATHS.includes(path)) req.url = '/v3/index.html' + q
    next()
  }

  return {
    name: 'version-router',
    // `vite dev` and `vite preview` are separate servers and neither inherits
    // the other's middleware, so both hooks are needed.
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

export default defineConfig({
  plugins: [
    versionRouter(),
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
        v1: resolve(__dirname, 'v1/index.html'),
        v3: resolve(__dirname, 'v3/index.html'),
      },
    },
  },
  server: {
    port: 3000,
  },
})
