import { CopySkillButton } from './CopySkillButton';
import { EmailMeLink } from './EmailMeLink';
import { StaggerReveal } from './StaggerReveal';
import { TextAnimate } from './TextAnimate';

/**
 * "Try Alex's SKILL.md", the code/AI counterpart to the laurel-bracketed
 * "Alex's choice" badge on this same page. Leaves don't make sense as the
 * ornament here (this isn't a favorite, it's a tool), so the brackets are
 * angle brackets, `< >` in mono, the same visual grammar a real tag or a
 * template placeholder uses, flanking the label instead of laurels.
 *
 * No bounding border, at Alex's direction: no card, just type and space,
 * matching the rest of the page. mt-[245px], no pb: every major section on
 * this page is spaced from the next by that same 245px (144px increased
 * ~70%, at Alex's direction), so the gap language stays consistent
 * (Principle 10 in the sidebar above: spacing is a language).
 *
 * "Download SKILL.md" downloads the actual file this whole site is built
 * from (public/minimal-design-system.md), not a summary of it: a visitor
 * can drop it straight into their own AI coding tool. Secondary button, at
 * Alex's direction; "Book 20 minutes" stays the only primary on this page.
 *
 * No "Skills" section heading: the callout's own "Try Alex's SKILL.md"
 * already says what this is, so a heading directly above it restating
 * "Skills" was pure redundancy, at Alex's direction.
 *
 * One combined paragraph rather than a separate description-and-CTA pair —
 * the file's purpose and the offer to reach out are still one thought, just
 * broken onto its own line at Alex's direction, and "Email me" now copies
 * the address to the clipboard (EmailMeLink.tsx) rather than opening a
 * mailto: link, matching the top-of-page Email button's behavior.
 *
 * Motion, at Alex's direction ("add the... blur fade in [heading]
 * animation effect for Try Alex's SKILL.md, with the bigger/smaller
 * symbols, and the faster fade-up effect... for body text... play the
 * consistent animation"), matching the exact same two-effect pattern
 * every other section on this page now uses (Experience, Education,
 * Featured, Favorite design principles): the heading gets TextAnimate's
 * scroll-triggered "blurInUp" reveal, the text below it gets
 * StaggerReveal's faster fade-and-rise. The heading here is three
 * separately-styled pieces — the `<`/`>` brackets at text-h1, the label
 * at text-title — not one plain string, so each gets its OWN TextAnimate
 * instance (same rootMargin/delayMs, so they read as one reveal) rather
 * than trying to force mismatched sizes through a single call.
 * `delayMs={1496}` on the body: 500 (the heading's own delay) + 18*22
 * (SKILL.md's own per-character stagger, the longest of the three
 * pieces) + 600 (that character's animation length) = 1496 — no extra
 * buffer on top, at Alex's direction ("make the text appear sooner, as
 * soon as the blur effect title and subtitle finished appearing"); a
 * previous round's explicit 100ms gap is dropped here.
 */
export function SkillsSection() {
  return (
    <section className="mt-[245px]">
      <div className="flex flex-col items-center px-9 text-center">
        <div className="flex items-center gap-3 text-fg-tertiary">
          <span aria-hidden="true" className="font-mono text-h1 font-bold text-fg">
            <TextAnimate trigger="scroll" rootMargin="-80% 0px 0px 0px" delayMs={500}>{'<'}</TextAnimate>
          </span>
          <p className="text-title font-bold text-fg whitespace-nowrap">
            <TextAnimate trigger="scroll" rootMargin="-80% 0px 0px 0px" delayMs={500}>{"Try Alex's SKILL.md"}</TextAnimate>
          </p>
          <span aria-hidden="true" className="font-mono text-h1 font-bold text-fg">
            <TextAnimate trigger="scroll" rootMargin="-80% 0px 0px 0px" delayMs={500}>{'>'}</TextAnimate>
          </span>
        </div>
        <StaggerReveal
          className="mt-4 flex flex-col items-center gap-8"
          rootMargin="-80% 0px 0px 0px"
          delayMs={1496}
          durationMs={400}
        >
          <p className="max-w-content text-body text-fg-secondary">
            The single file this site and several apps are built from, every
            rule in one drop.
            <br />
            Want more? <EmailMeLink />.
          </p>
          <CopySkillButton />
        </StaggerReveal>
      </div>
    </section>
  );
}
