import type { Metadata } from 'next';
import { ProjectCard } from '@/components/ProjectCard';
import { StaggerReveal } from '@/components/StaggerReveal';
import { coffeeProjects } from '@/content/projects';

export const metadata: Metadata = { title: 'Coffee' };

export default function CoffeePage() {
  return (
    <div className="mx-auto max-w-app px-page">
      {/* No visible "Coffee" heading or subtitle — same reasoning as
          /design: the top-bar nav already marks "Coffee" as current, so
          repeating the word in large type right underneath was redundant.
          sr-only h1 keeps a real heading for assistive tech/SEO. */}
      <h1 className="sr-only">Coffee</h1>
      {/* pt-3 (6px) — see /design's identical comment: with no title/subtitle
          above, the gap is sized so hovering (card grows 2%) closes it to
          roughly 2px against the header, at Alex's direction. */}
      <section className="pt-3 pb-12">
        <StaggerReveal className="grid grid-cols-1 gap-8 medium:grid-cols-2 expanded:grid-cols-3">
          {coffeeProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} priority={i < 3} />
          ))}
        </StaggerReveal>
      </section>
    </div>
  );
}
