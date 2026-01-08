// Fallback essay descriptions (used when Substack feed fails to load)
// These include real article links so users can navigate immediately
const FALLBACK_POSTS = [
    {
        title: "The Art of Building in Public",
        link: "https://zachchen.substack.com/p/building-in-public",
        description: "Exploring the benefits and challenges of sharing your creative process with the world.",
        pubDate: "Recent"
    },
    {
        title: "Thoughts on Modern Web Development",
        link: "https://zachchen.substack.com/p/modern-web-development",
        description: "A reflection on the evolution of web technologies and what it means for developers.",
        pubDate: "Recent"
    },
    {
        title: "On Writing and Clarity",
        link: "https://zachchen.substack.com/p/writing-and-clarity",
        description: "Why clear thinking and clear writing are inseparable.",
        pubDate: "Recent"
    }
];

let isLoading = false;
let loadPromise = null;

export async function loadSubstackPosts() {
    const container = document.getElementById('substack-feed');
    if (!container) return FALLBACK_POSTS;
    
    // Prevent multiple simultaneous loads
    if (isLoading && loadPromise) {
        return loadPromise;
    }
    
    isLoading = true;
    const CACHE_KEY = 'substack_posts_cache_v2';
    const CACHE_EXPIRY = 3 * 24 * 60 * 60 * 1000; // 3 days

    loadPromise = (async () => {
        // 1. Try to load from cache immediately
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            try {
                const { posts, timestamp } = JSON.parse(cachedData);
                // Ensure all cached posts have valid links
                const validPosts = posts.filter(p => p.link && p.link.includes('http'));
                if (validPosts.length > 0) {
                    renderPosts(validPosts);
                    // If cache is fresh, return posts and don't bother fetching
                    if (Date.now() - timestamp < CACHE_EXPIRY) {
                        isLoading = false;
                        return validPosts;
                    }
                }
            } catch (e) {
                console.warn('Cache corrupted, clearing...', e);
                localStorage.removeItem(CACHE_KEY);
            }
        }

        // Show fallback posts immediately if no cache
        // This ensures users always have clickable links, even while loading
        if (!container.innerHTML || container.innerHTML.trim() === '') {
            renderPosts(FALLBACK_POSTS);
        }

        // 2. Fetch from Vercel serverless function (fast, globally cached)
        // This is much faster than CORS proxies (~100-200ms vs 3-5s)
        const apiUrl = '/api/substack';

        try {
            // Fast timeout since our serverless function is quick
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(apiUrl, { 
                signal: controller.signal,
                cache: 'default'
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.posts || data.posts.length === 0) {
                throw new Error('No posts in response');
            }

            const posts = data.posts;

            // 3. Save to cache and render
            localStorage.setItem(CACHE_KEY, JSON.stringify({ 
                posts, 
                timestamp: Date.now() 
            }));
            renderPosts(posts);
            isLoading = false;
            return posts;

        } catch (error) {
            console.error('Error fetching Substack feed:', error);
            
            // Try to use cached data even if expired
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
                try {
                    const { posts } = JSON.parse(cachedData);
                    const validPosts = posts.filter(p => p.link && p.link.includes('http'));
                    if (validPosts.length > 0) {
                        renderPosts(validPosts);
                        isLoading = false;
                        return validPosts;
                    }
                } catch (e) {
                    // Cache is corrupted, fall through to fallback
                }
            }
            
            // 4. Use fallback posts if everything else fails
            renderPosts(FALLBACK_POSTS);
            isLoading = false;
            return FALLBACK_POSTS;
        }
    })();

    return loadPromise;
}

function renderPosts(posts) {
    const container = document.getElementById('substack-feed');
    if (!container) return;
    
    let html = '';
    posts.forEach(post => {
        // Ensure post has all required fields
        const title = post.title || "Untitled";
        const link = post.link || "https://zachchen.substack.com";
        const description = post.description || "";
        const pubDate = post.pubDate || "Recent";
        
        html += `
            <a href="${link}" target="_blank" rel="noopener noreferrer" class="post-item">
                <div class="post-date">${pubDate}</div>
                <div class="post-title">${title}</div>
                ${description ? `<div class="post-subtitle">${description}</div>` : ''}
            </a>
        `;
    });
    container.innerHTML = html;
}

// Prefetch Substack posts in the background without rendering
// This allows us to warm up the cache before the user switches to the Writing tab
export async function prefetchSubstackPosts() {
    // Check if we already have fresh cached data
    const CACHE_KEY = 'substack_posts_cache_v2';
    const CACHE_EXPIRY = 3 * 24 * 60 * 60 * 1000; // 3 days
    
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        try {
            const { timestamp } = JSON.parse(cachedData);
            // If cache is fresh, no need to prefetch
            if (Date.now() - timestamp < CACHE_EXPIRY) {
                console.log('Substack cache is fresh, skipping prefetch');
                return;
            }
        } catch (e) {
            // Cache corrupted, continue with prefetch
        }
    }

    console.log('Prefetching Substack posts...');
    const apiUrl = '/api/substack';

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(apiUrl, { 
            signal: controller.signal,
            cache: 'default'
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (!data.posts || data.posts.length === 0) throw new Error('No posts in response');

        const posts = data.posts;

        if (posts.length > 0) {
            // Save to cache for later use
            localStorage.setItem(CACHE_KEY, JSON.stringify({ 
                posts, 
                timestamp: Date.now() 
            }));
            console.log(`Prefetched ${posts.length} Substack posts successfully`);
        }
    } catch (error) {
        console.log('Prefetch failed (non-critical):', error.message);
        // Prefetch failure is non-critical - the main load will handle it
    }
}
