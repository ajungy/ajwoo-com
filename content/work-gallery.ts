import { blocksFor, designProjects, motionTileFor, tileFor } from '@/content/projects';

const companyTimelines = [
  { years: ['2021', '2022', '2023', '2024'], projects: ['premiere-generative-ai', 'pr-ae-frame'] },
  { years: ['2017', '2018', '2019', '2020'], projects: ['layout', 'product-visualize', 'dynamics-365-customer-voice', 'seeing-ai'] },
];

export const workGallery = designProjects.filter((project) => !['starbucks-technology', 'paintsound', 'coin-lock'].includes(project.slug)).flatMap((project) => {
    const image = tileFor(project.slug === 'layout' ? 'paintsound' : project.slug);
    if (!image) return [];
    const first = blocksFor(project.slug).find((block) => block.kind === 'text');
    const year = project.slug === 'netflix-creative-tools' ? '2025, 2026'
      : first?.kind === 'text' ? first.value.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? '' : '';
    const companyYears = companyTimelines.find(group => group.projects.includes(project.slug))?.years;
    return [{ companyYears, title: project.title, subtitle: project.category, year, href: `/work/${project.slug}/`, image, video: project.slug === 'layout' ? undefined : motionTileFor(project.slug) }];
  }).sort((a, b) => Math.max(...(b.year.match(/\d{4}/g) ?? ['0']).map(Number)) - Math.max(...(a.year.match(/\d{4}/g) ?? ['0']).map(Number)));
