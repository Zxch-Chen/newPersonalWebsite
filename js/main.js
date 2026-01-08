import { DotArtEngine } from './dotArt.js';
import { initNavigation } from './navigation.js';
import { initTimeline } from './timeline.js';
import { ContentManager } from './contentManager.js';
import { prefetchSubstackPosts } from './substack.js';

// Handle scroll position conservation and reset
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Art Engine
    const dotArt = new DotArtEngine('dot-canvas');

    // Initialize Content Manager
    const contentManager = new ContentManager();
    window.contentManager = contentManager;

    // Initialize Timeline Animations with Art Control
    initTimeline(dotArt, contentManager);

    // Initialize Navigation (which also controls Art switching)
    initNavigation(dotArt);

    // Prefetch Substack posts in the background while user is on Resume tab
    // This ensures data is ready when they switch to Writing tab
    prefetchSubstackPosts();

    // Prefetch arts images/video for instant loading when user switches to Arts tab
    contentManager.prefetchArts();

    console.log('Zach Chen Personal Website Initialized');
});
