import { ExternalLink } from './Icons';

type Resource = { href: string; title: string; source: string; description?: string };

export function ProjectLinks({ links, intro }: { links: readonly Resource[]; intro?: string }) {
  return (
    <section className="mt-[var(--section-gap)] max-w-content" aria-labelledby="project-links">
      <h2 id="project-links" className="type-decision">Related links</h2>
      {intro && <p className="mt-4 type-body">{intro}</p>}
      <ul className="mt-6">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noopener noreferrer"
              data-cursor-label="Read public resource"
              className="-mx-6 block rounded-lg px-6 py-7 transition-colors duration-fast ease-standard can-hover:hover:bg-hover">
              <p className="type-caption">{link.source}</p>
              <h3 className="mt-3 flex items-start justify-between gap-6 type-decision">
                <span className="underline decoration-line underline-offset-4">{link.title}</span>
                <ExternalLink className="mt-1 h-7 w-7 shrink-0" />
              </h3>
              {link.description && <p className="mt-4 type-body">{link.description}</p>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
