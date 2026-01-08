// Vercel Serverless Function with global caching
// This provides a fast, cached endpoint for all users

let cachedData = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Return cached data if still fresh
    if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION) {
        console.log('Returning cached Substack data');
        return res.status(200).json({
            posts: cachedData,
            cached: true,
            timestamp: cacheTimestamp
        });
    }

    // Fetch fresh data from Substack
    try {
        console.log('Fetching fresh Substack data...');
        const feedUrl = 'https://zachchen.substack.com/feed';
        
        const response = await fetch(feedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; PersonalWebsite/1.0)'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const xmlText = await response.text();
        
        // Parse XML manually (no DOMParser in Node.js)
        const posts = parseRSSFeed(xmlText);

        if (posts.length === 0) {
            throw new Error('No posts found in feed');
        }

        // Update cache
        cachedData = posts;
        cacheTimestamp = Date.now();

        console.log(`Cached ${posts.length} posts successfully`);
        
        return res.status(200).json({
            posts: cachedData,
            cached: false,
            timestamp: cacheTimestamp
        });

    } catch (error) {
        console.error('Error fetching Substack feed:', error);
        
        // Return stale cache if available
        if (cachedData) {
            console.log('Returning stale cached data due to error');
            return res.status(200).json({
                posts: cachedData,
                cached: true,
                stale: true,
                timestamp: cacheTimestamp
            });
        }

        // No cache available, return error
        return res.status(500).json({
            error: 'Failed to fetch Substack feed',
            message: error.message
        });
    }
}

// Simple RSS parser for Node.js environment
function parseRSSFeed(xmlText) {
    const posts = [];
    
    // Extract items using regex (lightweight alternative to XML parser)
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xmlText)) !== null && posts.length < 10) {
        const item = match[1];
        
        // Extract fields
        const title = extractTag(item, 'title');
        const link = extractTag(item, 'link');
        const description = extractTag(item, 'description');
        const pubDate = extractTag(item, 'pubDate');
        
        if (title && link) {
            // Clean description
            const cleanDescription = description
                .replace(/<!\[CDATA\[|\]\]>/g, '')
                .replace(/<[^>]*>/g, '')
                .trim()
                .substring(0, 200);
            
            // Format date
            let formattedDate = 'Recent';
            if (pubDate) {
                try {
                    formattedDate = new Date(pubDate).toLocaleDateString('en-US');
                } catch (e) {
                    // Keep default
                }
            }
            
            posts.push({
                title: cleanCDATA(title),
                link: cleanCDATA(link),
                description: cleanDescription || 'Read more on Substack',
                pubDate: formattedDate
            });
        }
    }
    
    return posts;
}

function extractTag(text, tagName) {
    const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
}

function cleanCDATA(text) {
    return text.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
}
