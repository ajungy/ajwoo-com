import Link from 'next/link';
import { Picture } from './Picture';
import { tileFor, motionTileFor, type Project } from '@/content/projects';

/**
 * Interactive card. Hover raises e1 -> e2 and the border steps to default —
 * no lift transform, because a translating card disturbs its neighbours'
 * apparent alignment. Press is scale(0.995).
 *
 * The whole card is the link and the title is the accessible name, so there are
 * no competing buttons inside it. Title and category are visible AT REST —
 * on the WordPress site they lived in a hover overlay, which made the only
 * label invisible to half of all sessions (Principle 5).
 *
 * A handful of projects render an autoplaying, looping tile instead of a
 * still (see content/projects.ts's motionTileFor doc comment for the full
 * reasoning) — a deliberate, curated exception to click-to-play, restoring
 * the GIF-like motion the grid originally had.
 *
 * Every tile is forced to a 1:1 crop (`aspect-square` + `object-cover` on the
 * media itself), regardless of the source asset's native aspect ratio. Most
 * tiles are already square at the source, but this is a durable guarantee
 * rather than a hope: a future tile sourced at the wrong aspect still lands
 * in a square slot instead of visibly warping the grid.
 *
 * `skeleton-shimmer` replaces the old plain `bg-sunken` on the media
 * container — a shimmer placeholder shows through until the real image or
 * video paints over it, at Alex's direction, so a slow network reads as
 * "loading" rather than as a blank gray box.
 *
 * Motion tiles used `preload="auto"` unconditionally, which forces every
 * autoplaying video's FULL body to download immediately regardless of
 * whether the card is even on screen — on a page with several motion tiles
 * that's real bandwidth spent on video nobody has scrolled to yet. Only the
 * `priority` cards (the first row, already above the fold) still preload
 * eagerly; everything else defers to `metadata` (just enough to know
 * duration/dimensions) until the browser actually needs more to play it.
 */
export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const tile = tileFor(project.slug);
  const motion = motionTileFor(project.slug);
  return (
    <Link
      href={`/work/${project.slug}/`}
      data-cursor-label={project.kind === 'coffee' ? 'Read review' : 'See project'}
      className={
        'group block rounded-lg border border-line-subtle bg-raised shadow-e1 overflow-hidden card-press ' +
        'can-hover:hover:shadow-e2 can-hover:hover:border-line'
      }
    >
      <div className="skeleton-shimmer aspect-square overflow-hidden">
        {motion ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload={priority ? 'auto' : 'metadata'}
            poster={`/img/${motion.base}-poster.webp`}
            width={motion.width}
            height={motion.height}
            className="card-thumb-media block h-full w-full object-cover"
          >
            <source src={`/img/${motion.base}.webm`} type="video/webm" />
            <source src={`/img/${motion.base}.mp4`} type="video/mp4" />
          </video>
        ) : tile ? (
          <Picture
            img={tile}
            alt={project.title}
            priority={priority}
            sizes="(min-width: 840px) 33vw, (min-width: 600px) 50vw, 100vw"
            className="card-thumb-media block h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="p-7">
        <h3 className="text-title text-fg">{project.title}</h3>
        <p className="mt-2 text-caption text-fg-secondary">{project.category}</p>
      </div>
    </Link>
  );
}
