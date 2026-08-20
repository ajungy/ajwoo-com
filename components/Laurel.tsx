/**
 * Laurel branch — the only ornament on the site, used once, to mark the one
 * featured app. Filled leaves rather than outlined: at 56px an outlined leaf
 * collapses into a squiggle, and the system's 1.5px stroke is meant for icons
 * at 16–24px, not for foliage.
 */
export function Laurel({ flip = false, className = 'h-14 w-auto' }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 96"
      fill="none"
      aria-hidden="true"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      {/* stem, curving in toward the title */}
      <path
        d="M31 6C18 26 12 52 15 90"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* leaves down the outer edge, shrinking toward the tip */}
      <g fill="currentColor">
        <ellipse cx="21" cy="19" rx="9" ry="4.4" transform="rotate(-38 21 19)" />
        <ellipse cx="17" cy="33" rx="10" ry="4.8" transform="rotate(-28 17 33)" />
        <ellipse cx="14" cy="48" rx="10.5" ry="5" transform="rotate(-16 14 48)" />
        <ellipse cx="13" cy="63" rx="10" ry="4.8" transform="rotate(-6 13 63)" />
        <ellipse cx="14" cy="78" rx="8.5" ry="4.2" transform="rotate(4 14 78)" />
      </g>
      {/* two inner leaves so the branch has depth rather than reading as a comb */}
      <g fill="currentColor" opacity="0.55">
        <ellipse cx="27" cy="27" rx="7" ry="3.4" transform="rotate(-52 27 27)" />
        <ellipse cx="23" cy="43" rx="7.5" ry="3.6" transform="rotate(-40 23 43)" />
      </g>
    </svg>
  );
}
