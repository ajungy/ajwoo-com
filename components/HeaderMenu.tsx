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
 * one family, not two different systems. Color is `text-fg-tertiary` +
 * hover-to-`text-fg`, at Alex's direction — the same gray the nav's own
 * unselected Design/Coffee/Apps links use, replacing a brief flat-black/
 * flat-white pass that read as too heavy next to them.
 *
 * Bar weight is 2.1px — up from 1.6px, ~30% thicker, at Alex's direction
 * ("use a slightly thicker line weight... by say thirty percent to match
 * the thickness of the light and dark mode icon"). 1.6px was originally
 * tuned to match the theme toggle icon's own EFFECTIVE rendered stroke
 * (jolyui's sun/moon paths use `strokeWidth={2}` inside a 25-unit viewBox
 * displayed at 20px, i.e. 2 * (20/25) = 1.6px on screen, not a flat 2px)
 * — mathematically equal, but a straight-edged solid bar and a
 * round-capped stroked path don't read as equally heavy at the same
 * nominal width, so the bars still looked thinner side-by-side. 30%
 * thicker closes that gap without the earlier flat-2px pass's problem of
 * reading as heavier than its actual number.
 *
 * `-translate-y-1/2` alongside `-translate-x-1/2` on every bar (was
 * missing before this round) — `top-1/2`/`left-1/2` on an absolutely
 * positioned element place its TOP-LEFT corner at the button's center,
 * not the bar itself; without a compensating `-translate-y-1/2` each bar
 * sat centered horizontally but offset down by half its own height,
 * which is what actually read as "not properly centered vertically"
 * against the theme toggle's icon (drawn from an SVG's own natural
 * center, with no equivalent offset) at Alex's direction.
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
  const outer = 'absolute left-1/2 top-1/2 h-[2.1px] w-[18px] -translate-x-1/2 transition-transform duration-base ease-standard motion-reduce:transition-none';
  const inner = 'block h-full w-full rounded-full bg-current transition-transform duration-base ease-standard motion-reduce:transition-none';

  return (
    <button
      onClick={onToggle}
      data-cursor-label="Menu"
      className={
        'relative inline-flex h-control-md w-control-md items-center justify-center rounded-control ' +
        'border border-transparent text-fg-tertiary transition duration-fast ease-standard ' +
        'can-hover:hover:bg-tertiary-hover can-hover:hover:text-fg ' +
        'motion-safe:active:scale-press'
      }
      aria-label="Menu"
      aria-expanded={open}
    >
      {/* Top bar: translate first then rotate (opening) / un-rotate first then translate (closing).
          translate-y-[-50%]/[calc(-50%±6px)], not a bare `0`/`±6px` — see
          the `-translate-y-1/2` comment above: the -50% has to be baked
          into EVERY one of these arbitrary values (not applied once as a
          shared base) since Tailwind's translate utilities all write the
          same `--tw-translate-y` variable, so only whichever one of these
          classes is present wins outright rather than combining. */}
      <span
        aria-hidden="true"
        className={`${outer} ${open ? 'translate-y-[-50%] delay-0' : 'translate-y-[calc(-50%-6px)] delay-[180ms]'}`}
      >
        <span className={`${inner} ${open ? 'rotate-45 delay-[180ms]' : 'rotate-0 delay-0'}`} />
      </span>

      {/* Middle bar: fades out on open, back in on close — it's the line the
          other two collapse into, so it disappears the instant they arrive. */}
      <span
        aria-hidden="true"
        className={`${outer} translate-y-[-50%] transition-opacity duration-fast ease-standard ${open ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className={inner} />
      </span>

      {/* Bottom bar: mirrors the top bar. */}
      <span
        aria-hidden="true"
        className={`${outer} ${open ? 'translate-y-[-50%] delay-0' : 'translate-y-[calc(-50%+6px)] delay-[180ms]'}`}
      >
        <span className={`${inner} ${open ? '-rotate-45 delay-[180ms]' : 'rotate-0 delay-0'}`} />
      </span>
    </button>
  );
}
