// After `vite build`: the launch page becomes the homepage (dist/index.html) and
// the React app moves to dist/app.html, which vercel.json rewrites its routes
// (/resume, /writing, /thoughts, ...) to. Vercel serves real files before
// rewrites, so "/" has to be the launch page on disk.
const fs = require('fs')
const path = require('path')
const dist = path.join(__dirname, '..', 'dist')
fs.renameSync(path.join(dist, 'index.html'), path.join(dist, 'app.html'))
fs.copyFileSync(path.join(dist, 'launch', 'index.html'), path.join(dist, 'index.html'))
console.log('home: launch page -> dist/index.html, React app -> dist/app.html')
