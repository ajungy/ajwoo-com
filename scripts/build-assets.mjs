// Downloads the surviving WordPress assets once, re-encodes them, and writes a
// typed manifest. Run: npm run assets
//
// Read-only GETs against the live site; nothing is ever written back to it.
//
// Three jobs:
//   1. Grid tiles      — square, 2x, AVIF/WebP/JPEG.
//   2. Content images  — 1x + 2x for the reading column.
//   3. Animated GIFs   — re-encoded to MP4 + WebM with a poster frame. The
//      originals run to 42 MB (one is 13 MB at 570px); as H.264 they are a
//      fraction of that AND they stop auto-playing, which is what made them a
//      Principle 14 problem in the first place.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, basename, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const CACHE = join(ROOT, '.asset-cache');
const OUT = join(ROOT, 'public/img');
mkdirSync(CACHE, { recursive: true });
mkdirSync(OUT, { recursive: true });

const TILE = 1140;
const CONTENT_WIDTHS = [770, 1540];
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36',
  Referer: 'https://ajwoo.com/design/',
};

async function fetchOnce(path) {
  const file = join(CACHE, path.replace(/[^a-zA-Z0-9.]/g, '_'));
  if (existsSync(file)) return file;
  const res = await fetch('https://i0.wp.com/ajwoo.com' + path, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

const slug = (p) => basename(p, extname(p)).replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase().slice(0, 46);

async function emitTile(src, id) {
  const base = `tile-${id}`;
  const meta = await sharp(src).metadata();
  const ratio = (meta.width ?? 1) / (meta.height ?? 1);
  // On a wide UI screenshot sharp's saliency detector reliably lands on a flat
  // background region, so those get a centre crop — the subject of a UI shot is
  // in the middle. Photographs keep saliency.
  const wide = ratio > 1.8 || ratio < 0.55;
  const pipe = sharp(src, { animated: false })
    .resize(TILE, TILE, { fit: 'cover', position: wide ? 'center' : 'attention' });
  await pipe.clone().avif({ quality: 62 }).toFile(join(OUT, `${base}.avif`));
  await pipe.clone().webp({ quality: 80 }).toFile(join(OUT, `${base}.webp`));
  await pipe.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, `${base}.jpg`));
  return { base, width: TILE, height: TILE };
}

async function emitContent(src, id) {
  const meta = await sharp(src).metadata();
  const base = `img-${id}`;
  const widths = CONTENT_WIDTHS.filter((w) => w <= (meta.width ?? 0));
  if (!widths.length) widths.push(meta.width ?? 770);
  for (const w of widths) {
    const p = sharp(src, { animated: false }).resize(w, null, { withoutEnlargement: true });
    await p.clone().avif({ quality: 60 }).toFile(join(OUT, `${base}-${w}.avif`));
    await p.clone().webp({ quality: 78 }).toFile(join(OUT, `${base}-${w}.webp`));
  }
  const big = widths[widths.length - 1];
  await sharp(src, { animated: false }).resize(big, null, { withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, `${base}-${big}.jpg`));
  const ratio = (meta.height ?? 1) / (meta.width ?? 1);
  return { kind: 'image', base, widths, fallbackWidth: big, width: big, height: Math.round(big * ratio) };
}

/** GIF -> MP4 + WebM + poster. Returns a motion record the page renders as a
 *  <video> with a poster: it does not autoplay, so nothing moves until asked. */
