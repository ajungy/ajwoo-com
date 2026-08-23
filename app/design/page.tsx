import type { Metadata } from 'next';
import { ProjectCard } from '@/components/ProjectCard';
import { StaggerReveal } from '@/components/StaggerReveal';
import { designProjects } from '@/content/projects';

export const metadata: Metadata = { title: 'Design' };

export default function DesignPage() {
  return (
    <div className="mx-auto max-w-app px-page">
      {/* No visible "Design" heading or subtitle — the top-bar nav already
          highlights "Design" as the current page (Principle 3), so a second,
          bigger repetition of the same word right below it was pure
          redundancy. The h1 stays in the DOM as sr-only: assistive tech and
          search engines still get a real page heading, it's just not
          painted. */}
      <h1 className="sr-only">Design</h1>
      {/* pt-3 (6px), not pt-12 — with the title/subtitle gone there's nothing
          to separate the header from any more, and the grid gap itself
          (gap-8) already reads as generous white space above the fold. This
          is deliberately tight: on hover, a card grows 2% toward the header
          and should land close enough that the gap reads as roughly 2px,
          not float in its own dead zone. */}
      <section className="pt-3 pb-12">
        <StaggerReveal className="grid grid-cols-1 gap-8 medium:grid-cols-2 expanded:grid-cols-3">
          {designProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} priority={i < 3} />
          ))}
        </StaggerReveal>
      </section>
    </div>
  );
}
