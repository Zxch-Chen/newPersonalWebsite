import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { vitePluginSubstackApi } from './vite-plugin-substack-api.js'

// Standalone alternate versions of the site: each is its own index.html at the
// repo root, served at /<name>. Dev needs the extension spelled out; Vercel
// does the same job through the rewrites in vercel.json.
const STANDALONE_PAGES = ['old', 'paper', 'launch', 'quotes']

function standalonePageRedirect() {
  const middleware = (req, res, next) => {
    const [path, query] = req.url.split('?')
    // The launch page is the homepage; the React app keeps its other routes.
    if (path === '/') req.url = '/launch/index.html' + (query ? `?${query}` : '')
    for (const page of STANDALONE_PAGES) {
      if (path === `/${page}` || path === `/${page}/`) {
        req.url = `/${page}/index.html` + (query ? `?${query}` : '')
        break
      }
    }
    next()
  }

  return {
    name: 'standalone-page-redirect',
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
    standalonePageRedirect(),
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
        paper: resolve(__dirname, 'paper/index.html'),
        launch: resolve(__dirname, 'launch/index.html'),
        quotes: resolve(__dirname, 'quotes/index.html'),
      },
    },
  },
  server: {
    port: 3000,
  },
})
