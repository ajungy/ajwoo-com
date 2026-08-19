import Link from 'next/link';
import { Picture } from './Picture';
import { imageData, type Project } from '@/content/projects';

/**
 * Interactive card. Hover raises e1 -> e2 and the border steps to default —
 * no lift transform, because a translating card disturbs its neighbours'
 * apparent alignment. Press is scale(0.995).
 *
 * The whole card is the link and the title is the accessible name, so there are
 * no competing buttons inside it. Title and category are visible AT REST —
 * on the WordPress site they lived in a hover overlay, which made the only
 * label invisible to half of all sessions (Principle 5).
 */
export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const tile = imageData.projects[project.slug]?.tile;
  return (
    <Link
      href={`/work/${project.slug}/`}
      data-cursor-label={project.kind === 'coffee' ? 'Read review' : 'See project'}
      className={
        'group block rounded-lg border border-line-subtle bg-raised shadow-e1 overflow-hidden card-press ' +
        'can-hover:hover:shadow-e2 can-hover:hover:border-line'
      }
    >
      <div className="bg-sunken">
        {tile ? (
          <Picture
            img={tile}
            alt={project.title}
            priority={priority}
            sizes="(min-width: 840px) 33vw, (min-width: 600px) 50vw, 100vw"
            className="block w-full h-auto"
          />
        ) : (
          <div className="aspect-square" />
        )}
      </div>
      <div className="p-7">
        <h3 className="text-title text-fg">{project.title}</h3>
        <p className="mt-2 text-caption text-fg-secondary">{project.category}</p>
      </div>
    </Link>
  );
}
