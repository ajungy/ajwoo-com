import type { Metadata } from 'next';
import { WorksWheel } from '@/components/ui/works-wheel';
import { blocksFor, designProjects, motionTileFor, tileFor } from '@/content/projects';

const shareImage = {
  url: 'https://www.ajwoo.com/img/tile-netflix-creative-tools.jpg',
  width: 1024,
  height: 1024,
  alt: 'Netflix: Creative Tools — Alex Woo',
};

export const metadata: Metadata = {
  title: 'Work',
  alternates: { canonical: 'https://www.ajwoo.com/work/' },
  openGraph: {
    title: 'Work — Alex Woo',
    url: 'https://www.ajwoo.com/work/',
    images: [shareImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work — Alex Woo',
    images: [shareImage],
  },
};

export default function WorkPage() {
  const items = designProjects.filter((project) => !['starbucks-technology', 'paintsound', 'coin-lock'].includes(project.slug)).flatMap((project) => {
    const image = tileFor(project.slug === 'layout' ? 'paintsound' : project.slug);
    if (!image) return [];
    const first = blocksFor(project.slug).find((block) => block.kind === 'text');
    const year = project.slug === 'netflix-creative-tools' ? '2025, 2026'
      : first?.kind === 'text' ? first.value.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? '' : '';
    return [{ title: project.title, subtitle: project.category, year, href: `/work/${project.slug}/`, image, video: project.slug === 'layout' ? undefined : motionTileFor(project.slug) }];
  }).sort((a, b) => Math.max(...(b.year.match(/\d{4}/g) ?? ['0']).map(Number)) - Math.max(...(a.year.match(/\d{4}/g) ?? ['0']).map(Number)));
  return <div><h1 className="sr-only">Work</h1><WorksWheel items={items} /></div>;
}
