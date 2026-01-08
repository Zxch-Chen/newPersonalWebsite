import { loadSubstackPosts } from './substack.js';

export function initNavigation(dotArt) {
    const tabs = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.tab-content');

    // Force scroll to top on hard refresh/initial load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Memory for scroll positions per tab
    const scrollPositions = {
        'resume': 0,
        'writing': 0,
        'arts': 0
    };
    let currentActiveTab = '';

    // Map tabs to background image sets
    const backgrounds = {
        'resume': [
            './assets/golden-gate-3.png',
            './assets/golden-gate.png',
            './assets/golden-gate-2.png'
        ],
        'writing': [
            './assets/nyc-times-square.jpg',
            './assets/nyc-liberty.jpg',
            './assets/nyc-skyline.jpg'
        ],
        'arts': [
            './assets/arts-skyline-bw.jpg',
            './assets/arts-lowell-snow.jpg',
            './assets/arts-customhouse.jpg'
        ]
    };

    function switchTab(tabId) {
        if (tabId === currentActiveTab) return;

        // Save current scroll position before switching
        if (currentActiveTab) {
            scrollPositions[currentActiveTab] = window.scrollY;
        }

        // 1. UPDATE STATE IMMEDIATELY
        currentActiveTab = tabId;

        // 2. Update Content Manager Tab
        if (window.contentManager) {
            window.contentManager.setTab(tabId);
        }

        // Update active nav UI
        tabs.forEach(t => {
            if (t.dataset.tab === tabId) t.classList.add('active');
            else t.classList.remove('active');
        });

        // Update active section visibility
        sections.forEach(s => {
            if (s.id === tabId) s.classList.add('active');
            else s.classList.remove('active');
        });

        // Ensure global dynamic content is visible
        const dynamicContent = document.getElementById('dynamic-content');
        if (dynamicContent) {
            dynamicContent.style.display = (tabId === 'resume' || tabId === 'writing' || tabId === 'arts') ? 'block' : 'none';
        }

        // Isolate scroll proxies to their respective tabs
        const resumeProxy = document.getElementById('scroll-proxy');
        if (resumeProxy) resumeProxy.style.display = (tabId === 'resume') ? 'block' : 'none';

        const writingProxy = document.getElementById('writing-scroll-proxy');
        if (writingProxy) writingProxy.style.display = (tabId === 'writing') ? 'block' : 'none';

        const artsProxy = document.getElementById('arts-scroll-proxy');
        if (artsProxy) artsProxy.style.display = (tabId === 'arts') ? 'block' : 'none';

        // Update background art
        dotArt.setArtSet(backgrounds[tabId], tabId);
        dotArt.setCurrentTab(tabId);

        // Force a clear of any stale text masks from the previous tab
        dotArt.updateTextRects();

        // Restore scroll position
        window.scrollTo(0, scrollPositions[tabId]);

        // 3. IMMEDIATE RE-RENDER (Don't just wait for the scroll event)
        // This solves the "images don't load in the first frame" issue
        if (window.dispatchEvent) {
            window.dispatchEvent(new Event('scroll'));
        }

        // Load content if needed
        if (tabId === 'writing') {
            loadSubstackPosts().then(posts => {
                if (posts && window.contentManager) {
                    window.contentManager.updateWritingPosts(posts);
                }
            });
        }
    }

    // Event listeners
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            switchTab(tabId);
        });
    });

    // Initial load
    switchTab('resume');

    // Silent Pre-warm of ALL background art to make tab switching instant
    Object.keys(backgrounds).forEach(tabId => {
        const urls = backgrounds[tabId];
        if (urls && urls.length > 0) {
            dotArt.preWarm(urls, tabId);
        }
    });
}
