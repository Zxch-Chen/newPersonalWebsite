// Vercel Serverless Function with global caching
// This provides a fast, cached endpoint for all users

import { parseSubstackRSS, SUBSTACK_FEED_URL } from '../lib/substackRss.js'

let cachedData = null
let cacheTimestamp = 0
const CACHE_DURATION = 3 * 24 * 60 * 60 * 1000 // 3 days

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    // Return cached data if still fresh
    if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION) {
        console.log('Returning cached Substack data')
        return res.status(200).json({
            posts: cachedData,
            cached: true,
            timestamp: cacheTimestamp
        })
    }

    // Fetch fresh data from Substack
    try {
        console.log('Fetching fresh Substack data...')
        
        const response = await fetch(SUBSTACK_FEED_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; PersonalWebsite/1.0)'
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const xmlText = await response.text()
        
        const posts = parseSubstackRSS(xmlText)

        if (posts.length === 0) {
            throw new Error('No posts found in feed')
        }

        cachedData = posts
        cacheTimestamp = Date.now()

        console.log(`Cached ${posts.length} posts successfully`)
        
        return res.status(200).json({
            posts: cachedData,
            cached: false,
            timestamp: cacheTimestamp
        })

    } catch (error) {
        console.error('Error fetching Substack feed:', error)
        
        if (cachedData) {
            console.log('Returning stale cached data due to error')
            return res.status(200).json({
                posts: cachedData,
                cached: true,
                stale: true,
                timestamp: cacheTimestamp
            })
        }

        return res.status(500).json({
            error: 'Failed to fetch Substack feed',
            message: error.message
        })
    }
}
