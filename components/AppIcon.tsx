/**
 * App marks. Drawn in the system's icon language — 1.5px stroke, round caps,
 * currentColor, 24px grid (reference/icons-and-illustrations.md) — and set in a
 * rounded-square tile, which is the shape every desktop platform uses for an
 * app icon.
 *
 * These are placeholders I drew, not Alex's shipped app icons. Swap the glyph
 * for the real artwork when it exists; nothing else needs to change.
 */
const glyphs: Record<string, React.ReactNode> = {
  // Capture — a screen with a recording dot.
  capture: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8" />
      <circle cx="12" cy="11" r="2.5" />
    </>
  ),
  // Dictate — a microphone: speech going in.
  dictate: (
    <>
      <rect x="9" y="3" width="6" height="10" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21" />
    </>
  ),
  // Narrate — lines of text with sound coming off them: speech going out.
  narrate: (
    <>
      <path d="M3 6h10M3 10h10M3 14h6" />
      <path d="M17 8a4 4 0 0 1 0 8" />
      <path d="M20 5.5a7.5 7.5 0 0 1 0 13" />
    </>
  ),
};

export function AppIcon({ name, className = 'h-7 w-7' }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {glyphs[name] ?? null}
    </svg>
  );
}

export function AppIconTile({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-16 w-16 rounded-xl' : 'h-12 w-12 rounded-lg';
  const glyph = size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center border border-line-subtle bg-sunken text-fg ${box}`}
    >
      <AppIcon name={name} className={glyph} />
    </span>
  );
}
