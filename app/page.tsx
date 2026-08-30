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

        {/* Four stacked sections now, not two 2-column rows — Experience,
            Education, Featured, and "Worked with" each on their own
            4-column grid, at Alex's direction. `large:col-start-2
            large:col-span-2` centers each section's content inside
            columns 2-3 with 1 and 4 left empty at `large` (1200px) and
            up; below that the grid collapses to one column and content
            sits full-width, left-aligned — "if the window size is large,
            you can see the four grid system... if it becomes small, then
            columns two [and] three... becom[e] column one, left aligned".
            Same grid shape DesignPrinciples.tsx uses above, so every list
            section on the page shares one grid language now instead of
            each having its own bespoke layout.

            Each entry is one row, comma-joined, rather than separate
            stacked lines — "Netflix, Product Design Lead, 2025 – Present"
            all on one line, all the same text-body size (company gets
            font-medium + --text-fg for emphasis, at Alex's direction —
            "highlighting the company title is okay" — but title/years
            stay --text-fg-secondary at the SAME size, not a smaller one). */}
        <section className="mt-[245px]">
          <div className="grid grid-cols-1 large:grid-cols-4">
            <div className="large:col-start-2 large:col-span-2">
              <h2 className="text-h3 text-fg">Experience</h2>
              <StaggerReveal className="mt-6 flex flex-col gap-6">
                {experience.map((x) => (
                  <p key={x.company} className="text-body">
                    <span className="font-medium text-fg">{x.company}</span>
                    <span className="text-fg-secondary">, {x.title}, {x.years}</span>
                  </p>
                ))}
              </StaggerReveal>
            </div>
          </div>
        </section>

        {/* mt-16 between each of these four — a real but smaller break
            than the 245px topic change into Experience above; the four
            read as one cluster of "background" sections, not four
            unrelated topics. */}
        <section className="mt-16">
          <div className="grid grid-cols-1 large:grid-cols-4">
            <div className="large:col-start-2 large:col-span-2">
              <h2 className="text-h3 text-fg">Education</h2>
              <StaggerReveal className="mt-6 flex flex-col gap-6">
                {education.map((e) => (
                  <p key={e.school} className="text-body">
                    <span className="font-medium text-fg">{e.school}</span>
                    <span className="text-fg-secondary">, {e.detail}</span>
                  </p>
                ))}
              </StaggerReveal>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="grid grid-cols-1 large:grid-cols-4">
            <div className="large:col-start-2 large:col-span-2">
              <h2 className="text-h3 text-fg">Featured</h2>
              <StaggerReveal className="mt-6 flex flex-col gap-6">
                {featured.map((f) => (
                  <p key={`${f.year}-${f.what}`} className="text-body">
                    <span className="text-fg-tertiary">{f.year}</span>
                    <span className="text-fg-secondary">, {f.what}</span>
                  </p>
                ))}
              </StaggerReveal>
            </div>
          </div>
        </section>

        <section className="mt-16 pb-12">
          <div className="grid grid-cols-1 large:grid-cols-4">
            <div className="large:col-start-2 large:col-span-2">
              {/* Label changed from "Clients" to "Worked with", at Alex's
                  direction — the underlying data (content/site.ts's
                  `clients` export) is unchanged, only what the heading
                  calls it. Already one name per row, nothing to
                  comma-join. */}
              <h2 className="text-h3 text-fg">Worked with</h2>
              <StaggerReveal className="mt-6 flex flex-col gap-6">
                {clients.map((c) => (
                  <p key={c} className="text-body text-fg-secondary">{c}</p>
                ))}
              </StaggerReveal>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
