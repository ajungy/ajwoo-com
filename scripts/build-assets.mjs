// Downloads the surviving WordPress assets once, re-encodes them, and writes a
// typed manifest. Run: npm run assets
// Nothing here touches the live site beyond read-only GETs.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const CACHE = join(ROOT, '.asset-cache');
const OUT = join(ROOT, 'public/img');
mkdirSync(CACHE, { recursive: true });
mkdirSync(OUT, { recursive: true });

const TILE = 1140;               // 2x of the 570px grid tile
const CONTENT_WIDTHS = [770, 1540]; // 1x and 2x of the reading column
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36',
  Referer: 'https://ajwoo.com/design/',
};

async function fetchOnce(path) {
  const name = path.replace(/[^a-zA-Z0-9.]/g, '_');
  const file = join(CACHE, name);
  if (existsSync(file)) return file;
  const url = 'https://i0.wp.com/ajwoo.com' + path;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

const slugify = (p) => basename(p, extname(p)).replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase().slice(0, 48);

async function emitTile(src, id) {
  const base = `tile-${id}`;
  const meta = await sharp(src).metadata();
  const ratio = (meta.width ?? 1) / (meta.height ?? 1);
  // Crop strategy by shape. On a wide UI screenshot sharp's saliency detector
  // reliably lands on a flat background region, so those get a centre crop —
  // the subject of a UI shot is in the middle. Photographs keep saliency.
  const wide = ratio > 1.8 || ratio < 0.55;
  const pipe = sharp(src, { animated: false }).resize(TILE, TILE, {
    fit: 'cover',
    position: wide ? 'center' : 'attention',
  });
  await pipe.clone().avif({ quality: 62 }).toFile(join(OUT, `${base}.avif`));
  await pipe.clone().webp({ quality: 80 }).toFile(join(OUT, `${base}.webp`));
  await pipe.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, `${base}.jpg`));
  return { base, width: TILE, height: TILE };
}

async function emitContent(src, id) {
  const meta = await sharp(src).metadata();
  const base = `img-${id}`;
  const widths = CONTENT_WIDTHS.filter((w) => w <= (meta.width ?? 0));
  if (widths.length === 0) widths.push(meta.width ?? 770);
  for (const w of widths) {
    const pipe = sharp(src, { animated: false }).resize(w, null, { withoutEnlargement: true });
    await pipe.clone().avif({ quality: 60 }).toFile(join(OUT, `${base}-${w}.avif`));
    await pipe.clone().webp({ quality: 78 }).toFile(join(OUT, `${base}-${w}.webp`));
  }
  const big = widths[widths.length - 1];
  await sharp(src, { animated: false }).resize(big, null, { withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, `${base}-${big}.jpg`));
  const ratio = (meta.height ?? 1) / (meta.width ?? 1);
  return { base, widths, fallbackWidth: big, width: big, height: Math.round(big * ratio) };
}

const manifest = JSON.parse(readFileSync(join(ROOT, 'scripts/source-manifest.json'), 'utf8'));
const out = { projects: {}, hero: null };

// Home hero — the true pre-"-scaled" original recovered in Phase 0.
try {
  const heroPath = '/wp-content/uploads/2025/08/Original-bw-long.png';
  const f = await fetchOnce(heroPath);
  const m = await sharp(f).metadata();
  for (const w of [770, 1540, 2200]) {
    if (w > (m.width ?? 0)) continue;
    await sharp(f).resize(w).avif({ quality: 60 }).toFile(join(OUT, `hero-${w}.avif`));
    await sharp(f).resize(w).webp({ quality: 78 }).toFile(join(OUT, `hero-${w}.webp`));
  }
  await sharp(f).resize(1540).jpeg({ quality: 84, mozjpeg: true }).toFile(join(OUT, `hero-1540.jpg`));
  out.hero = { base: 'hero', widths: [770, 1540, 2200].filter((w) => w <= (m.width ?? 0)),
    width: 1540, height: Math.round(1540 * ((m.height ?? 1) / (m.width ?? 1))) };
  console.log(`hero  ${m.width}x${m.height} -> ok`);
} catch (e) { console.log('hero FAILED', e.message); }

for (const p of manifest) {
  const rec = { tile: null, gallery: [] };
  try {
    rec.tile = await emitTile(await fetchOnce(p.tile), p.slug);
  } catch (e) { console.log(`  tile FAIL ${p.slug}: ${e.message}`); }
  for (const g of p.gallery) {
    try {
      rec.gallery.push(await emitContent(await fetchOnce(g), `${p.slug}-${slugify(g)}`));
    } catch (e) { console.log(`  img FAIL ${p.slug}/${basename(g)}: ${e.message}`); }
  }
  out.projects[p.slug] = rec;
  console.log(`${p.slug.padEnd(34)} tile:${rec.tile ? 'ok' : 'FAIL'} gallery:${rec.gallery.length}`);
}

writeFileSync(join(ROOT, 'content/images.json'), JSON.stringify(out, null, 1));
console.log('\nwrote content/images.json');
