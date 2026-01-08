import { DotArtEngine } from './dotArt.js';
import { initNavigation } from './navigation.js';
import { initTimeline } from './timeline.js';
import { ContentManager } from './contentManager.js';

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

    console.log('Zach Chen Personal Website Initialized');
});
