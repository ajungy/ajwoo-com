import { Action } from '@/components/Action';
import { TypingWord } from '@/components/HeroOverlay';
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
        <section className="pt-12 pb-9">
          {/* The single most important element on the page, and the only place
              the one-time entrance animation runs. The verb inside it also
              types and deletes in a loop — see HeroOverlay.tsx for why that is
              a documented deviation from "nothing moves at rest".
              The two lines are independent, fixed-height boxes (52px = the
              text-display line-height), AND the typing word itself renders
              `position: absolute` inside the first line (see HeroOverlay.tsx)
              — it is fully out of flow, so no font among the five it cycles
              through can ever affect the first line's height, the second
              line's position, or anything on the page below. lineHeight={52}
              here is the single source of truth for both the line's box
              height and the word's own vertical centering. */}
          <h1 className="entrance-target max-w-content text-fg">
            <span className="block h-[clamp(34px,8.5vw,52px)] text-display">
              Alex Woo <TypingWord lineHeight="clamp(34px, 8.5vw, 52px)" />
            </span>
            <span className="block text-display">
              creative tools at Netflix
            </span>
            <span className="block text-display">
              Adobe, Microsoft, and more.
            </span>
          </h1>

          {/* Moved off the hero photo and under the headline, at Alex's direction.
              These are the same actions, anchored to the identity text instead
              of floating over an image. Email copies to clipboard rather
              than opening a mailto: link (CopyEmailButton), so it isn't a
              plain href like the others. */}
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
        <StaggerReveal className="mt-36 grid grid-cols-1 gap-12 pb-12 medium:grid-cols-2 expanded:grid-cols-3">
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
