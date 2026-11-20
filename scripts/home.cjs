// After `vite build`: v3 becomes the homepage (dist/index.html) and the v2
// React app moves to dist/app.html, which vercel.json serves at /v2/*.
// Vercel serves real files before rewrites, so "/" has to be v3 on disk.
const fs = require('fs')
const path = require('path')
const dist = path.join(__dirname, '..', 'dist')
fs.renameSync(path.join(dist, 'index.html'), path.join(dist, 'app.html'))
fs.copyFileSync(path.join(dist, 'v3', 'index.html'), path.join(dist, 'index.html'))
console.log('home: v3 -> dist/index.html, v2 React app -> dist/app.html')
