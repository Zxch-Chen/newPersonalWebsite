const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png'];
const VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.webm'];
const INPUT_DIR = './assets/arts';
const OUTPUT_DIR = './optimized-assets';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function optimizeImage(file) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const outWebp = path.join(OUTPUT_DIR, base + '.webp');
  const outAvif = path.join(OUTPUT_DIR, base + '.avif');

  sharp(file)
    .webp({ quality: 80 })
    .toFile(outWebp, err => {
      if (err) console.error('WebP error:', err);
      else console.log('Optimized (webp):', outWebp);
    });

  sharp(file)
    .avif({ quality: 50 })
    .toFile(outAvif, err => {
      if (err) console.error('AVIF error:', err);
      else console.log('Optimized (avif):', outAvif);
    });
}

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
  if (IMAGE_EXTS.includes(ext)) optimizeImage(fullPath);
  if (VIDEO_EXTS.includes(ext)) optimizeVideo(fullPath);
});