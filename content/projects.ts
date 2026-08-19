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
export const siteData = data as {
  hero: { base: string; widths: number[]; fallbackWidth: number; width: number; height: number } | null;
  tiles: Record<string, Tile>;
  blocks: Record<string, Block[]>;
};

export const tileFor = (slug: string): Tile | undefined => siteData.tiles[slug];
export const blocksFor = (slug: string): Block[] => siteData.blocks[slug] ?? [];
