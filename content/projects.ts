// Generated from the Phase 0 crawl. Titles, categories, prose, images and
// video embeds are all the real ones from ajwoo.com — nothing is invented.

import data from './images.json';

export type Project = { slug: string; title: string; category: string; kind: 'design' | 'coffee' };

export type Block =
  | { kind: 'text'; value: string }
  | { kind: 'image'; base: string; widths: number[]; fallbackWidth: number; width: number; height: number }
  | { kind: 'motion'; base: string; hasWebm: boolean; width: number; height: number }
  | { kind: 'embed'; src: string; title: string };

export const projects: Project[] = [
  { slug: '704', title: 'GenAI in Premiere Pro', category: 'Video / AI', kind: 'design' },
  { slug: 'pr-ae-frame', title: 'Pr Ae Frame', category: 'Video / Cloud', kind: 'design' },
  { slug: 'layout', title: 'Layout', category: 'HoloLens', kind: 'design' },
  { slug: 'product-visualize', title: 'Product Visualize', category: 'AR / CRM', kind: 'design' },
  { slug: 'dynamics-365-customer-voice', title: 'Dynamics 365 Customer Voice', category: 'Forms / CRM', kind: 'design' },
  { slug: 'seeing-ai', title: 'Seeing AI', category: 'AI', kind: 'design' },
  { slug: 'netmarble', title: 'Netmarble', category: 'Branding / UX', kind: 'design' },
  { slug: 'starbucks-technology', title: 'Starbucks Technology', category: 'User Research / iPad', kind: 'design' },
  { slug: 'wrap-and-charge', title: 'Wrap and Charge', category: 'Industrial Design', kind: 'design' },
  { slug: 'coin-lock', title: 'Coin Lock', category: 'Industrial Design', kind: 'design' },
  { slug: '10-borders', title: '10 Borders', category: 'Poster', kind: 'design' },
  { slug: 'paintsound', title: 'Paint Sound', category: 'Hololens', kind: 'design' },
  { slug: '3-coffee-shops-in-tokyo', title: '3 Coffee Shops in Tokyo', category: 'Japan', kind: 'coffee' },
  { slug: '5-coffee-shops-in-seattle', title: '5 Coffee Shops in Seattle', category: 'USA', kind: 'coffee' },
  { slug: '3-coffee-shops-amsterdam', title: '3 coffee shops in Amsterdam', category: 'Netherlands', kind: 'coffee' },
  { slug: 'best-coffee-shops-new-york-city', title: '5 Coffee Shops in NYC', category: 'USA', kind: 'coffee' },
  { slug: '5-in-milan', title: '5 cafes in Milan', category: 'Italy', kind: 'coffee' },
  { slug: 'top-3-fancy-cafes-paris', title: 'Top 3 Fancy Cafes in Paris', category: 'France', kind: 'coffee' },
  { slug: 'top-5-coffee-shop-paris', title: 'Top 5 Coffee Shop in Paris', category: 'France', kind: 'coffee' },
  { slug: 'top-5-coffee-shops-in-london', title: 'Top 5 Coffee Shops in London', category: 'UK', kind: 'coffee' },
  { slug: 'blue-olive', title: 'Blue Olive', category: 'Paris', kind: 'coffee' },
  { slug: 'telescope', title: 'Télescope', category: 'Paris', kind: 'coffee' },
];

export const designProjects = projects.filter((p) => p.kind === 'design');
export const coffeeProjects = projects.filter((p) => p.kind === 'coffee');
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

type Tile = { base: string; width: number; height: number };
type HeroImg = { base: string; widths: number[]; fallbackWidth: number; width: number; height: number };
export const siteData = data as {
  hero: HeroImg | null;
  /** Dark-mode counterpart of `hero` — same portrait, shot/composited against
      a dark background rather than light. See components/HeroPhoto.tsx for
      how the swap is done (CSS, not JS, so there's no flash on load). */
  heroDark: HeroImg | null;
  tiles: Record<string, Tile>;
  blocks: Record<string, Block[]>;
};

export const tileFor = (slug: string): Tile | undefined => siteData.tiles[slug];
export const blocksFor = (slug: string): Block[] => siteData.blocks[slug] ?? [];

/**
 * Grid-tile motion — a deliberate, curated exception to the rest of the site.
 * Every other video on this site (the `motion` blocks in project bodies,
 * AppCard's demo clips) is click-to-play: a poster frame at rest, motion only
 * once the user asks for it, per Principle 14. Alex asked for the `/design`
 * grid to autoplay and loop instead, matching the original ajwoo.com, where
 * that motion gave the grid its "depth and excitement."
 *
 * CORRECTED against the live grid directly (view-source on ajwoo.com/design/,
 * reading each card's `data-thumb-src`) rather than assumed from names in the
 * Phase 0 inventory — a first pass got two of these wrong by guessing:
 *   - Seeing AI's grid tile is a STATIC png (Seeing-ai-570.png) on the live
 *     site, not animated. `chairloopicon.gif` is real, but it belongs to
 *     Seeing AI's own page BODY (still used there, in the `motion` block
 *     above, untouched by this fix) — not its grid tile.
 *   - Netmarble's grid tile is also a STATIC png (netmarble-570.png). The
 *     `netmarble-logo.mp4` on its detail page is real too, but it's not what
 *     renders in the grid.
 *   - Layout's grid tile is `layout33333d.gif`, not the `ezgif-2-...gif` that
 *     lives in Layout's own page body — different asset, same project.
 * Only GenAI (704) and Layout actually animate in the live grid. Seeing AI
 * and Netmarble render their existing static tiles (siteData.tiles) via the
 * normal Picture path below — no motionTiles entry means no video.
 *
 * Every source re-confirmed frame-by-frame against ajwoo.com before encoding:
 *   704 (GenAI in Premiere Pro)  ajwoo.com/wp-content/uploads/2024/07/genai-pr-570-compressed.gif  (570×570, already square)
 *   layout                      ajwoo.com/wp-content/uploads/2019/02/layout33333d.gif  (865×864, center-cropped to 864×864)
 */
type MotionTile = { base: string; width: number; height: number; hasWebm: boolean };
const motionTiles: Record<string, MotionTile> = {
  '704': { base: 'mov-704-genai', width: 570, height: 570, hasWebm: true },
  layout: { base: 'mov-layout-33333d', width: 864, height: 864, hasWebm: true },
};
export const motionTileFor = (slug: string): MotionTile | undefined => motionTiles[slug];
