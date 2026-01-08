// dotWorker.js - Web Worker for dot art calculations
let gridSize = { cols: 0, rows: 0 };
let particleBase = []; // Initial grid of particle positions

// Function to get pixel data from an image
function getImageData(imageBitmap, width, height) {
    const offscreenCanvas = new OffscreenCanvas(width, height);
    const ctx = offscreenCanvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0, width, height);
    return ctx.getImageData(0, 0, width, height);
}

// Function to calculate a size map for a single image (the heavy lifting)
function calculateSizeMap(imageData, cols, rows, cellWidth, cellHeight) {
    const sizeMap = new Array(cols * rows).fill(0);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let totalBrightness = 0;
            let pixelCount = 0;

            // Iterate over a sampling window
            const startX = Math.floor(c * cellWidth);
            const startY = Math.floor(r * cellHeight);

            // Sample a small area in the cell center
            const sampleSize = 2; // e.g., 2x2 area
            for (let y = 0; y < sampleSize; y++) {
                for (let x = 0; x < sampleSize; x++) {
                    const px = startX + Math.floor(cellWidth / 2) + x;
                    const py = startY + Math.floor(cellHeight / 2) + y;

                    // Bounds check
                    if (px < imageData.width && py < imageData.height) {
                        const index = (py * imageData.width + px) * 4;
                        const r_val = imageData.data[index];
                        const g_val = imageData.data[index + 1];
                        const b_val = imageData.data[index + 2];
                        const a_val = imageData.data[index + 3];

                        // Use a basic grayscale conversion for brightness
                        const brightness = (r_val * 0.2126 + g_val * 0.7152 + b_val * 0.0722) / 255;
                        
                        // Dots are visible if the pixel is bright AND has alpha
                        if (a_val > 50) {
                            // Invert brightness: darker pixels mean larger dots
                            totalBrightness += (1 - brightness);
                            pixelCount++;
                        }
                    }
                }
            }

            if (pixelCount > 0) {
                // Average brightness and map it to a dot size (e.g., max size 4)
                const avgBrightness = totalBrightness / pixelCount;
                sizeMap[r * cols + c] = Math.max(0, avgBrightness * 4); 
            }
        }
    }
    return sizeMap;
}

// Helper: check if a point is inside any mask rect
function isMasked(x, y, maskRects) {
    if (!maskRects || maskRects.length === 0) return false;
    for (let r of maskRects) {
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return true;
    }
    return false;
}

self.onmessage = async (e) => {
    const { type, payload } = e.data;

    if (type === 'initParticles') {
        const { images, tabId, cols, rows, width, height, currentParticles } = payload;
        gridSize = { cols, rows };
        const cellWidth = width / cols;
        const cellHeight = height / rows;

        // 1. Create Base Particle Grid (only once per resolution)
        if (particleBase.length === 0 || particleBase.length !== cols * rows) {
            particleBase = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    particleBase.push({
                        x: c * cellWidth + cellWidth / 2,
                        y: r * cellHeight + cellHeight / 2,
                        baseSize: 0,
                        currentSize: 0,
                        targetSizes: [],
                        originalIndex: r * cols + c // Keep track of the grid position
                    });
                }
            }
        }

        // 2. Calculate Size Maps for ALL images
        const targetSizeMaps = [];
        for (const imageBitmap of images) {
            const imageData = getImageData(imageBitmap, width, height);
            const sizeMap = calculateSizeMap(imageData, cols, rows, cellWidth, cellHeight);
            targetSizeMaps.push(sizeMap);
        }

        // 3. Combine base particles and size maps
        // Re-use existing particles if available to preserve currentSize/baseSize for smooth transition
        const newParticles = particleBase.map((p, index) => {
            const existing = currentParticles.find(ep => ep.originalIndex === p.originalIndex) || p;
            const targetSizes = targetSizeMaps.map(map => map[index]);

            return {
                ...existing,
                x: p.x,
                y: p.y,
                targetSizes: targetSizes, // Array of target sizes for each image scene
                // Only set baseSize to the *first* target if it's a fresh init, 
                // otherwise keep existing baseSize for transition
                baseSize: existing.baseSize || targetSizes[0] || 0,
                originalIndex: p.originalIndex,
                masked: false
            };
        });

        // Post back the particles array (with targetSizes) and the grid size
        postMessage({ type: 'particles', particles: newParticles, cols, rows, tabId });

    } else if (type === 'updateMasks') {
        const { particles, rects } = payload;
        
        // Update masked property for each particle
        const maskedParticles = particles.map(p => {
            return { 
                ...p, 
                masked: isMasked(p.x, p.y, rects)
            };
        });

        // Post back the updated particles with the 'masked' property
        postMessage({ type: 'particlesMasked', particles: maskedParticles, cols: gridSize.cols, rows: gridSize.rows });
    }
};
