import { Action } from '@/components/Action';
import { Cursor } from '@/components/Cursor';
import { TypingWord } from '@/components/HeroOverlay';
import { Picture } from '@/components/Picture';
import { FeaturedApp } from '@/components/FeaturedApp';
import { siteData } from '@/content/projects';
import { site, education, clients, featured, social } from '@/content/site';
import { apps } from '@/content/apps';

/**
 * The job: a visitor deciding whether Alex is worth their time reaches that
 * decision inside one scroll, and acts on it in one click.
 */
export default function Home() {
  const capture = apps.find((a) => a.slug === 'capture');

  return (
    <>
      {/* The water cursor lives on the landing page only. */}
      <Cursor />

      <div className="mx-auto max-w-app px-page">
        <section className="pt-12 pb-9">
          {/* The single most important element on the page, and the only place
              the one-time entrance animation runs. The verb inside it also
              types and deletes in a loop — see HeroOverlay.tsx for why that is
              a documented deviation from "nothing moves at rest". */}
          <h1 className="entrance-target max-w-content text-display text-fg">
            Alex Woo <TypingWord /> creative tools at Netflix.
          </h1>
          <p className="mt-8 max-w-content text-body-lg text-fg-secondary">{site.bio}</p>

          {/* Moved off the hero photo and under the bio, at Alex's direction —
              this is the same three actions, just anchored to the identity
              text instead of floating over an image. */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {social.map((s) => (
              <Action key={s.label} href={s.href} external={s.external} variant="secondary" cursorLabel={s.label}>
                {s.label}
              </Action>
            ))}
          </div>
        </section>
      </div>

      {/* Full-bleed portrait, matching the width it runs at on ajwoo.com today.
          No overlay any more — the typing line and the social row both moved
          up into the header block above. */}
      {siteData.hero && (
        <section className="mb-12">
          <Picture
            img={siteData.hero}
            alt="Alex Woo"
            priority
            sizes="100vw"
            className="block h-auto w-full"
          />
        </section>
      )}

      <div className="mx-auto max-w-app px-page">
        {capture && <FeaturedApp app={capture} />}

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
                      should align. */}
                  <span className="font-mono text-caption tabular-nums text-fg-tertiary">{f.year}</span>
                  <span className="text-body text-fg-secondary">{f.what}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
