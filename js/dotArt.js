export class DotArtEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 40 };
        this.isInitializing = false;

        // State for morphing
        this.imageSet = [];  // Array of loaded Image objects
        this.currentSceneIndex = 0;
        this.targetSceneIndex = 0;
        this.currentTab = 'resume';
        this.isArtsTab = false;

        this.handleResize = this.handleResize.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.animate = this.animate.bind(this);

        // Optimized Caching
        this.sceneCache = {};      // tabId -> { particles, imageSet }
        this.sizeMapCache = {};    // url + grid -> sizeMap array
        this.gridSize = { cols: 0, rows: 0 };

        // Initial setup
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        window.addEventListener('resize', this.handleResize);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('scroll', () => this.updateTextRects());

        this.animate();
    }

    // Accepts an array of image URLs. 
    // If array has 1 item, it's a static image.
    // If multiple, they are morph targets.
    setArtSet(imageUrls, tabId) {
        if (!imageUrls || imageUrls.length === 0) {
            this.isArtsTab = (tabId === 'arts');
            this.currentTab = tabId;
            this.particles = [];
            this.imageSet = [];
            return;
        }

        this.isArtsTab = (tabId === 'arts');
        this.currentTab = tabId;

        // 1. Restore from cache ONLY if the cache is complete 
        // (i.e. has more than 1 image, or we only expect 1)
        if (this.sceneCache[tabId] && (this.sceneCache[tabId].imageSet.length === imageUrls.length)) {
            this.particles = this.sceneCache[tabId].particles.map(p => ({ ...p, currentSize: 0 }));
            this.imageSet = this.sceneCache[tabId].imageSet;
            this.currentSceneIndex = 0;
            this.targetSceneIndex = 0;
            return;
        }

        // Reset state before loading new set
        this.currentSceneIndex = 0;
        this.targetSceneIndex = 0;
        this.imageSet = [];
        this.particles = [];

        // Setup loading with race protection
        const imagesToLoad = imageUrls.map(url => {
            const img = new Image();
            return { img, url };
        });

        let firstImageLoaded = false;
        
        const checkReady = () => {
            if (this.currentTab !== tabId) return;

            const loaded = imagesToLoad.filter(item => item.img.complete && item.img.naturalWidth > 0);

            // Instant feedback: render with just the first image as soon as it loads
            if (!firstImageLoaded && loaded.length > 0) {
                firstImageLoaded = true;
                this.imageSet = [loaded[0].img];
                this.initParticles(tabId, false, true); // true = quick mode
            }

            // Wait for ALL targets to be ready to avoid caching/rendering partial sets
            if (loaded.length === imageUrls.length) {
                this.imageSet = imagesToLoad.map(item => item.img);
                this.initParticles(tabId);
            }
        };

        imagesToLoad.forEach((item, idx) => {
            item.img.onload = checkReady;
            item.img.onerror = () => console.warn(`Failed: ${item.url}`);
            item.img.src = item.url;
            if (item.img.complete) checkReady();
        });
    }

    // Process sets one by one in the background
    async preWarm(imageUrls, tabId) {
        if (!imageUrls || imageUrls.length === 0 || this.sceneCache[tabId]) return;

        // Wait for a small idle window
        await new Promise(res => setTimeout(res, 500));

        const images = imageUrls.map(url => {
            const img = new Image();
            return { img, url };
        });

        await Promise.all(images.map(item => new Promise(res => {
            item.img.onload = res;
            item.img.onerror = res;
            item.img.src = item.url;
            if (item.img.complete) res();
        })));

        const loadedImages = images.filter(item => item.img.complete && item.img.naturalWidth > 0).map(item => item.img);
        if (loadedImages.length > 0) {
            // Processing heavy math - do it when browser is quiet
            if (window.requestIdleCallback) {
                window.requestIdleCallback(() => this.backgroundInit(loadedImages, tabId));
            } else {
                setTimeout(() => this.backgroundInit(loadedImages, tabId), 10);
            }
        }
    }

    backgroundInit(images, tabId) {
        if (this.sceneCache[tabId]) return;
        
        // This is a background task, we must NOT overwrite this.imageSet 
        // because that's used by the active rendering loop.
        const originalSet = this.imageSet;
        this.imageSet = images;
        this.initParticles(tabId, true);
        this.imageSet = originalSet;
    }

    setCurrentTab(tabId) {
        this.currentTab = tabId;
        this.updateTextRects();
    }

    morphTo(index) {
        if (!this.imageSet || this.imageSet.length === 0) return;
        
        // Clamp index
        const actualIndex = Math.min(Math.max(0, index), this.imageSet.length - 1);
        if (this.targetSceneIndex === actualIndex) return;

        this.targetSceneIndex = actualIndex;
    }

    initParticles(tabId, silent = false, quickMode = false) {
        if (this.imageSet.length === 0) {
            return;
        }

        // Quick mode uses larger gap for instant initial render
        const gap = quickMode ? 18 : 12;
        const cols = Math.floor(this.width / gap);
        const rows = Math.floor(this.height / gap);
        this.gridSize = { cols, rows };

        const offCanvas = document.createElement('canvas');
        offCanvas.width = cols;
        offCanvas.height = rows;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
        const screenAspect = cols / rows;

        const sizeMaps = this.imageSet.map((img) => {
            const cacheKey = `${img.src}_${cols}x${rows}`;
            if (this.sizeMapCache[cacheKey]) return this.sizeMapCache[cacheKey];

            // Calculate independent crop for this specific image
            const imageNaturalWidth = img.naturalWidth || img.width;
            const imageNaturalHeight = img.naturalHeight || img.height;
            const currentImgAspect = imageNaturalWidth / imageNaturalHeight;
            let sWidth, sHeight, sx, sy;

            if (screenAspect > currentImgAspect) {
                sWidth = imageNaturalWidth;
                sHeight = imageNaturalWidth / screenAspect;
                sx = 0;
                sy = (imageNaturalHeight - sHeight) / 2;
            } else {
                sHeight = imageNaturalHeight;
                sWidth = imageNaturalHeight * screenAspect;
                sy = 0;
                sx = (imageNaturalWidth - sWidth) / 2;
            }

            const filename = img.src.toLowerCase();

            // STATUE OF LIBERTY POSITIONING: shift crop window UP to see the head/face
            if (filename.includes('liberty')) {
                // Shift sy up by 25% of the total height to capture the upper part (face)
                sy = Math.max(0, sy - (imageNaturalHeight * 0.25));
            }

            offCtx.clearRect(0, 0, cols, rows);

            offCtx.clearRect(0, 0, cols, rows);
            offCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, cols, rows);
            const data = offCtx.getImageData(0, 0, cols, rows).data;
            const map = new Float32Array(cols * rows);

            let threshold = 0.15; let exponent = 2.2; let maxDS = 5.0;

            if (filename.includes('golden-gate-2')) { threshold = 0.05; exponent = 1.6; maxDS = 8.0; }
            else if (filename.includes('golden-gate')) { threshold = 0.05; exponent = 1.5; maxDS = 6.0; }
            else if (filename.includes('nyc-birdseye')) {
                threshold = 0.15; 
                exponent = 2.0;
                maxDS = 7.0;
            }
            else if (filename.includes('nyc-')) {
                threshold = 0.005;
                exponent = 0.8;
                maxDS = 7.5;
            }
            else if (filename.includes('skyline-bw')) {
                threshold = 0.15; 
                exponent = 1.4;
                maxDS = 7.0;
            }
            else if (filename.includes('arts-lowell-snow') || filename.includes('arts-customhouse')) {
                threshold = 0.02;
                exponent = 1.1; 
                maxDS = 7.5;
            }
            else if (filename.includes('lowell-tower') || filename.includes('winthrop-gate')) {
                threshold = 0.1;
                exponent = 1.8;
                maxDS = 6.5;
            }
            else if (filename.includes('arts-')) {
                threshold = 0.03;
                exponent = 1.2;
                maxDS = 7.0;
            }

            // Optimized loop with pre-calculated constants
            const invThreshold = 1 / (1 - threshold);
            const dataLength = data.length;
            
            for (let i = 0; i < dataLength; i += 4) {
                let intensity = 1 - ((data[i] + data[i + 1] + data[i + 2]) * 0.001307189542); // Pre-calculated 1/765
                if (intensity < threshold) {
                    map[i >> 2] = 0; // Bit shift instead of division
                } else {
                    intensity = Math.pow((intensity - threshold) * invThreshold, exponent) * maxDS;
                    map[i >> 2] = intensity;
                }
            }

            this.sizeMapCache[cacheKey] = map;
            return map;
        });

        const newParticles = [];
        const numScenes = sizeMaps.length;
        const totalCells = cols * rows;

        // Pre-allocate array with estimated size for better performance
        const estimatedParticles = Math.floor(totalCells * 0.3); // ~30% of cells have particles
        newParticles.length = 0; // Ensure clean start

        for (let i = 0; i < totalCells; i++) {
            let maxV = 0;
            for (let s = 0; s < numScenes; s++) {
                const val = sizeMaps[s][i];
                if (val > maxV) maxV = val;
            }

            if (maxV > 0.05) {
                const x = i % cols;
                const y = Math.floor(i / cols);

                const targetSizes = new Float32Array(numScenes);
                for (let s = 0; s < numScenes; s++) targetSizes[s] = sizeMaps[s][i];

                newParticles.push({
                    x: x * gap + gap / 2,
                    y: y * gap + gap / 2,
                    targetSizes: targetSizes,
                    baseSize: targetSizes[0],
                    currentSize: 0,
                });
            }
        }
        if (tabId) {
            // Only cache if it's a "complete" set or the only one we have
            if (this.imageSet.length > 1 || !this.sceneCache[tabId]) {
                this.sceneCache[tabId] = { imageSet: this.imageSet, particles: newParticles };
            }
        }

        if (!silent && this.currentTab === tabId) {
            // Progressive rendering: show particles immediately for instant feedback
            // Start with a subset for immediate visual, then fill in the rest
            const chunkSize = Math.min(5000, Math.floor(newParticles.length / 3));
            this.particles = newParticles.slice(0, chunkSize);
            
            // Add remaining particles in next frame to avoid blocking
            if (newParticles.length > chunkSize) {
                requestAnimationFrame(() => {
                    if (this.currentTab === tabId) {
                        this.particles = newParticles;
                    }
                });
            }
        }
    }

    handleMouseMove(e) {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
    }

    handleResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.updateTextRects();

        // Resize invalidates both caches because grid changed
        this.sceneCache = {};
        this.sizeMapCache = {};

        if (this.imageSet.length > 0) {
            this.initParticles(this.currentTab);
        }
    }

    updateTextRects() {
        // Only query elements relevant to the current tab to prevent "bleed"
        // Removed .content-block from masking to let dots show through text areas
        let selector = '.writing-header, .arts-header'; // Headers masked on all tabs (or specific ones)

        if (this.currentTab === 'resume') {
            // No longer masking .content-block - text will render on top of dots
            // selector += ', .content-block';
        } else if (this.currentTab === 'writing') {
            // We consciously EXCLUDE .post-item here to allow dots to flow behind glass boxes
            // selector += ', .post-item'; 
        }

        const elements = document.querySelectorAll(selector);
        this.textRects = [];
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();

            // Visibility Check
            const style = window.getComputedStyle(el);
            const isVisible = style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                parseFloat(style.opacity) > 0.1;

            // Only add if visible on screen AND not hidden via opacity/display
            if (isVisible && rect.bottom > 0 && rect.top < this.height && rect.width > 0 && rect.height > 0) {
                // Tighter padding for a cleaner look
                const pad = 4;
                this.textRects.push({
                    left: rect.left - pad,
                    right: rect.right + pad,
                    top: rect.top - pad,
                    bottom: rect.bottom + pad
                });
            }
        });
    }

    animate() {
        requestAnimationFrame(this.animate);
        
        if (this.particles.length === 0) return;
        
        this.ctx.clearRect(0, 0, this.width, this.height);

        // BATCH DRAWING: Sort dots into color groups to minimize state changes
        const batches = {};
        const hasMouseInteraction = this.mouse.x != null && this.mouse.y != null;
        const textRectsLength = this.textRects.length;

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // 1. Interpolate base size
            const targetBase = p.targetSizes[this.targetSceneIndex] || 0;
            p.baseSize += (targetBase - p.baseSize) * 0.1;

            // Masking Check (only if we have text rects)
            let isMasked = false;
            if (textRectsLength > 0) {
                const px = p.x;
                const py = p.y;
                for (let j = 0; j < textRectsLength; j++) {
                    const r = this.textRects[j];
                    if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom) {
                        isMasked = true;
                        break;
                    }
                }
            }

            // 2. Cursor Interaction (only if mouse is active)
            let force = 0;
            if (hasMouseInteraction) {
                let dx = this.mouse.x - p.x;
                let dy = this.mouse.y - p.y;
                let distanceSq = dx * dx + dy * dy;
                const maxDistSq = this.mouse.radius * this.mouse.radius;
                if (distanceSq < maxDistSq) {
                    force = (this.mouse.radius - Math.sqrt(distanceSq)) / this.mouse.radius;
                }
            }

            let targetSize = isMasked ? 0 : p.baseSize + (force * 5);
            p.currentSize += (targetSize - p.currentSize) * 0.2;

            if (p.currentSize < 0.2) continue;

            // Group by grayscale value (quantized to reduce batches)
            const grayQuant = Math.floor((153 - (force * 153)) / 10) * 10;
            const color = `rgb(${grayQuant},${grayQuant},${grayQuant})`;

            if (!batches[color]) batches[color] = [];
            batches[color].push(p);
        }

        // Execute drawing batches
        for (const color in batches) {
            this.ctx.fillStyle = color;
            const list = batches[color];
            for (let i = 0; i < list.length; i++) {
                const p = list[i];
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.currentSize, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }
}
