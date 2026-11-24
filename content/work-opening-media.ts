import { blocksFor, tileFor } from './projects';

const openingVideos: Record<string, { base: string; width: number; height: number; hasWebm: false; label: string }> = {
  netmarble: { base: 'netmarble-games-demo', width: 1920, height: 1080, hasWebm: false, label: 'Netmarble Games video' },
  layout: { base: 'microsoft-layout-demo', width: 1920, height: 1080, hasWebm: false, label: 'Microsoft Layout demonstration' },
  'netflix-creative-tools': { base: 'netflix-creative-tools-demo', width: 1900, height: 1086, hasWebm: false, label: 'Netflix creative tools video example' },
  'premiere-generative-ai': { base: 'premiere-generative-remove', width: 1920, height: 1080, hasWebm: false, label: 'Generative removal in Premiere Pro' },
  'pr-ae-frame': { base: 'frameio-review-workflow', width: 1280, height: 720, hasWebm: false, label: 'Frame.io review workflow in Premiere Pro' },
  'seeing-ai': { base: 'seeing-ai-horizontal', width: 1280, height: 720, hasWebm: false, label: 'Microsoft Seeing AI demonstration' },
  'product-visualize': { base: 'product-visualize-horizontal', width: 1280, height: 720, hasWebm: false, label: 'Microsoft Product Visualize demonstration' },
};

export function workOpeningMedia(slug: string) {
  if (slug === '10-borders') return { image: { base: 'ten-borders-poster', src: '/img/ten-borders-poster.png', width: 1920, height: 1079 } };
  if (slug === 'wrap-and-charge') return { image: { base: 'wrap-and-charge-opening', src: '/img/wrap-and-charge-opening.png', width: 1920, height: 1080 } };
  const video = openingVideos[slug];
  if (video) return { video };
  const image = blocksFor(slug).find(block => block.kind === 'image');
  return { image: image?.kind === 'image' ? image : tileFor(slug) };
}
