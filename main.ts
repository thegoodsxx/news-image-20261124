// news-image-20261124: Tuesday 24 November 2026
// Sums up 24 November 2026 world news in a broadsheet front-page poster by copying entry.png to the target MAKEFUN_OUTPUT_DIR directory.

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
if (!existsSync(outDir)) {
  throw new Error(`Output directory could not be created or found: ${outDir}`);
}

const srcUrl = new URL('./entry.png', import.meta.url);
if (!existsSync(srcUrl)) {
  throw new Error(`Source poster not found: ${srcUrl.pathname}`);
}

const srcStats = statSync(srcUrl);
if (srcStats.size === 0) {
  throw new Error(`Source poster is empty: ${srcUrl.pathname}`);
}

const destPath = join(outDir, 'entry.png');
copyFileSync(srcUrl, destPath);

const destStats = statSync(destPath);
if (destStats.size !== srcStats.size) {
  throw new Error(`Copied output size mismatch: expected ${srcStats.size} bytes, got ${destStats.size} bytes`);
}

const outputBytes = readFileSync(destPath);
const pngMagic = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
for (let i = 0; i < pngMagic.length; i++) {
  if (outputBytes[i] !== pngMagic[i]) {
    throw new Error(`Invalid PNG magic bytes at byte index ${i}: expected 0x${pngMagic[i].toString(16)}, got 0x${outputBytes[i]?.toString(16)}`);
  }
}

console.log(`Copied ${destStats.size} bytes to ${destPath}`);