async function emitMotion(src, id) {
  const base = `mov-${id}`;
  const mp4 = join(OUT, `${base}.mp4`);
  const webm = join(OUT, `${base}.webm`);
  // yuv420p + even dimensions are required for broad H.264 playback.
  const scale = 'scale=trunc(iw/2)*2:trunc(ih/2)*2';
  execFileSync('ffmpeg', ['-y', '-i', src, '-movflags', 'faststart', '-pix_fmt', 'yuv420p',
    '-vf', scale, '-crf', '30', '-loglevel', 'error', mp4]);
  // These GIFs carry alpha (gbrap), which VP9 refuses. Force yuv420p. WebM is
  // a bonus format, so a failure here must not lose the MP4 we already have.
  let hasWebm = true;
  try {
    execFileSync('ffmpeg', ['-y', '-i', src, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38',
      '-pix_fmt', 'yuv420p', '-vf', scale, '-loglevel', 'error', webm]);
  } catch { hasWebm = false; }
  const meta = await sharp(src, { animated: false }).metadata();
  await sharp(src, { animated: false }).resize(Math.min(meta.width ?? 770, 1540), null,
    { withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(OUT, `${base}-poster.webp`));
  await sharp(src, { animated: false }).resize(Math.min(meta.width ?? 770, 1540), null,
    { withoutEnlargement: true }).jpeg({ quality: 82 }).toFile(join(OUT, `${base}-poster.jpg`));
  return { kind: 'motion', base, hasWebm, width: meta.width ?? 770, height: meta.height ?? 434 };
}

const manifest = JSON.parse(readFileSync(join(ROOT, 'scripts/source-manifest.json'), 'utf8'));
const blocks = JSON.parse(readFileSync(join(ROOT, 'scripts/source-blocks.json'), 'utf8'));
const out = { hero: null, tiles: {}, media: {}, blocks: {} };

// Home hero — the true pre-"-scaled" original recovered in Phase 0.
try {
  const f = await fetchOnce('/wp-content/uploads/2025/08/Original-bw-long.png');
  const m = await sharp(f).metadata();
  const widths = [770, 1540, 2200].filter((w) => w <= (m.width ?? 0));
  for (const w of widths) {
    await sharp(f).resize(w).avif({ quality: 60 }).toFile(join(OUT, `hero-${w}.avif`));
    await sharp(f).resize(w).webp({ quality: 78 }).toFile(join(OUT, `hero-${w}.webp`));
  }
  await sharp(f).resize(1540).jpeg({ quality: 84, mozjpeg: true }).toFile(join(OUT, 'hero-1540.jpg'));
  out.hero = { base: 'hero', widths, fallbackWidth: 1540, width: 1540,
    height: Math.round(1540 * ((m.height ?? 1) / (m.width ?? 1))) };
  console.log(`hero ${m.width}x${m.height} ok`);
} catch (e) { console.log('hero FAILED', e.message); }

for (const p of manifest) {
  try { out.tiles[p.slug] = await emitTile(await fetchOnce(p.tile), p.slug); }
  catch (e) { console.log(`  tile FAIL ${p.slug}: ${e.message}`); }
}

// Every image and GIF referenced in the real page content, in document order.
const seen = new Map();
for (const [projectSlug, list] of Object.entries(blocks)) {
  const rendered = [];
  for (const b of list) {
    if (b.t === 'text') { rendered.push({ kind: 'text', value: b.v }); continue; }
    if (b.t === 'embed') { rendered.push({ kind: 'embed', src: b.v, title: b.title || '' }); continue; }
    if (b.t !== 'img') continue;
    if (!seen.has(b.v)) {
      try {
        const f = await fetchOnce(b.v);
        const id = `${projectSlug}-${slug(b.v)}`;
        seen.set(b.v, b.v.endsWith('.gif') ? await emitMotion(f, id) : await emitContent(f, id));
      } catch (e) { console.log(`  img FAIL ${b.v}: ${e.message}`); seen.set(b.v, null); }
    }
    const rec = seen.get(b.v);
    if (rec) rendered.push(rec);
  }
  out.blocks[projectSlug] = rendered;
  const n = (t) => rendered.filter((r) => r.kind === t).length;
  console.log(`${projectSlug.padEnd(34)} text:${n('text')} img:${n('image')} motion:${n('motion')} video:${n('embed')}`);
}

writeFileSync(join(ROOT, 'content/images.json'), JSON.stringify(out, null, 1));
console.log('\nwrote content/images.json');
