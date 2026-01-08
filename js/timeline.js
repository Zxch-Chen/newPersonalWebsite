export function initTimeline(dotArt, contentManager) {
    if (!contentManager) {
        console.error("ContentManager is required for timeline initialization");
        return;
    }

    // Initial check
    updateState();

    window.addEventListener('scroll', () => {
        updateState();
    });

    function updateState() {
        if (!contentManager.container) return;

        const tabId = dotArt.currentTab;

        const scrollY = window.scrollY;

        // Dynamic Segment Height based on tab? (For now keep consistent)
        const segmentHeight = window.innerHeight * 0.8;
        let index = Math.floor(scrollY / segmentHeight);

        const maxIndex = contentManager.getLength() - 1;
        if (index > maxIndex) index = maxIndex;
        if (index < 0) index = 0;

        // 1. Update Text & Position
        contentManager.update(index);

        // 2. Update Art Scene
        const sceneIndex = contentManager.getSceneIndex(index);
        dotArt.morphTo(sceneIndex);

        // 3. Visibility Management (Canvas + Dynamic Content)
        const canvas = document.getElementById('dot-canvas');
        let hideScrolly = false;

        if (tabId === 'resume') {
            const staticResume = document.getElementById('static-resume');
            if (staticResume) {
                const rect = staticResume.getBoundingClientRect();
                hideScrolly = rect.top < window.innerHeight;
            }
        } else if (tabId === 'writing') {
            const feed = document.getElementById('substack-feed-container');
            if (feed) {
                const rect = feed.getBoundingClientRect();
                hideScrolly = rect.top < window.innerHeight;
            }
        } else if (tabId === 'arts') {
            const staticArts = document.getElementById('arts-static-content');
            if (staticArts) {
                const rect = staticArts.getBoundingClientRect();
                hideScrolly = rect.top < window.innerHeight;
            }
        }

        contentManager.container.style.opacity = hideScrolly ? '0' : '1';
        // Setting pointer-events to none when hidden ensures no ghost elements block the site
        contentManager.container.style.pointerEvents = hideScrolly ? 'none' : 'none';
        
        // Actually, we want children (cards/blocks) to be clickable only if NOT hidden
        const children = contentManager.container.querySelectorAll('.art-card, .content-block');
        children.forEach(child => {
            child.style.pointerEvents = hideScrolly ? 'none' : 'auto';
        });

        if (canvas) canvas.style.opacity = hideScrolly ? '0' : '1';
    }
}
