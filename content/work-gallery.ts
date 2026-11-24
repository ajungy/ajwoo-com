import { blocksFor, designProjects, motionTileFor, tileFor } from '@/content/projects';

const timelineYears: Record<string, string> = {
  'netflix-creative-tools': '2026',
  'premiere-generative-ai': '2024',
  'pr-ae-frame': '2022',
  'product-visualize': '2019',
  layout: '2018',
  'seeing-ai': '2017',
};

export const workGallery = designProjects.filter((project) => !['starbucks-technology', 'paintsound', 'coin-lock', 'dynamics-365-customer-voice', '10-borders'].includes(project.slug)).flatMap((project) => {
    const image = tileFor(project.slug === 'layout' ? 'paintsound' : project.slug);
    if (!image) return [];
    const first = blocksFor(project.slug).find((block) => block.kind === 'text');
    const year = timelineYears[project.slug] ??
      (first?.kind === 'text' ? first.value.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? '' : '');
    return [{ title: project.title, subtitle: project.category, year, href: `/work/${project.slug}/`, image, video: project.slug === 'layout' ? undefined : motionTileFor(project.slug) }];
  }).sort((a, b) => Number(b.year) - Number(a.year));
