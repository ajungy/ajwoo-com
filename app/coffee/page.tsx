import type { Metadata } from 'next';
import { CoffeeCarousel } from '@/components/coffee/CoffeeCarousel';
import { coffeeProjects, tileFor } from '@/content/projects';

export const metadata: Metadata = { title: 'Coffee' };

export default function CoffeePage() {
  const slides = coffeeProjects.flatMap((project) => {
    const image = tileFor(project.slug);
    if (!image) return [];
    return [{
      ...project,
      image,
      category: project.category === 'Paris' ? 'France' : project.category,
    }];
  });

  return (
    <div>
      <h1 className="sr-only">Coffee</h1>
      <CoffeeCarousel slides={slides} />
    </div>
  );
}
