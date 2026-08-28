// One-off (re-runnable) generator for dark-mode grid-tile variants — at
// Alex's direction: the /design grid's thumbnails are mostly UI screenshots
// mounted on a flat white canvas, which reads as too bright against the rest
// of a dark page. Only the outer canvas/padding margin gets recolored to
// --d-200 (#2E2E33, tokens/tokens.css); everything the margin frames —
// including white INSIDE that content, like a survey form's own white
// card — is left completely untouched.
//
// A flood fill from the image edges (the first version of this script) was
// tried and rejected: several of these screenshots have no visible border
// between the canvas margin and the app UI's own light background, so the
// fill leaked straight through into real content and darkened readable
// text. What actually distinguishes "background" here is geometry, not
// connectivity — it's the rectangular padding around a centered screenshot
// — so this version finds the bounding box of non-white CONTENT (anything
// that isn't near-white) and only recolors pixels strictly outside that
// box, with a short feather at the boundary so the cut isn't a hard ring.
// A tile with no real margin (already full-bleed) gets a content bbox that
// covers the whole frame, so nothing changes — a safe no-op.
//
// Output: tile-<slug>-dark.{avif,webp,jpg}, same 1140x1140 as the existing
// tile-<slug>.*, swapped in via CSS only in dark mode (see .tile-light/
// .tile-dark in globals.css, and ProjectCard.tsx) — same light/dark real-
// image-pair pattern components/HeroPhoto.tsx already established, not a
// filter over the whole image.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'public/img');
const DARK_GRAY = [0x2e, 0x2e, 0x33]; // --d-200

// Lowered from 232 — several tiles carry a soft vignette that dims the true
// corners to ~219 even though it's still visually "the white background",
// not content. Without this the bbox scan below misread that vignette as
// real content and covered the whole frame, so nothing got recolored.
const WHITE_MIN = 200;
const WHITE_MAX_SPREAD = 14; // and channels must be close to each other (true light gray/white, not a pale color)
const FEATHER = 10; // px transition zone at the content bbox edge

async function darkenMargin(srcPath) {
  const img = sharp(srcPath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels } = info;

  const isBgWhite = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const min = Math.min(r, g, b), max = Math.max(r, g, b);
    return min >= WHITE_MIN && (max - min) <= WHITE_MAX_SPREAD;
  };

  // Bounding box of non-white content.
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * channels;
      if (!isBgWhite(i)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  // No content found (a blank tile) — nothing to protect, treat whole frame
  // as margin; won't happen in practice but keeps the math well-defined.
  if (maxX < 0) { minX = 0; minY = 0; maxX = w - 1; maxY = h - 1; }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Distance outside the content bbox, in px (0 = inside or right at
      // the edge, growing as you move further into the margin).
      const dx = x < minX ? minX - x : x > maxX ? x - maxX : 0;
      const dy = y < minY ? minY - y : y > maxY ? y - maxY : 0;
      const dist = Math.max(dx, dy);
      if (dist <= 0) continue; // strictly inside the content box — untouched
      const i = (y * w + x) * channels;
      const strength = Math.min(1, dist / FEATHER);
      const r = data[i], g = data[i + 1], b = data[i + 2];
      data[i] = Math.round(r + (DARK_GRAY[0] - r) * strength);
      data[i + 1] = Math.round(g + (DARK_GRAY[1] - g) * strength);
      data[i + 2] = Math.round(b + (DARK_GRAY[2] - b) * strength);
    }
  }

  return sharp(data, { raw: { width: w, height: h, channels } });
}

const manifest = JSON.parse(readFileSync(join(ROOT, 'content/images.json'), 'utf8'));
const tiles = manifest.tiles;

for (const [slug, tile] of Object.entries(tiles)) {
  const src = join(OUT, `${tile.base}.jpg`);
  try {
    const pipe = await darkenMargin(src);
    await pipe.clone().avif({ quality: 62 }).toFile(join(OUT, `${tile.base}-dark.avif`));
    await pipe.clone().webp({ quality: 80 }).toFile(join(OUT, `${tile.base}-dark.webp`));
    await pipe.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, `${tile.base}-dark.jpg`));
    console.log(`${slug}: ok`);
  } catch (e) {
    console.log(`${slug}: FAILED ${e.message}`);
  }
}
