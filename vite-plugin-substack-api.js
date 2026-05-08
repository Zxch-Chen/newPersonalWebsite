/**
 * Serve GET /api/substack in dev (parity with Vercel), so Writing uses live RSS locally.
 */
import { parseSubstackRSS, SUBSTACK_FEED_URL } from './lib/substackRss.js'

export function vitePluginSubstackApi() {
  return {
    name: 'vite-plugin-substack-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] || ''
        if (url !== '/api/substack' || req.method === 'OPTIONS') {
          return next()
        }

        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          return res.end()
        }

        if (req.method !== 'GET' && req.method !== 'HEAD') {
          return next()
        }

        try {
          const response = await fetch(SUBSTACK_FEED_URL, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; PersonalWebsite/1.0; dev)',
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }

          const xmlText = await response.text()
          const posts = parseSubstackRSS(xmlText)

          if (posts.length === 0) {
            throw new Error('No posts found in feed')
          }

          const body = JSON.stringify({
            posts,
            cached: false,
            dev: true,
            timestamp: Date.now(),
          })

          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          return res.end(body)
        } catch (err) {
          console.error('[dev /api/substack]', err.message)
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 500
          return res.end(
            JSON.stringify({
              error: 'Failed to fetch Substack feed',
              message: String(err.message),
            }),
          )
        }
      })
    },
  }
}
