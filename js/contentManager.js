export class ContentManager {
    constructor() {
        this.container = document.getElementById('dynamic-content');
        this.currentTab = 'resume';
        this.currentIndex = -1;

        this.dataSets = {
            'resume': [
                {
                    title: "Zach Chen",
                    subtitle: "",
                    image: "/assets/zach-intro.jpg",
                    text: `Hi, I'm Zach. I'm a sophomore at Harvard studying CS. I'm interested in living a meaningful life and helping others live meaningful lives. I want to build companies, communities, and good ideas. Seeking <i>ikigai</i> and <i>eudaimonia</i>. Reach out for collaborations. <br><br> 
                           <a href="javascript:void(0)" class="jump-link" onclick="document.getElementById('static-resume').scrollIntoView({behavior:'smooth'})">View Full Resume</a>
                           &nbsp;|&nbsp;
                           <a href="https://github.com/Zxch-Chen/newPersonalWebsite" class="jump-link" target="_blank">Website Code</a>`,
                    date: "",
                    posClass: "pos-hero",
                    sceneIndex: 0
                },
                {
                    title: "Embedding VC",
                    subtitle: "VC Scout",
                    link: "https://embedding.vc/",
                    text: "Sourcing and evaluating early-stage startups within the Harvard ecosystem for potential seed-stage investment.",
                    date: "2025 — Present",
                    posClass: "pos-side",
                    sceneIndex: 1
                },
                {
                    title: "IvyLine Consulting",
                    subtitle: "Co-Founder & CSO",
                    text: "Scaled a college coaching startup to 5 figures profit in its first year.",
                    date: "2024 — 2025",
                    posClass: "pos-side",
                    sceneIndex: 1
                },
                {
                    title: "Independent Research",
                    subtitle: "Beth Israel, MGH",
                    text: "Automated genomic data cleaning for 1,000+ patient profiles. Identified genetic markers for Alzheimer's using PCA models. Mentored under Dr. Haoqi.",
                    date: "2023 — 2024",
                    posClass: "pos-low",
                    sceneIndex: 2
                },
                {
                    title: "Ambrose",
                    subtitle: "Founder",
                    text: "Building the best reposting platform for creators, using multi-agent systems.",
                    date: "2026 — Present",
                    posClass: "pos-low",
                    sceneIndex: 2
                },
                {
                    title: "How to Want Better Things",
                    subtitle: "Co-Author",
                    link: "https://www.howtowantbetterthings.org/",
                    text: "Co-authored a guide helping young people navigate impactful careers and live meaningful lives. Gave talks at Brown, Yale, and Tufts.",
                    date: "2025 - Present",
                    posClass: "pos-low",
                    sceneIndex: 2
                }
            ],
            'writing': [
                {
                    title: "my writing",
                    text: `A collection of my thoughts centered around the macro and micro and how they interact. Making sense of how to live meaningfully in a world shaped by forces much larger than ourselves. <br><br>
                           <a href="javascript:void(0)" class="jump-link" onclick="document.getElementById('substack-feed-container').scrollIntoView({behavior:'smooth'})">View All Writing</a>`,
                    date: "",
                    posClass: "pos-center-top",
                    sceneIndex: 0
                },
                {
                    title: "a semester already over",
                    subtitle: "Refining the North Star",
                    text: "Near the end of my first semester at Harvard, I didn’t really know what I wanted to do. Physics 15a was kicking my butt... I truly feel so lucky to have all these experiences and people in my life.",
                    date: "12/17/2025",
                    posClass: "pos-left-side",
                    sceneIndex: 1
                },
                {
                    title: "Gun violence is a moral sin",
                    subtitle: "A Perspective on Empathy",
                    text: "An exploration of the systemic failures and moral imperatives surrounding gun violence in America, calling for a shift from political deadlock to a focus on human flourishing.",
                    date: "12/15/2025",
                    posClass: "pos-right-side-lower",
                    sceneIndex: 1
                },
                {
                    title: "the best year of my life: 2025",
                    subtitle: "Growth & Gratitude",
                    text: "Looking back at all the moments that made this year special—from San Francisco and YC summer school to finding new love for friends and family through loss. Gratitude for moving forward.",
                    date: "01/01/2026",
                    posClass: "pos-center-top",
                    sceneIndex: 2
                }
            ],
            'arts': [
                {
                    sceneIndex: 0, posClass: "pos-arts-0", isArts: true,
                    title: "my art",
                    subtitle: "a collection of my favorite photos, media, artwork, and AI generations",
                    cards: [
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/sfBridge.avif", info: "A misty morning at the Golden Gate. The scale is hard to capture until you're right under it." },
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/sanBridge.avif", info: "Me and my bro looking at the SF bridge." },
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/rainbowSF.avif", info: "One of the most crazy views ever in SF." },
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/nyc.avif", info: "Manhattan from a different angle. The geometry of the city is endless." }
                    ]
                },
                {
                    sceneIndex: 1, posClass: "pos-arts-1", isArts: true,
                    cards: [
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/lowellTower.avif", info: "Harvard's architecture always feels timeless, especially on a quiet afternoon." },
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/clockTower.avif", info: "Still remember this day. What a long time ago, yet it lives with me." },
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/winthropGate.avif", info: "The gateway to a lot of good memories. This was where I always rested after my runs by the Charles." }
                    ]
                },
                {
                    sceneIndex: 2, posClass: "pos-arts-2", isArts: true,
                    cards: [
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/God%E2%80%99s%20creation-compressed.mp4", isVideo: true, info: "So delicate and perfect." }
                    ]
                },
                {
                    sceneIndex: 0, posClass: "pos-arts-0", isArts: true,
                    cards: [
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/bahamas.webp", info: "Crystal clear waters with luch clouds in the Bahamas." },
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/bahamasBoat.webp", info: "Sunset in the Bahamas. Never seen such vibrancy." },
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/bahamasTwo.webp", info: "Another perspective of paradise. I have to come back." },
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/chinatown.webp", info: "The vibrant colors of Montreal Chinatown caught my eye." }
                    ]
                },
                {
                    sceneIndex: 1, posClass: "pos-arts-1", isArts: true,
                    cards: [
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/cemeteryTwo.avif", info: "Legacy preserved in stone." },
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/cemetery.avif", info: "Boston resting place, a moment of quiet reflection." },
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/harvardSunset.avif", info: "The stillness is undescribable yet you can feel it." }
                    ]
                },
                {
                    sceneIndex: 2, posClass: "pos-arts-2", isArts: true,
                    cards: [
                        { src: "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/eliotQuote.avif", info: "A quote that I live by." }
                    ]
                }
            ]
        };

        // Populate Gallery Grid
        this.populateGallery();

        // Initial proxy height setup
        this.refreshProxyHeight();
    }

    refreshProxyHeight() {
        const count = this.getLength();
        const tabId = this.currentTab;
        
        // Match the 0.8 * window.innerHeight (80vh) logic in timeline.js
        const vhPerItem = 80; 
        const totalHeight = count * vhPerItem;

        let proxyId = '';
        if (tabId === 'resume') proxyId = 'scroll-proxy';
        else if (tabId === 'writing') proxyId = 'writing-scroll-proxy';
        else if (tabId === 'arts') proxyId = 'arts-scroll-proxy';

        const proxy = document.getElementById(proxyId);
        if (proxy) {
            proxy.style.height = `${totalHeight}vh`;
        }
    }

    populateGallery() {
        const grid = document.getElementById('arts-gallery-grid');
        if (!grid) return;

        const allAssets = [
            "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/God%E2%80%99s%20creation-compressed.mp4", "bahamas.avif", "bahamasBoat.avif", "bahamasTwo.avif",
            "cemetery.avif", "cemeteryTwo.avif", "chinatown.avif", "clockTower.avif",
            "lowellTower.avif", "nyc.avif", "rainbowSF.avif", "sanBridge.avif", "sfBridge.avif",
            "harvardSunset.avif", "winthropGate.avif", "eliotQuote.avif"
        ];

        // Ensure we only show multiples of 3 to avoid lonely images on the last row
        const displayAssets = allAssets.slice(0, Math.floor(allAssets.length / 3) * 3);

        grid.innerHTML = displayAssets.map((asset, index) => {
            const isVideo = asset.endsWith('.mp4');
            // Handle video with special characters - use Vercel Blob storage
            let path;
            if (isVideo && asset.includes("God")) {
                // Use the compressed version from Vercel Blob storage
                path = "https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/God%E2%80%99s%20creation-compressed.mp4";
            } else {
                // Use optimized AVIF images from optimized-assets folder
                path = `/optimized-assets/${encodeURIComponent(asset)}`;
            }
            // Use loading="lazy" for native lazy loading and data-src for Intersection Observer fallback
            return `
                <div class="gallery-item" onclick="window.contentManager.openModal('${path}', ${isVideo})">
                    ${isVideo ? 
                        `<video src="${path}" autoplay muted loop playsinline preload="metadata"></video>` : 
                        `<img src="${path}" alt="Artwork">`
                    }
                </div>
            `;
        }).join('');
    }

    openModal(path, isVideo) {
        const modal = document.getElementById('gallery-modal');
        const wrap = document.getElementById('modal-content-wrap');
        if (!modal || !wrap) return;

        if (isVideo) {
            wrap.innerHTML = `<video src="${path}" controls autoplay loop playsinline preload="metadata"></video>`;
            // Add error handler
            const video = wrap.querySelector('video');
            if (video) {
                video.onerror = () => {
                    console.error('Video failed to load in modal:', path);
                    wrap.innerHTML = '<p style="color: white; text-align: center;">Video failed to load</p>';
                };
            }
        } else {
            wrap.innerHTML = `<img src="${path}" alt="Full view">`;
        }
        
        modal.classList.add('active');

        // Close on background click
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                wrap.innerHTML = '';
            }
        };
    }

    setTab(tabId) {
        if (this.currentTab === tabId) return;
        
        // Block any rendering during the transition
        this.currentTab = tabId;
        this.currentIndex = -1;
        this.lastTab = null; 
        this.reset();
        
        // Update proxy height for the new tab
        this.refreshProxyHeight();
    }

    // Prefetch all arts images and video for instant loading
    prefetchArts() {
        const artsData = this.dataSets.arts;
        if (!artsData) return;

        const imagesToPrefetch = [];
        
        // Collect all image/video sources from arts data
        artsData.forEach(scene => {
            if (scene.cards) {
                scene.cards.forEach(card => {
                    if (card.src && !imagesToPrefetch.includes(card.src)) {
                        imagesToPrefetch.push(card.src);
                    }
                });
            }
        });

        console.log(`Prefetching ${imagesToPrefetch.length} arts assets...`);
        
        // Prefetch using link[rel=prefetch] for images and videos
        imagesToPrefetch.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.as = src.endsWith('.mp4') ? 'video' : 'image';
            link.href = src;
            document.head.appendChild(link);
        });

        // Also preload using Image objects for immediate caching (more aggressive)
        imagesToPrefetch.forEach(src => {
            if (!src.endsWith('.mp4')) {
                const img = new Image();
                img.src = src;
            } else {
                // For video, create a video element and preload metadata
                const video = document.createElement('video');
                video.preload = 'auto';
                video.src = src;
            }
        });

        console.log('Arts assets prefetch initiated');
    }

    reset() {
        this.container.innerHTML = '';
        this.container.className = 'fixed-content';
        this.container.style.opacity = '0'; // Hide during reset
        this.container.style.pointerEvents = 'none';
        this.currentIndex = -1;
    }

    updateWritingPosts(posts) {
        if (!posts || posts.length === 0) return;

        // Reset writing dataset to the intro
        const intro = this.dataSets.writing[0];
        this.dataSets.writing = [intro];

        // Define cycling patterns (Cycling through Liberty, Skyline, and Times Square)
        const patterns = [
            { posClass: "pos-left-side", sceneIndex: 1 },
            { posClass: "pos-right-side-lower", sceneIndex: 2 },
            { posClass: "pos-center-top", sceneIndex: 0 }
        ];

        // We show up to 4 cycles of posts (12 total)
        const maxPostsToShow = 12;
        const postsToCycle = posts.slice(0, maxPostsToShow);

        postsToCycle.forEach((post, i) => {
            const pattern = patterns[i % patterns.length];
            this.dataSets.writing.push({
                title: post.title,
                link: post.link,
                text: post.description || "",
                date: post.pubDate,
                posClass: pattern.posClass,
                sceneIndex: pattern.sceneIndex
            });
        });

        // Update proxy height now that we have posts
        this.refreshProxyHeight();

        // Trigger UI update
        if (this.currentTab === 'writing') {
            const oldIndex = this.currentIndex;
            this.currentIndex = -1;
            this.update(oldIndex >= 0 ? oldIndex : 0);
        }
    }

    update(index) {
        const dataSet = this.dataSets[this.currentTab] || [];
        
        // Safety: If the requested dataset doesn't exist or we've switched tabs, 
        // don't try to render stale data.
        if (dataSet.length === 0) {
            this.reset();
            return;
        }

        // Clamp index
        if (index < 0) index = 0;
        if (index >= dataSet.length) index = dataSet.length - 1;

        // Strict tab matching: if this update was triggered for a different tab state, abort
        if (this.currentIndex === index && this.lastTab === this.currentTab) {
            return;
        }
        
        this.currentIndex = index;
        this.lastTab = this.currentTab;

        const data = dataSet[index];
        
        // Double check: is the data we're about to render actually for 'arts' if we are on arts?
        const isArtsData = !!data.isArts;
        const isArtsTab = this.currentTab === 'arts';

        if (isArtsTab !== isArtsData) {
            // Logic mismatch: likely a race condition during tab switch
            this.container.style.opacity = '0';
            return;
        }

        // Ensure container is ready when we have valid content
        // (Note: timeline.js may still hide this if we've scrolled to static content)
        this.container.style.opacity = '1';

        if (data.isArts) {
            this.container.className = 'fixed-content ' + data.posClass;
            
            // Render Text Note if present (e.g. at the top of the Boston Skyline scene)
            let textHtml = '';
            if (data.title) {
                textHtml = `
                    <div class="content-block arts-intro-block" style="position: absolute; top: -35vh; left: 50%; transform: translateX(-50%); text-align: center; width: 100vw; pointer-events: none;">
                        <h1 style="font-size: 3.5rem; margin-bottom: 0.5rem;">${data.title}</h1>
                        <h2 style="font-size: 1.1rem; color: #666; font-weight: 500; margin-bottom: 1.5rem;">${data.subtitle}</h2>
                        <a href="javascript:void(0)" class="jump-link" style="pointer-events: auto;" onclick="document.getElementById('arts-static-content').scrollIntoView({behavior:'smooth'})">View Gallery</a>
                    </div>
                `;
            }

            const cardsHtml = (data.cards || []).map((card, i) => {
                const rotation = (i % 2 === 0 ? 1 : -1) * (2 + (i * 2));
                const count = data.cards.length;
                const step = (count > 1) ? (60 / (count - 1)) : 0; 
                const offsetLeft = 5 + (i * step);
                const offsetTop = 5 + ((i * 12) % 35); 
                const isSingle = count === 1;
                const isVideoScene = data.posClass === 'pos-arts-2';
                const isLowellScene = data.posClass === 'pos-arts-1';
                let finalLeft = offsetLeft;
                let finalTop = offsetTop;
                if (isLowellScene && count === 3) {
                    if (i === 0) {
                        finalLeft = 8;
                        finalTop = 15;
                    } else if (i === 1) {
                        finalLeft = 25;
                        finalTop = 20;
                    } else if (i === 2) {
                        finalLeft = 72;
                        finalTop = 8;
                    }
                } else if (isSingle) {
                    finalLeft = isVideoScene ? 40 : 15;
                    finalTop = isVideoScene ? 5 : 10;
                }
                const finalWidth = isSingle ? (isVideoScene ? '350px' : '500px') : '450px';
                const rotateClass = card.rotate90 ? 'rotate-90' : '';
                // Add staggered animation delay (100ms per card)
                const animationDelay = i * 0.1;
                return `
                    <div class="art-card" style="width: ${finalWidth}; left: ${finalLeft}%; top: ${finalTop}%; transform: rotate(${rotation}deg); animation-delay: ${animationDelay}s" onclick="this.classList.toggle('show-info')">
                        ${card.isVideo ? 
                            `<video src="${card.src}" autoplay muted loop playsinline></video>` : 
                            `<img src="${card.src}" alt="Artwork">`
                        }
                        <div class="card-info">
                            <p>${card.info}</p>
                        </div>
                    </div>
                `;
            }).join('');
            
            this.container.innerHTML = textHtml + cardsHtml;
        } else if (data.isSplit) {
            this.container.className = 'fixed-content pos-split-sides ' + (data.splitClass || '');
            this.container.innerHTML = `
                <div class="content-block left">
                    ${data.posts[0] ? `
                        <span class="date-tag">${data.posts[0].pubDate}</span>
                        <h1>${data.posts[0].link ? `<a href="${data.posts[0].link}" target="_blank" class="title-link">${data.posts[0].title}</a>` : data.posts[0].title}</h1>
                        <p><a href="${data.posts[0].link}" target="_blank" class="jump-link">Keep Reading</a></p>
                    ` : ''}
                </div>
                <div class="content-block right">
                    ${data.posts[1] ? `
                        <span class="date-tag">${data.posts[1].pubDate}</span>
                        <h1>${data.posts[1].link ? `<a href="${data.posts[1].link}" target="_blank" class="title-link">${data.posts[1].title}</a>` : data.posts[1].title}</h1>
                        <p><a href="${data.posts[1].link}" target="_blank" class="jump-link">Keep Reading</a></p>
                    ` : ''}
                </div>
            `;
        } else if (data.isCenterPosts) {
            this.container.className = 'fixed-content pos-center-top';
            this.container.innerHTML = `
                <div class="content-block">
                    ${data.posts.map(post => `
                        <div class="substack-entry" style="margin-bottom: 2rem;">
                            <span class="date-tag">${post.pubDate}</span>
                            <h1>${post.link ? `<a href="${post.link}" target="_blank" class="title-link">${post.title}</a>` : post.title}</h1>
                            <p><a href="${post.link}" target="_blank" class="jump-link">Keep Reading</a></p>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            // Update Classes
            this.container.className = 'fixed-content ' + data.posClass;

            // Update Content
            const isHero = data.title === "Zach Chen";

            this.container.innerHTML = `
                <div class="content-block">
                    ${data.image ? `<img src="${data.image}" class="intro-image" alt="${data.title}">` : ''}
                    ${data.date ? `<span class="date-tag">${data.date}</span>` : ''}
                    <h1 style="${isHero ? '' : (data.posClass === 'pos-center-top' ? 'text-align: center;' : (data.posClass === 'pos-left-side' ? 'text-align: left;' : 'text-align: right;'))}">
                        ${data.link ? `<a href="${data.link}" target="_blank" class="title-link">${data.title}</a>` : data.title}
                    </h1>
                    ${data.subtitle ? `<h2>${data.subtitle}</h2>` : ''}
                    <p>${data.text}</p>
                </div>
            `;
        }
    }

    getSceneIndex(index) {
        const dataSet = this.dataSets[this.currentTab] || [];
        if (index < 0) index = 0;
        if (index >= dataSet.length) index = dataSet.length - 1;
        return dataSet[index].sceneIndex;
    }

    getLength() {
        return (this.dataSets[this.currentTab] || []).length;
    }
}
