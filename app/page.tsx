import { workOpeningMedia } from '@/content/work-opening-media';
import { WorkMediaTransition } from '@/components/WorkMediaTransition';
import { LandingSections } from '@/components/LandingSections';
import { CoverflowCarousel } from '@/components/ui/coverflow-carousel';
import { workGallery } from '@/content/work-gallery';
import { pageMetadata } from '@/lib/metadata';
import { Action } from '@/components/Action';
import { LinkedInLogo, InstagramLogo } from '@/components/Icons';
import { BookTimeAction } from '@/components/BookTimeAction';
import { HeroHeadline } from '@/components/HeroHeadline';
import { FeaturedApp } from '@/components/FeaturedApp';
import { CopyEmailButton } from '@/components/CopyEmailButton';
import { DesignPrinciples } from '@/components/DesignPrinciples';
import { SkillsSection } from '@/components/SkillsSection';
import { StaggerReveal } from '@/components/StaggerReveal';
import { TextAnimate } from '@/components/TextAnimate';
import { site, experience, education, clients, featured, social } from '@/content/site';
import { apps } from '@/content/apps';

export const metadata = {
  ...pageMetadata('/', 'Alex Woo'),
  title: { absolute: 'Alex Woo' },
};

/**
 * The job: a visitor deciding whether Alex is worth their time reaches that
 * decision inside one scroll, and acts on it in one click.
 */
export default function Home() {
  return (
    <>
      <div className="mx-auto max-w-app px-[16px] large:px-page">
        <section className="grid grid-cols-1 pt-20 large:grid-cols-4">
          <div className="hero-col landing-reading-column">
            {/* Reveal the complete headline after its display font is ready. */}
            <HeroHeadline>{site.headline}</HeroHeadline>

            <StaggerReveal className="mt-8" durationMs={450}>
              <p className="max-w-content type-subtitle">
                {site.greeting} {site.greetingEmphasis} {site.bio}
              </p>
            </StaggerReveal>

            <StaggerReveal className="hero-actions mt-8 flex flex-wrap items-center gap-4" delayMs={450} durationMs={450}>
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
                  {/* h-7 w-7 (was h-5 w-5), at Alex's direction ("make the
                      linkedin and instagram logo bigger inside the button
                      but still keep the same size for the button") — the
                      outer button stays w-control-md/h-control-md (40px)
                      regardless; only the glyph inside grows. */}
                  {s.label === 'LinkedIn' ? (
                    <LinkedInLogo className="h-7 w-7" />
                  ) : (
                    <InstagramLogo className="h-7 w-7" />
                  )}
                  <span className="sr-only">{s.label}</span>
                </Action>
              ))}
            </StaggerReveal>
          </div>
        </section>
      </div>

      <LandingSections>
        <section className="pt-[140px] pb-[160px] text-center" id="home-work-title">
          <WorkMediaTransition />
          <CoverflowCarousel slides={['netflix-creative-tools', 'premiere-generative-ai', 'pr-ae-frame', 'product-visualize', 'seeing-ai'].flatMap(slug => {
            const project = workGallery.find(item => item.href === `/work/${slug}/`);
            if (!project) return [];
            const { image, title, href } = project;
            const { video } = workOpeningMedia(slug);
            return [{ src: `/img/${image.base}.webp`, title, href, video }];
          })} />
        </section>
        <div className="mx-auto max-w-app px-page">
          <SkillsSection />
          <FeaturedApp apps={['convert', 'capture', 'dictate', 'narrate', 'letter'].flatMap(
            (slug) => apps.filter((app) => app.slug === slug)
          )} />

          <DesignPrinciples />

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
          {/* Experience/Education/Featured/Worked-with render as plain static
              text, at Alex's direction ("remove the animations of text effects
              in the landing page") — the scroll-triggered TextAnimate headings
              and StaggerReveal lists they used to have are gone. */}
          <section className="mt-[160px]">
            <div className="grid grid-cols-1 large:grid-cols-4">
              <div className="landing-reading-column">
                <h2 className="type-section-heading">
                  Experience
                </h2>
                {/* "Experience" = 10 chars: 500 + 9*22 + 600 = 1298ms. */}
                <div className="mt-6 flex flex-col gap-6">
                  {experience.map((x) => (
                    <p key={x.company} className="type-body">
                      <span className="font-medium text-fg">{x.company}</span>
                      <span className="text-fg-secondary">, {x.title}, {x.years}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* mt-[160px] between each of these, matching the same gap above
              Experience — at Alex's direction ("increase spacing between
              Experience, Education, Featured, and Worked with to match the
              other spacing... make the spacing consistent overall"). An
              earlier pass used a smaller mt-16 here deliberately, reading
              these four as one cluster rather than four separate topic
              changes; reversed since a single consistent rhythm throughout
              the page was the actual ask. */}
          <section className="mt-[160px]">
            <div className="grid grid-cols-1 large:grid-cols-4">
              <div className="landing-reading-column">
                <h2 className="type-section-heading">
                  Education
                </h2>
                {/* "Education" = 9 chars: 500 + 8*22 + 600 = 1276ms. */}
                <div className="mt-6 flex flex-col gap-6">
                  {education.map((e) => (
                    <p key={e.school} className="type-body">
                      <span className="font-medium text-fg">{e.school}</span>
                      <span className="text-fg-secondary">, {e.detail}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-[160px]">
            <div className="grid grid-cols-1 large:grid-cols-4">
              <div className="landing-reading-column">
                <h2 className="type-section-heading">
                  Featured
                </h2>
                {/* "Featured" = 8 chars: 500 + 7*22 + 600 = 1254ms. */}
                <div className="mt-6 flex flex-col gap-6">
                  {featured.map((f) => (
                    <p key={`${f.year}-${f.what}`} className="type-body">
                      <span className="text-fg-tertiary">{f.year}</span>
                      <span className="text-fg-secondary">, {f.what}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-[160px] pb-12">
            <div className="grid grid-cols-1 large:grid-cols-4">
              <div className="landing-reading-column">
                {/* Label changed from "Clients" to "Worked with", at Alex's
                    direction — the underlying data (content/site.ts's
                    `clients` export) is unchanged, only what the heading
                    calls it. Already one name per row, nothing to
                    comma-join. */}
                <h2 className="type-section-heading">
                  Worked with
                </h2>
                {/* "Worked with" = 11 chars: 500 + 10*22 + 600 = 1320ms.
                    Worked-with now gets the exact same delayMs={500}/
                    sequenced-delay/durationMs treatment the other three
                    sections already had — at
                    Alex's direction ("make sure Worked with Kikkerland
                    Design follows the motion patterns and timing of the
                    other subtitle and body animations... so that we have a
                    system for all"). Previously the only section left out,
                    from an earlier round that named just Experience/
                    Education/Featured. */}
                <div className="mt-6 flex flex-col gap-6">
                  {clients.map((c) => (
                    <p key={c} className="type-body">{c}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </LandingSections>
    </>
  );
}
