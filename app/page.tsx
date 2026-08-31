import { Action } from '@/components/Action';
import { LinkedInLogo, InstagramLogo } from '@/components/Icons';
import { BookTimeAction } from '@/components/BookTimeAction';
import { HeroPhoto } from '@/components/HeroPhoto';
import { FeaturedApp } from '@/components/FeaturedApp';
import { CopyEmailButton } from '@/components/CopyEmailButton';
import { DesignPrinciples } from '@/components/DesignPrinciples';
import { SkillsSection } from '@/components/SkillsSection';
import { StaggerReveal } from '@/components/StaggerReveal';
import { TextAnimate } from '@/components/TextAnimate';
import { siteData } from '@/content/projects';
import { site, experience, education, clients, featured, social } from '@/content/site';
import { apps } from '@/content/apps';

/**
 * The job: a visitor deciding whether Alex is worth their time reaches that
 * decision inside one scroll, and acts on it in one click.
 */
export default function Home() {
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
                the comment there. This is the fourth pass at motion on this
                exact headline (CLAUDE.md §6(d) logs two superseded ones,
                a typing-verb loop then ParticleText, both reverted back to
                plain static text) — TextAnimate.tsx's per-character
                "blurInUp" reveal, at Alex's direction, reusing the SAME
                session-gated entrance flag §6(a)'s already-approved
                sequence uses rather than adding a new exception. See that
                component's own comment for the full reasoning. */}
            <h1 className="hero-serif text-fg">
              <TextAnimate>{site.headline}</TextAnimate>
            </h1>

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
              {/* Icon-only, at Alex's direction ("change the LinkedIn and
                  Instagram buttons into a LinkedIn logo button and an
                  Instagram logo button... it should also have the
                  secondary button treatment like the email button") —
                  same `secondary` Action variant every other button in
                  this row uses, just a square hit box (`w-control-md`
                  matching its own `h-control-md`, `!px-0` overriding the
                  variant's usual `px-6`) around the brand glyph instead of
                  text. `!px-0`, not plain `px-0`: Action.tsx appends this
                  className string AFTER the variant's own classes in the
                  DOM, but that tells Tailwind nothing about which wins in
                  the compiled stylesheet — `.px-0`/`.px-6` are equal
                  specificity, and generation order (not class-attribute
                  order) decided it, which meant `.px-6` silently won,
                  squeezed ~24px of padding into a 40px-wide button, and
                  crushed the icon down to a sliver. `!` forces this
                  utility to `!important`, the one reliable way to
                  override another utility targeting the exact same
                  property from here. `cursorLabel` still carries the
                  real name ("LinkedIn"/"Instagram") for the custom cursor
                  and for assistive tech, even though the visible content
                  is now icon-only. */}
              {social.map((s) => (
                <Action
                  key={s.label}
                  href={s.href}
                  external={s.external}
                  variant="secondary"
                  cursorLabel={s.label}
                  className="w-control-md !px-0"
                >
                  {s.label === 'LinkedIn' ? (
                    <LinkedInLogo className="h-5 w-5" />
                  ) : (
                    <InstagramLogo className="h-5 w-5" />
                  )}
                  <span className="sr-only">{s.label}</span>
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
                at Alex's direction. Same TextAnimate "blurInUp" reveal the
                headline uses, `by="word"` (not per-character — at ~40
                words the bio would take several seconds to finish
                otherwise, see TextAnimate.tsx's own comment), sequenced
                with `delayMs` to start only once the headline (~1000ms)
                and the button row beside it have finished, at Alex's
                direction ("animate the text appearing for hi, I'm Alex...
                after the motion for enable creativity and the four
                buttons below... has animated in"). */}
            <p className="text-body-lg text-fg">
              <TextAnimate by="word" delayMs={1400}>{site.greeting}</TextAnimate>{' '}
              <span className="font-medium">
                <TextAnimate by="word" delayMs={1650}>{site.greetingEmphasis}</TextAnimate>
              </span>
            </p>
            <p className="mt-4 max-w-content text-body-lg text-fg-secondary">
              <TextAnimate by="word" delayMs={2200} stepMs={28}>{site.bio}</TextAnimate>
            </p>
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
        <FeaturedApp apps={apps} />

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

        {/* mt-[245px] between each of these, matching the same gap above
            Experience — at Alex's direction ("increase spacing between
            Experience, Education, Featured, and Worked with to match the
            other spacing... make the spacing consistent overall"). An
            earlier pass used a smaller mt-16 here deliberately, reading
            these four as one cluster rather than four separate topic
            changes; reversed since a single consistent rhythm throughout
            the page was the actual ask. */}
        <section className="mt-[245px]">
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

        <section className="mt-[245px]">
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

        <section className="mt-[245px] pb-12">
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
