import { workOpeningMedia } from '@/content/work-opening-media';
import { WorkMediaTransition } from '@/components/WorkMediaTransition';
import type { Metadata } from 'next';
import { SHARE_IMAGE } from '@/lib/metadata';
import { WorksWheel, type WorksWheelItem } from '@/components/ui/works-wheel';
import { workGallery } from '@/content/work-gallery';

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
  const items: WorksWheelItem[] = workGallery.map(item => ({ ...item, image: undefined, video: undefined, ...workOpeningMedia(item.href.split('/')[2]) }));
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
  return <div><WorkMediaTransition /><h1 className="sr-only">Work</h1><WorksWheel items={items} /></div>;
}
