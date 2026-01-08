export async function loadSubstackPosts() {
    const container = document.getElementById('substack-feed');
    const CACHE_KEY = 'substack_posts_cache_v2';
    const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

    // 1. Try to load from cache immediately
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        try {
            const { posts, timestamp } = JSON.parse(cachedData);
            renderPosts(posts);
            // If cache is fresh, return posts and don't bother fetching
            if (Date.now() - timestamp < CACHE_EXPIRY) {
                return posts;
            }
        } catch (e) {
            console.warn('Cache corrupted, clearing...');
            localStorage.removeItem(CACHE_KEY);
        }
    }

    // 2. Fetch from network
    const feedUrl = 'https://zachchen.substack.com/feed';
    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(feedUrl);

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        if (items.length === 0) {
            if (!container.innerHTML || container.innerHTML.includes('Loading')) {
                container.innerHTML = '<p>No posts found.</p>';
            }
            return;
        }

        const posts = Array.from(items).slice(0, 10).map(item => {
            const rawDescription = item.querySelector("description") ? item.querySelector("description").textContent : "";
            // Strip HTML tags and CDATA markers
            const cleanDescription = rawDescription
                .replace(/<!\[CDATA\[|\]\]>/g, '')  // Remove CDATA markers
                .replace(/<[^>]*>?/gm, '')           // Remove HTML tags
                .trim();

            return {
                title: item.querySelector("title").textContent,
                link: item.querySelector("link").textContent,
                description: cleanDescription,
                pubDate: new Date(item.querySelector("pubDate").textContent).toLocaleDateString()
            };
        });

        // 3. Save to cache and render
        localStorage.setItem(CACHE_KEY, JSON.stringify({ posts, timestamp: Date.now() }));
        renderPosts(posts);
        return posts;

    } catch (error) {
        console.error('Error fetching Substack feed:', error);
        if (!container.innerHTML || container.innerHTML.includes('Loading')) {
            container.innerHTML = '<p>Failed to load posts. Visit <a href="https://zachchen.substack.com">zachchen.substack.com</a> to read.</p>';
        }
    }
}

function renderPosts(posts) {
    const container = document.getElementById('substack-feed');
    let html = '';
    posts.forEach(post => {
        html += `
            <a href="${post.link}" target="_blank" class="post-item">
                <div class="post-date">${post.pubDate}</div>
                <div class="post-title">${post.title}</div>
                ${post.description ? `<div class="post-subtitle">${post.description}</div>` : ''}
            </a>
        `;
    });
    container.innerHTML = html;
}
