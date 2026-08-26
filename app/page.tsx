import { Action } from '@/components/Action';
import { HeroPhoto } from '@/components/HeroPhoto';
import { FeaturedApp } from '@/components/FeaturedApp';
import { CopyEmailButton } from '@/components/CopyEmailButton';
import { DesignPrinciples } from '@/components/DesignPrinciples';
import { SkillsSection } from '@/components/SkillsSection';
import { StaggerReveal } from '@/components/StaggerReveal';
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
      <div className="mx-auto max-w-app px-page">
        {/* Two columns: the identity statement + actions on the left, the
            personal greeting + bio on the right — replacing the earlier
            single-column typing headline entirely, at Alex's direction.
            Stacks to one column below `medium` (600px). pt-20 (was pt-12),
            at Alex's direction — more air between the header bar and the
            headline than the chrome's own internal spacing implies. */}
        {/* gap-14 stacked (was gap-8), at Alex's direction — more room
            between the button row and the "Hi, I'm Alex" column once they
            stack on mobile. medium:gap-16 (side-by-side layout) is
            unaffected — that gap is horizontal, not the one Alex meant. */}
        <section className="entrance-target grid grid-cols-1 gap-14 pt-20 pb-9 medium:grid-cols-2 medium:gap-16">
          <div className="hero-col">
            {/* Sizing lives entirely in .hero-serif (globals.css), fluid
                against the column's own width via a container query — see
                the comment there. Reverted from ParticleText (CLAUDE.md
                §6(f), now marked superseded) back to plain text, at Alex's
                direction. */}
            <h1 className="hero-serif text-fg">{site.headline}</h1>

            {/* These are the same actions that used to sit under the old
                headline. Email copies to clipboard rather than opening a
                mailto: link (CopyEmailButton), so it isn't a plain href
                like the other two. */}
            <StaggerReveal className="mt-8 flex flex-wrap items-center gap-4">
              <Action href={site.calendlyUrl} external variant="secondary" cursorLabel="Book time">
                {site.ctaLabel}
              </Action>
              <CopyEmailButton />
              {social.map((s) => (
                <Action
                  key={s.label}
                  href={s.href}
                  external={s.external}
                  showExternalIcon={s.external}
                  variant="secondary"
                  cursorLabel={s.label}
                >
                  {s.label}
                </Action>
              ))}
            </StaggerReveal>
          </div>

          {/* mt-3 optically aligns this with the headline opposite it — the
              italic serif's cap-height sits differently than the sans-serif
              body type at a much smaller size, so a shared grid-row top
              edge alone reads as slightly too high; nudging this column
              down a few pixels is what actually lines the two up by eye,
              at Alex's direction. */}
          <div className="mt-3">
            {/* Regular weight throughout except the emphasis clause, which
                steps up to medium (500) — weight only, same size and family,
                at Alex's direction. */}
            <p className="text-body-lg text-fg">
              {site.greeting} <span className="font-medium">{site.greetingEmphasis}</span>
            </p>
            <p className="mt-4 max-w-content text-body-lg text-fg-secondary">{site.bio}</p>
          </div>
        </section>
      </div>

      {/* Full-bleed portrait, matching the width it runs at on ajwoo.com today.
          No overlay any more — the typing line and the social row both moved
          up into the header block above. Theme-aware: a separate dark-mode
          photo swaps in via CSS (see HeroPhoto.tsx) rather than a filter. */}
      {siteData.hero && (
        <section className="mb-12">
          <HeroPhoto light={siteData.hero} dark={siteData.heroDark} />
        </section>
      )}

      <div className="mx-auto max-w-app px-page">
        {capture && <FeaturedApp app={capture} />}

        <DesignPrinciples />
        <SkillsSection />

        {/* medium:grid-cols-2 added as an intermediate step — the previous
            version jumped straight from 1 column (everything stacked,
            mobile AND tablet) to 3 (840px+), which left tablet portrait and
            small-window desktop looking top-heavy: three full-height stacked
            lists with nothing to balance them side by side. Now there's a
            real 2-column tablet state before the 3-column desktop one. */}
        <StaggerReveal className="mt-[245px] grid grid-cols-1 gap-12 pb-12 medium:grid-cols-2 expanded:grid-cols-3">
          <div>
            <h2 className="text-h3 text-fg">Education</h2>
            <ul className="mt-6 space-y-6">
              {education.map((e) => (
                <li key={e.school}>
                  {/* Both lines the same size (text-body) — a school's name
                      and its own degree/detail are equally load-bearing
                      facts, not a heading-and-caption pair. */}
                  <p className="text-body text-fg">{e.school}</p>
                  <p className="text-body text-fg-secondary">{e.detail}</p>
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
                <li key={`${f.year}-${f.what}`} className="flex items-baseline gap-6">
                  {/* Mono earns its place here only: years sit in a column and
                      should align. Same text-body size as the description
                      now (was text-caption) — the mismatched size and
                      line-height was what threw the two off the same
                      baseline whenever a longer entry like "Starbucks
                      Technology" was next to it; items-baseline plus a
                      matching size fixes it regardless of line length. */}
                  <span className="font-mono text-body tabular-nums text-fg-tertiary">{f.year}</span>
                  <span className="text-body text-fg-secondary">{f.what}</span>
                </li>
              ))}
            </ul>
          </div>
        </StaggerReveal>
      </div>
    </>
  );
}
