import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Action } from '@/components/Action';
import { Blocks } from '@/components/Blocks';
import { ProjectCard } from '@/components/ProjectCard';
import {
  projects, getProject, blocksFor, designProjects, coffeeProjects,
} from '@/content/projects';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProject(params.slug);
  return { title: p?.title ?? 'Work' };
}

export default function WorkPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const all = blocksFor(project.slug);
  // The first line of several posts is the title again. The <h1> already says
  // it, so repeating it is a second hierarchy for the same thing.
  const blocks =
    all[0]?.kind === 'text' && all[0].value.trim().toLowerCase() === project.title.trim().toLowerCase()
      ? all.slice(1)
      : all;
  const isCoffee = project.kind === 'coffee';
  const backHref = isCoffee ? '/coffee/' : '/design/';
  const backLabel = isCoffee ? 'Coffee' : 'Design';

  // No dead ends: every project offers the next one (Principle 7).
  const siblings = (isCoffee ? coffeeProjects : designProjects).filter((p) => p.slug !== project.slug);
  const next = siblings.slice(0, 3);

  return (
    // Same container and page padding as the top bar, so the content lines up
    // with the wordmark on the left and the CTA on the right.
    <div className="mx-auto max-w-app px-page">
      <div className="pt-9">
        <Action href={backHref} variant="tertiary" cursorLabel="Go back">
          ← {backLabel}
        </Action>
      </div>

      <header className="pt-8 pb-12">
        <h1 className="text-h1 text-fg">{project.title}</h1>
        <p className="mt-4 text-body-lg text-fg-secondary">{project.category}</p>
      </header>

      <article className="pb-12">
        <Blocks blocks={blocks} alt={project.title} />
      </article>

      {next.length > 0 && (
        <section className="border-t border-line-subtle pt-12 pb-12">
          <h2 className="text-h3 text-fg">More {isCoffee ? 'reviews' : 'work'}</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 medium:grid-cols-2 expanded:grid-cols-3">
            {next.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
