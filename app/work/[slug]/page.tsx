import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Picture } from '@/components/Picture';
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

/**
 * Matches the layout the live ajwoo.com work pages already use, not an
 * invented one: full-width hero image directly under the header bar, THEN
 * the title, then the body. Two things this version removes/changes and why:
 *
 * - No "← Design"/"← Coffee" back button. The top bar's own wordmark and nav
 *   already go back to either page in one click; a second, redundant back
 *   affordance sitting alone above the fold wasn't on the live site and
 *   wasn't earning its space here either.
 * - The first block, when it's an image, renders full-bleed ABOVE the title
 *   rather than inside the body after it — this is where the live pages put
 *   their hero shot, and title-then-hero read as backwards next to that.
 */
// Matches a leading "<title>, 2019" / "<title> - 2024" subtitle block — the
// live posts restate the title with a year tacked on as their own small
// sub-heading, which read as a second, redundant title directly under the
// real `<h1>` (and often didn't even match the h1's exact wording, e.g.
// "Gen AI in Premiere Pro - 2024" next to an h1 reading "GenAI in Premiere
// Pro", so the older exact-match dedup below never caught it). The year is
// the only real information in that line, so it moves onto the main title
// instead and the subtitle block is dropped entirely.
const YEAR_SUBTITLE = /^.{0,60}?[\s,-]+((?:19|20)\d{2})\s*$/;

export default function WorkPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const all = blocksFor(project.slug);
  const firstBlock = all[0];
  // The first line of several posts is the title again. The <h1> already says
  // it, so repeating it is a second hierarchy for the same thing.
  const isExactTitle =
    firstBlock?.kind === 'text' && firstBlock.value.trim().toLowerCase() === project.title.trim().toLowerCase();
  const yearMatch = firstBlock?.kind === 'text' ? firstBlock.value.match(YEAR_SUBTITLE) : null;
  const year = isExactTitle ? null : yearMatch?.[1] ?? null;
  const withoutTitle = isExactTitle || yearMatch ? all.slice(1) : all;

  // Peel the hero image off the front of the body so it can render full-width
  // above the title, matching the live site. Only the very first block, and
  // only if it actually is one — most posts start this way, but not all.
  const hero = withoutTitle[0]?.kind === 'image' ? withoutTitle[0] : null;
  const blocks = hero ? withoutTitle.slice(1) : withoutTitle;

  const isCoffee = project.kind === 'coffee';

  // No dead ends: every project offers the next one (Principle 7).
  const siblings = (isCoffee ? coffeeProjects : designProjects).filter((p) => p.slug !== project.slug);
  const next = siblings.slice(0, 3);

  return (
    <>
      {hero && (
        <Picture
          img={hero}
          alt={project.title}
          priority
          sizes="100vw"
          className="block h-auto w-full"
        />
      )}

      <div className="mx-auto max-w-app px-page">
        <header className="pt-12 pb-12">
          <h1 className="text-h1 text-fg">{project.title}{year ? `, ${year}` : ''}</h1>
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
    </>
  );
}
