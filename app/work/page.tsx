import type { Metadata } from 'next';
import { SHARE_IMAGE } from '@/lib/metadata';
import { WorksWheel, type WorksWheelItem } from '@/components/ui/works-wheel';
import { blocksFor, designProjects, motionTileFor, tileFor } from '@/content/projects';

export const metadata: Metadata = {
  title: 'Work',
  alternates: { canonical: 'https://www.ajwoo.com/work/' },
  openGraph: {
    title: 'Work — Alex Woo',
    url: 'https://www.ajwoo.com/work/',
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work — Alex Woo',
    images: [SHARE_IMAGE],
  },
};

export default function WorkPage() {
  const items: WorksWheelItem[] = designProjects.filter((project) => !['starbucks-technology', 'paintsound', 'coin-lock'].includes(project.slug)).flatMap((project) => {
    const image = tileFor(project.slug === 'layout' ? 'paintsound' : project.slug);
    if (!image) return [];
    const first = blocksFor(project.slug).find((block) => block.kind === 'text');
    const year = project.slug === 'netflix-creative-tools' ? '2025, 2026'
      : first?.kind === 'text' ? first.value.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? '' : '';
    return [{ title: project.title, subtitle: project.category, year, href: `/work/${project.slug}/`, image, video: project.slug === 'layout' ? undefined : motionTileFor(project.slug) }];
  }).sort((a, b) => Math.max(...(b.year.match(/\d{4}/g) ?? ['0']).map(Number)) - Math.max(...(a.year.match(/\d{4}/g) ?? ['0']).map(Number)));
  items.push({
    title: 'Background',
    subtitle: 'More about Alex',
    year: '2014',
    href: '/work/#background',
    paragraphs: [
      'Thanks for scrolling all the way down and visiting ajwoo.com.',
      'Alex J. Woo is a designer who has helped shape creative experiences at Netflix, Adobe, and Microsoft.',
      'A graduate of the Rhode Island School of Design, Alex also studied at the University of Washington, Brown University, and Le Cordon Bleu. Born in Connecticut while his father was studying at Yale, he grew up in South Korea, France, Switzerland, and the U.S. These experiences shaped his appreciation for different perspectives.',
    ],
  });
  return <div><h1 className="sr-only">Work</h1><WorksWheel items={items} /></div>;
}
