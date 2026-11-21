// Generated from the Phase 0 crawl. Titles, categories, prose, images and
// video embeds are all the real ones from ajwoo.com — nothing is invented.

import data from './images.json';
import editedArticles from './edited-articles.json';

export type Project = {
  slug: string;
  title: string;
  lead: string;
  category: string;
  kind: 'design' | 'coffee';
  thumbnail?: { base: string; width: number; height: number };
};

export type Block =
  | { kind: 'text'; value: string }
  | { kind: 'image'; base: string; widths: number[]; fallbackWidth: number; width: number; height: number }
  | { kind: 'motion'; base: string; hasWebm: boolean; width: number; height: number }
  | { kind: 'embed'; src: string; title: string };

export const projects: Project[] = [
  {
    slug: 'netflix-creative-tools',
    title: 'Netflix Creative Tools', lead: "Designing the systems and tools for video, artwork, copy, and analytics.",
    category: 'Video / Artwork / Copy / Analytics / AI',
    kind: 'design',
    thumbnail: { base: 'tile-netflix-creative-tools', width: 1024, height: 1024 },
  },
  { slug: 'premiere-generative-ai', title: 'Premiere Generative AI', lead: "Exploring generative video editing in Premiere Pro.", category: 'Video / AI', kind: 'design' },
  { slug: 'pr-ae-frame', title: 'Frame.io for Premiere & After Effects', lead: "Editors can share a cut and see feedback exactly where they do the editing.", category: 'Video / Cloud', kind: 'design' },
  { slug: 'layout', title: 'Microsoft Layout', lead: "Space Designers can arrange 3D models in a room before moving any equipment.", category: 'AR / MR / HoloLens', kind: 'design' },
  { slug: 'product-visualize', title: 'Microsoft Product Visualize', lead: "Sales teams could show customers how a product would fit in their own space.", category: 'AR / CRM', kind: 'design' },
  { slug: 'dynamics-365-customer-voice', title: 'Microsoft Customer Voice', lead: "Customer Voice brings survey responses into Dynamics 365 so teams can follow up on feedback.", category: 'Forms / CRM', kind: 'design' },
  { slug: 'seeing-ai', title: 'Microsoft Seeing AI', lead: "Sound and vibration helped people with visual impairments locate a chair.", category: 'Accessibility / AI', kind: 'design' },
  { slug: 'netmarble', title: 'Netmarble Games', lead: "My work at Netmarble spanned the company’s visual identity and the interfaces players used on their phones.", category: 'Brand / UX', kind: 'design' },
  { slug: 'starbucks-technology', title: 'Starbucks Technology', lead: "I worked with the Starbucks Innovation Lab on an iPad tool for planning batches of coffee.", category: 'User Research / iPad', kind: 'design' },
  { slug: 'wrap-and-charge', title: 'Kikkerland Wrap and Charge', lead: "A charger with a place to wind the cable makes both easier to carry.", category: 'Industrial Design', kind: 'design' },
  { slug: 'coin-lock', title: 'Coin Lock', lead: "A portable lock designed for the things people leave outside, from bikes to strollers.", category: 'Industrial Design', kind: 'design' },
  { slug: '10-borders', title: '10 Borders', lead: "A poster traces one refugee’s escape from Syria.", category: 'Graphic Design', kind: 'design' },
  { slug: 'paintsound', title: 'Paint Sound', lead: "Paint Sound turns nearby sounds into holograms that people with hearing loss can see.", category: 'Hololens', kind: 'design' },
  { slug: '3-coffee-shops-in-tokyo', title: '3 Coffee Shops in Tokyo', lead: "Three stops in Tokyo took me from a latte art bar to a coffee counter at Uniqlo.", category: 'Japan', kind: 'coffee' },
  { slug: '5-coffee-shops-in-seattle', title: '5 Coffee Shops in Seattle', lead: "From Capitol Hill to a café inside a radio station, these are five places I return to for coffee in Seattle.", category: 'USA', kind: 'coffee' },
  { slug: '3-coffee-shops-amsterdam', title: '3 coffee shops in Amsterdam', lead: "Bocca, Back to Black, and King Kong were my favorite stops for coffee in Amsterdam.", category: 'Netherlands', kind: 'coffee' },
  { slug: 'best-coffee-shops-new-york-city', title: '5 Coffee Shops in NYC', lead: "Five places to pick up a cup on a walk through New York, from Abraço to Birch.", category: 'USA', kind: 'coffee' },
  { slug: '5-in-milan', title: '5 cafes in Milan', lead: "The espresso I remember best in Milan cost one euro at Giacomo Tabaccheria.", category: 'Italy', kind: 'coffee' },
  { slug: 'top-3-fancy-cafes-paris', title: 'Top 3 Fancy Cafes in Paris', lead: "For a special occasion in Paris, I’d start with these three cafés in a museum, a hotel, and a department store.", category: 'France', kind: 'coffee' },
  { slug: 'top-5-coffee-shop-paris', title: 'Top 5 Coffee Shops in Paris', lead: "Revisiting the city where I grew up led me to five favorite coffee stops in Paris.", category: 'France', kind: 'coffee' },
  { slug: 'top-5-coffee-shops-in-london', title: 'Top 5 Coffee Shops in London', lead: "These five cafés stood out on my trips to London, from Attendant to Seven Dials.", category: 'UK', kind: 'coffee' },
  { slug: 'blue-olive', title: 'Blue Olive', lead: "Near the Eiffel Tower, Blue Olive drew me in with its small, welcoming space.", category: 'Paris', kind: 'coffee' },
  { slug: 'telescope', title: 'Télescope', lead: "My first café review started at Télescope, a small coffee shop near the Louvre.", category: 'Paris', kind: 'coffee' },
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

export const tileFor = (slug: string): Tile | undefined => getProject(slug)?.thumbnail ?? siteData.tiles[slug === 'premiere-generative-ai' ? '704' : slug];
export const blocksFor = (slug: string): Block[] => (editedArticles as Record<string, Block[]>)[slug] ?? siteData.blocks[slug === 'premiere-generative-ai' ? '704' : slug] ?? [];

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
 * GenAI (704) and Layout animate in the original live grid. Seeing AI
 * and Netmarble render their existing static tiles (siteData.tiles) via the
 * normal Picture path below — no motionTiles entry means no video.
 *
 * Every source re-confirmed frame-by-frame against ajwoo.com before encoding:
 *   704 (GenAI in Premiere Pro)  ajwoo.com/wp-content/uploads/2024/07/genai-pr-570-compressed.gif  (570×570, already square)
 *   layout                      ajwoo.com/wp-content/uploads/2019/02/layout33333d.gif  (865×864, center-cropped to 864×864)
 */
type MotionTile = { base: string; width: number; height: number; hasWebm: boolean };
const motionTiles: Record<string, MotionTile> = {
  'seeing-ai': { base: 'mov-seeing-ai-chair', width: 720, height: 720, hasWebm: true },
  'product-visualize': { base: 'mov-product-visualize', width: 720, height: 720, hasWebm: true },
  'pr-ae-frame': { base: 'mov-frameio-premiere-after-effects', width: 720, height: 720, hasWebm: true },
  netmarble: { base: 'mov-netmarble-friends', width: 720, height: 720, hasWebm: true },
  // Alex supplied this 5-second loop for the local Netflix portfolio draft.
  'netflix-creative-tools': { base: 'mov-netflix-creative-tools', width: 720, height: 720, hasWebm: false },
  'premiere-generative-ai': { base: 'mov-premiere-generative-ai', width: 720, height: 720, hasWebm: true },
  layout: { base: 'mov-layout-33333d', width: 864, height: 864, hasWebm: true },
};
export const motionTileFor = (slug: string): MotionTile | undefined => motionTiles[slug];
