import { Action } from '@/components/Action';
import { BookTimeAction } from '@/components/BookTimeAction';
import { HeroPhoto } from '@/components/HeroPhoto';
import { FeaturedApp } from '@/components/FeaturedApp';
import { CopyEmailButton } from '@/components/CopyEmailButton';
import { DesignPrinciples } from '@/components/DesignPrinciples';
import { SkillsSection } from '@/components/SkillsSection';
import { StaggerReveal } from '@/components/StaggerReveal';
import { siteData } from '@/content/projects';
import { site, experience, education, clients, featured, social } from '@/content/site';
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
              {/* SpecularButton's WebGL shine effect (React Bits) — moved
                  here from Share at Alex's direction, since this is the
                  site's actual one primary action (Principle 3/CLAUDE.md
                  §0). Pulled into its own client component
                  (components/BookTimeAction.tsx) so the shine's colors can
                  react to the current theme — see that file for the full
                  reasoning and why a Server Component couldn't do this
                  inline. */}
              <BookTimeAction />
              <CopyEmailButton />
              {/* showExternalIcon dropped, at Alex's direction — the
                  linkout glyph next to LinkedIn/Instagram is gone; the
                  label alone plus `external` (which still opens a new
                  tab) is enough. */}
              {social.map((s) => (
                <Action
                  key={s.label}
                  href={s.href}
                  external={s.external}
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

        {/* Two 2-column rows now, not one 3-column grid — Experience/
            Education first, then Featured/"Worked with" below a real
            section break, at Alex's direction. Each row is its own
            StaggerReveal so the two reveal independently rather than one
            shared observer trying to stagger four columns' worth of items
            in one pass. */}
        <StaggerReveal className="mt-[245px] grid grid-cols-1 gap-12 medium:grid-cols-2">
          <div>
            <h2 className="text-h3 text-fg">Experience</h2>
            <ul className="mt-6 space-y-6">
              {experience.map((x) => (
                <li key={x.company}>
                  {/* All three lines the same size (text-body) now, at
                      Alex's direction — company, title, and years read as
                      one consistent block; only colour (--text-fg vs
                      -secondary vs -tertiary) tells them apart, the same
                      "weight/colour only, never a different type scale"
                      rule used everywhere else on this page. Years already
                      dropped the mono/tabular-nums treatment in an earlier
                      pass — Plus Jakarta Sans like every other line. */}
                  <p className="text-body text-fg">{x.company}</p>
                  <p className="text-body text-fg-secondary">{x.title}</p>
                  <p className="mt-1 text-body text-fg-tertiary">{x.years}</p>
                </li>
              ))}
            </ul>
          </div>

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
        </StaggerReveal>

        {/* 245px major-section gap (Principle 10, sidebar above) only from
            `medium` up, where Experience/Education is genuinely a 2-column
            row and this reads as a real jump to the next one. Below that,
            everything in both StaggerReveals stacks into a single column,
            and 245px there read as a much bigger gap than the one between
            Experience's last item and Education's heading right above it —
            same gap-12 (48px) in both cases once they're single-column, at
            Alex's direction ("make sure the spacing... is the same as
            [Experience's last item] to Education"). mt-12 matches that
            48px exactly on mobile/tablet; medium:mt-[245px] restores the
            real section break once the 2-column layout kicks in. */}
        <StaggerReveal className="mt-12 grid grid-cols-1 gap-12 pb-12 medium:mt-[245px] medium:grid-cols-2">
          <div>
            <h2 className="text-h3 text-fg">Featured</h2>
            <ul className="mt-6 space-y-6">
              {featured.map((f) => (
                <li key={`${f.year}-${f.what}`} className="flex items-baseline gap-6">
                  {/* Dropped font-mono/tabular-nums, at Alex's direction —
                      Plus Jakarta Sans like the rest of the page. Same
                      text-body size as the description (was text-caption) —
                      the mismatched size and line-height was what threw the
                      two off the same baseline whenever a longer entry like
                      "Starbucks Technology" was next to it; items-baseline
                      plus a matching size fixes it regardless of line
                      length. space-y-6 (was space-y-4), matching Experience/
                      Education's own item spacing exactly. */}
                  <span className="text-body text-fg-tertiary">{f.year}</span>
                  <span className="text-body text-fg-secondary">{f.what}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {/* Label changed from "Clients" to "Worked with", at Alex's
                direction — the underlying data (content/site.ts's `clients`
                export) is unchanged, only what the heading calls it. */}
            <h2 className="text-h3 text-fg">Worked with</h2>
            {/* space-y-6 (was space-y-4), matching Experience/Education's
                own item spacing, at Alex's direction. */}
            <ul className="mt-6 space-y-6">
              {clients.map((c) => (
                <li key={c} className="text-body text-fg-secondary">{c}</li>
              ))}
            </ul>
          </div>
        </StaggerReveal>
      </div>
    </>
  );
}
