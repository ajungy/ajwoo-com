import { Action } from '@/components/Action';
import { Picture } from '@/components/Picture';
import { ProjectCard } from '@/components/ProjectCard';
import { designProjects, coffeeProjects, imageData } from '@/content/projects';
import { site, education, clients, featured, social } from '@/content/site';

/**
 * The job: a visitor deciding whether Alex is worth their time reaches that
 * decision inside one scroll, and acts on it in one click.
 *
 * So the order is: who he is -> the evidence -> the one action. Everything that
 * doesn't move that decision (education, clients, awards) sits below it.
 */
export default function Home() {
  const evidence = [...designProjects.slice(0, 2), coffeeProjects[0]];
  return (
    <div className="mx-auto max-w-app px-page">
      {/* Identity. The single most important element, and the only thing on this
          site that ever animates. */}
      <section className="pt-12 pb-9">
        <h1 className="entrance-target max-w-content text-display text-fg">{site.identity}</h1>
        <p className="mt-8 max-w-content text-body-lg text-fg-secondary">{site.bio}</p>
        <div className="mt-9 flex flex-wrap items-center gap-6">
          <Action href={site.calendlyUrl} external variant="primary" cursorLabel={site.ctaLabel}>
            {site.ctaLabel}
          </Action>
          {social.map((s) => (
            <Action key={s.label} href={s.href} external variant="tertiary" cursorLabel={`Open ${s.label}`}>
              {s.label}
            </Action>
          ))}
        </div>
      </section>

      {imageData.hero && (
        <section className="pb-12">
          <Picture
            img={imageData.hero}
            alt="Alex Woo"
            priority
            sizes="(min-width: 1200px) 1200px, 100vw"
            className="block w-full h-auto rounded-lg border border-line-subtle"
          />
        </section>
      )}

      <section className="pb-12">
        <div className="flex items-baseline justify-between gap-8">
          <h2 className="text-h2 text-fg">Selected work</h2>
          <Action href="/design/" variant="tertiary" cursorLabel="See all the work">
            All work
          </Action>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 medium:grid-cols-2 expanded:grid-cols-3">
          {evidence.map((p) => p && <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-12 pb-12 expanded:grid-cols-3">
        <div>
          <h2 className="text-h3 text-fg">Education</h2>
          <ul className="mt-6 space-y-6">
            {education.map((e) => (
              <li key={e.school}>
                <p className="text-body text-fg">{e.school}</p>
                <p className="text-caption text-fg-secondary">{e.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-h3 text-fg">Clients</h2>
          <ul className="mt-6 space-y-4">
            {clients.map((c) => (
              <li key={c} className="text-body text-fg-secondary">{c}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-h3 text-fg">Featured</h2>
          <ul className="mt-6 space-y-4">
            {featured.map((f) => (
              <li key={`${f.year}-${f.what}`} className="flex gap-6">
                {/* Mono earns its place here only: years sit in a column and
                    should align. Used nowhere else on the site. */}
                <span className="font-mono text-caption text-fg-tertiary tabular-nums">{f.year}</span>
                <span className="text-body text-fg-secondary">{f.what}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
