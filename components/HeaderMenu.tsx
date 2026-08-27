'use client';

/**
 * The compact hamburger toggle. Controlled from TopBar rather than owning its
 * own open state: the expanded content isn't a popover anchored to this
 * button, it's a second row that pushes the header itself taller (see
 * TopBar.tsx) — Alex asked for the bar to visibly extend downward on tap
 * rather than a menu floating over the page, so the open/closed state has to
 * live at the level that controls the header's own height.
 *
 * Button chrome matches ThemeToggle.tsx exactly — same `h/w-control-md` hit
 * area, same `rounded-control` + transparent border + `bg-tertiary-hover` on
 * hover — so the two icon buttons in the compact top-right cluster read as
 * one family, not two different systems. Color is the same flat black
 * (light mode) / white (dark mode) pair as `.theme-icon-flat`
 * (ThemeToggle.tsx / globals.css), at Alex's direction, rather than the
 * text-fg-secondary/hover-to-text-fg token pair the rest of the chrome
 * uses — reused directly rather than a second copy of the same rule.
 *
 * Bar weight is 2px, up from 1.5px, at Alex's direction, to match the
 * theme toggle icon's own strokeWidth={2} (jolyui's sun/moon paths,
 * ThemeToggle.tsx) and the visual weight of the Logo monogram (Logo.tsx)
 * next to it — the logo is a filled glyph, not a literal stroke, but its
 * letterforms read at roughly this weight, and 1.5px looked thin beside
 * both once they were compared directly.
 *
 * Three bars, drawn and animated directly (not a Menu/X icon swap), as a
 * genuine two-phase morph rather than everything moving at once: opening,
 * the top/bottom bars first slide to the middle bar's position (collapsing
 * into one line), then rotate into an X once they arrive; closing reverses
 * that order — un-rotate first, then slide back apart. Each bar is two
 * nested spans so translate and rotate can carry independent transitions
 * (one delayed, one not) instead of interpolating together as a single
 * `transform`.
 */
export function HeaderMenu({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const outer = 'absolute left-1/2 top-1/2 h-[2px] w-[18px] -translate-x-1/2 transition-transform duration-base ease-standard motion-reduce:transition-none';
  const inner = 'block h-full w-full rounded-full bg-current transition-transform duration-base ease-standard motion-reduce:transition-none';

  return (
    <button
      onClick={onToggle}
      data-cursor-label="Menu"
      className={
        'theme-icon-flat relative inline-flex h-control-md w-control-md items-center justify-center rounded-control ' +
        'border border-transparent transition duration-fast ease-standard ' +
        'can-hover:hover:bg-tertiary-hover ' +
        'motion-safe:active:scale-press'
      }
      aria-label="Menu"
      aria-expanded={open}
    >
      {/* Top bar: translate first then rotate (opening) / un-rotate first then translate (closing). */}
      <span
        aria-hidden="true"
        className={`${outer} ${open ? 'translate-y-0 delay-0' : '-translate-y-[6px] delay-[180ms]'}`}
      >
        <span className={`${inner} ${open ? 'rotate-45 delay-[180ms]' : 'rotate-0 delay-0'}`} />
      </span>

      {/* Middle bar: fades out on open, back in on close — it's the line the
          other two collapse into, so it disappears the instant they arrive. */}
      <span
        aria-hidden="true"
        className={`${outer} translate-y-0 transition-opacity duration-fast ease-standard ${open ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className={inner} />
      </span>

      {/* Bottom bar: mirrors the top bar. */}
      <span
        aria-hidden="true"
        className={`${outer} ${open ? 'translate-y-0 delay-0' : 'translate-y-[6px] delay-[180ms]'}`}
      >
        <span className={`${inner} ${open ? '-rotate-45 delay-[180ms]' : 'rotate-0 delay-0'}`} />
      </span>
    </button>
  );
}
