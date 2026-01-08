const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = './assets/arts';
const OUTPUT_DIR = './optimized-assets';
const VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.webm'];

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function optimizeVideo(file) {
  const base = path.basename(file, path.extname(file));
  const outMp4 = path.join(OUTPUT_DIR, base + '-compressed.mp4');
  ffmpeg(file)
    .videoCodec('libx264')
    .size('?x720')
    .outputOptions('-crf 28')
    .on('end', () => console.log('Optimized (mp4):', outMp4))
    .on('error', err => console.error('Video error:', err))
    .save(outMp4);
}

fs.readdirSync(INPUT_DIR).forEach(file => {
  const fullPath = path.join(INPUT_DIR, file);
  const ext = path.extname(file).toLowerCase();
  if (VIDEO_EXTS.includes(ext)) optimizeVideo(fullPath);
});
