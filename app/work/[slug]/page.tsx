import { ProjectLinks } from '@/components/ProjectLinks';
import { pageMetadata } from '@/lib/metadata';
import { caseStudies } from '@/content/case-studies';
import { NetflixProject } from '@/components/netflix/NetflixProject';
import { netflixWork, netflixPublicExamples } from '@/content/netflix';
import { WorkProjectActions } from '@/components/WorkProjectActions';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Picture } from '@/components/Picture';
import { Blocks } from '@/components/Blocks';
import {
  projects, getProject, blocksFor,
} from '@/content/projects';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProject(params.slug);
  return pageMetadata(`/work/${params.slug}/`, p?.title ?? 'Work', p?.lead);
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

const introVideos: Record<string, { src: string; label: string }> = {
  'pr-ae-frame': { src: '/img/frameio-review-workflow.mp4', label: 'Frame.io review workflow in Premiere Pro' },
  'seeing-ai': { src: '/img/seeing-ai-horizontal.mp4', label: 'Microsoft Seeing AI demonstration' },
  'product-visualize': { src: '/img/product-visualize-horizontal.mp4', label: 'Microsoft Product Visualize demonstration' },
};

const filmRiotId = 'T72C17jVx44';
const relatedVideoIds: Record<string, string> = {
  'premiere-generative-ai': filmRiotId,
  'dynamics-365-customer-voice': 'Qn9hGppCitw',
  'product-visualize': 'NIgog6rYO00',
  layout: '1nnIX75Vpn0',
  'seeing-ai': 'bqeQByqf_f8',
  netmarble: 'p_lSOvGQiRI',
};

export default function WorkPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();
  if (project.slug === 'netflix-creative-tools') return (
    <div className="ph-no-capture" data-private>
      <NetflixProject project={project} work={netflixWork} examples={netflixPublicExamples} />
    </div>
  );

  const source = blocksFor(project.slug);
  const videoId = relatedVideoIds[project.slug];
  const relatedVideo = source.find(block => block.kind === 'embed' && block.src === `https://www.youtube.com/embed/${videoId}`);
  const all = source.filter(block =>
    block !== relatedVideo &&
    !(project.slug === 'wrap-and-charge' && block.kind === 'image' && block.base === 'img-wrap-and-charge-bbb')
  );
  const firstBlock = all[0];
  // The first line of several posts is the title again. The <h1> already says
  // it, so repeating it is a second hierarchy for the same thing.
  const isExactTitle =
    firstBlock?.kind === 'text' && firstBlock.value.trim().toLowerCase() === project.title.trim().toLowerCase();
  const yearMatch = firstBlock?.kind === 'text' ? firstBlock.value.match(YEAR_SUBTITLE) : null;
  const year = isExactTitle ? null : yearMatch?.[1] ?? null;
  const withoutTitle = isExactTitle || yearMatch ? all.slice(1) : all;

  // Keep an opening image between the project metadata and the editorial lead.
  const openingMedia = ['layout', 'netmarble', '10-borders'].includes(project.slug)
    ? withoutTitle.find(block => block.kind === 'image')
    : withoutTitle[0];
  const hero = openingMedia?.kind === 'image' ? openingMedia : null;
  const blocks = hero ? withoutTitle.filter(block => block !== hero) : withoutTitle;

  const introVideo = introVideos[project.slug];
  const study = caseStudies[project.slug];
  const isCoffee = project.kind === 'coffee';


  return (
    <div className="work-reading-column">
        <header className="pt-12 pb-12">
          <h1 className="type-project-title">{project.title}{project.kind === 'coffee' && year ? `, ${year}` : ''}</h1>
          <p className="mt-4 type-caption">{project.category}{project.kind === 'design' && year ? ` - ${year}` : ''}</p>
        </header>

      {hero && (
        <Picture
          img={hero}
          alt={project.title}
          priority
          sizes="(max-width: 592px) calc(100vw - 32px), 560px"
          className="mb-9 block h-auto w-full"
        />
      )}

        <article className="pb-12">
          {introVideo && (
            <video
              className="mb-9 block h-auto w-full"
              width={1280}
              height={720}
              src={introVideo.src}
              aria-label={introVideo.label}
              autoPlay
              loop
              muted
              playsInline
            />
          )}
          {project.slug === 'premiere-generative-ai' ? (
            <figure className="mb-9">
              <video className="mb-9 block h-auto w-full" width={1920} height={1080} autoPlay loop muted playsInline aria-label="Generative removal in Premiere Pro" src="/img/premiere-generative-remove.mp4" />
              <blockquote className="type-section-heading">
                “Adobe had been absolutely crushing it with new tools that leverage AI to give creators more freedom”
              </blockquote>
              <figcaption className="mt-4 type-caption">Ryan Connolly from @FilmRiot</figcaption>
            </figure>
          ) : <p className="mb-9 max-w-content type-section-heading">{project.lead}</p>}
          {study && <section className="max-w-content mb-12">
            <h2 className="type-decision">The challenge</h2>
            <p className="mt-4 type-body">{study.problem}</p>
            <h2 className="mt-9 type-decision">My contribution</h2>
            <p className="mt-4 type-body">{study.scope}</p>
            <h2 className="mt-9 type-decision">Collaboration</h2>
            <p className="mt-4 type-body">{study.collaboration}</p>
            <h2 className="mt-9 type-decision">Public work</h2>
            <p className="mt-4 type-body">{study.outcome}</p>
          </section>}
          <Blocks blocks={study ? [...blocks.filter((b) => b.kind !== 'text'), ...(study.additionalBlocks ?? [])] : blocks} alt={project.title} compactMedia={!isCoffee} />
          {videoId && (
            <ProjectLinks links={[{
              href: `https://www.youtube.com/watch?v=${videoId}`,
              title: relatedVideo?.kind === 'embed' && relatedVideo.title
                ? relatedVideo.title
                : videoId === filmRiotId ? 'Breaking Down Generative AI in Premiere Pro | Adobe Video x @filmriot' : project.title,
              source: 'YouTube',
            }]} />
          )}
          <WorkProjectActions slug={project.slug} section={isCoffee ? 'Coffee' : 'Work'} />
        </article>


    </div>
  );
}
