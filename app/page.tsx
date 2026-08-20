import { Action } from '@/components/Action';
import { Cursor } from '@/components/Cursor';
import { TypingLine } from '@/components/HeroOverlay';
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
          <h1 className="entrance-target max-w-content text-display text-fg">{site.identity}</h1>
          <p className="mt-8 max-w-content text-body-lg text-fg-secondary">{site.bio}</p>
        </section>
      </div>

      {/* Full-bleed portrait, matching the width it runs at on ajwoo.com today.
          Breaking out of the container is deliberate — this is the one element
          on the site that spans edge to edge. */}
      {siteData.hero && (
        <section className="relative mb-12">
          <Picture
            img={siteData.hero}
            alt="Alex Woo"
            priority
            sizes="100vw"
            className="block h-auto w-full"
          />

          {/* One row across the foot of the photo: the typing line on the left,
              the three ways to reach him on the right. The scrim is what makes
              white text legible over an unknown part of a photograph. */}
          <div className="on-media-scrim absolute inset-x-0 bottom-0 pt-14">
            <div className="mx-auto flex max-w-app flex-col gap-6 px-page py-8 medium:flex-row medium:items-center medium:justify-between">
              <p className="on-media text-h2">
                <TypingLine />
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {social.map((s) => (
                  <Action
                    key={s.label}
                    href={s.href}
                    external={s.external}
                    variant="on-media"
                    cursorLabel={s.label}
                  >
                    {s.label}
                  </Action>
                ))}
              </div>
            </div>
          </div>
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
