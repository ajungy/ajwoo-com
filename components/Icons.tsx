/**
 * Shared icon components using the system's icon language: 2px stroke,
 * round caps, currentColor, 24px grid. All inherit className for sizing.
 */

export function Share({ className = 'w-5 h-5', strokeWidth = '2' }: { className?: string; strokeWidth?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

export function Menu({ className = 'w-5 h-5', strokeWidth = '2' }: { className?: string; strokeWidth?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function X({ className = 'w-5 h-5', strokeWidth = '2' }: { className?: string; strokeWidth?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/**
 * A plain diagonal arrow, not the earlier "box with a corner arrow" glyph —
 * simpler and lighter next to a one-word button label like "LinkedIn" or
 * "Instagram", at Alex's direction ("replace the linkout icons"). Same
 * name/signature as before so nothing calling it (Action.tsx) needed to
 * change.
 */
export function ExternalLink({ className = 'w-5 h-5', strokeWidth = '2' }: { className?: string; strokeWidth?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/**
 * Brand marks, at Alex's direction — first "the white version... square
 * icon", then, in a second round, "replace the icons... to the icons in
 * Figma" (figma.com/design/e6vWpcU60wsSYycYKrEmmw, node 510:2814,
 * "icon buttons"), with a reference screenshot of the exact result.
 * Paths pulled byte-for-byte via get_design_context from that node's own
 * exported SVG assets, not hand-approximated.
 *
 * LinkedIn is a SELF-CONTAINED two-color badge in the Figma source — a
 * white rounded-square background with a black "in" mark baked into the
 * same asset. A first pass reproduced that literally (fixed white/black,
 * in every theme) reasoning that a brand mark isn't theme-aware — Alex
 * caught the actual problem with that: fixed WHITE stayed white in light
 * mode too, which is illegible/invisible against this project's own
 * light-mode surfaces (a light background painted on top of the
 * secondary button's own transparent one). Reversed: the badge now
 * INVERTS with the theme via CSS `light-dark()` — white square + black
 * mark in dark mode (still pixel-identical to the Figma reference,
 * which is dark-mode only), black square + white mark in light mode —
 * same two-color badge concept Figma specifies, just correctly adapted
 * to a theme Figma's own single-mode reference never had to answer for.
 * The `border-subtle` ring stays in both themes as a hairline edge —
 * useful now that the square's own fill matches, rather than fights,
 * the button surface it sits on in either theme.
 *
 * Instagram in the same Figma node is a complete pre-built 40px button
 * (its own border + corner radius already baked into the asset) rather
 * than a bare glyph — since this project already has its own `secondary`
 * Action variant supplying that exact chrome (border, radius, hover/press
 * states, focus ring), reproducing Figma's redundant copy of the same
 * chrome inside the icon itself would fight that rather than reuse it.
 * Extracted just the glyph layer (the white camera mark) as `currentColor`
 * so it drops into the existing button the same way LinkedIn's badge
 * does, still pixel-identical to Figma's own icon artwork.
 */
export function LinkedInLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <rect
        width="20"
        height="20"
        rx="4.7"
        style={{ fill: 'light-dark(black, white)' }}
        stroke="var(--border-subtle)"
        strokeWidth="1"
      />
      <path
        d="M7.25 15H5.125V8.3125H7.25V15ZM6.1875 7.375C5.5 7.375 5 6.875 5 6.1875C5 5.5 5.5625 5 6.1875 5C6.875 5 7.375 5.5 7.375 6.1875C7.375 6.875 6.875 7.375 6.1875 7.375ZM15 15H12.875V11.375C12.875 10.3125 12.4375 10 11.8125 10C11.1875 10 10.5625 10.5 10.5625 11.4375V15H8.4375V8.3125H10.4375V9.25C10.625 8.8125 11.375 8.125 12.4375 8.125C13.625 8.125 14.875 8.8125 14.875 10.875V15H15Z"
        style={{ fill: 'light-dark(white, black)' }}
      />
    </svg>
  );
}

export function InstagramLogo({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="10 10 20 20" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20 11.8072C22.6506 11.8072 23.012 11.8072 24.0964 11.8072C25.0602 11.8072 25.5422 12.0482 25.9036 12.1687C26.3855 12.4096 26.747 12.5301 27.1084 12.8916C27.4699 13.253 27.7108 13.6145 27.8313 14.0964C27.9518 14.4578 28.0723 14.9398 28.1928 15.9036C28.1928 16.988 28.1928 17.2289 28.1928 20C28.1928 22.7711 28.1928 23.012 28.1928 24.0964C28.1928 25.0602 27.9518 25.5422 27.8313 25.9036C27.5904 26.3855 27.4699 26.747 27.1084 27.1084C26.747 27.4699 26.3855 27.7108 25.9036 27.8313C25.5422 27.9518 25.0602 28.0723 24.0964 28.1928C23.012 28.1928 22.7711 28.1928 20 28.1928C17.2289 28.1928 16.988 28.1928 15.9036 28.1928C14.9398 28.1928 14.4578 27.9518 14.0964 27.8313C13.6145 27.5904 13.253 27.4699 12.8916 27.1084C12.5301 26.747 12.2892 26.3855 12.1687 25.9036C12.0482 25.5422 11.9277 25.0602 11.8072 24.0964C11.8072 23.012 11.8072 22.7711 11.8072 20C11.8072 17.2289 11.8072 16.988 11.8072 15.9036C11.8072 14.9398 12.0482 14.4578 12.1687 14.0964C12.4096 13.6145 12.5301 13.253 12.8916 12.8916C13.253 12.5301 13.6145 12.2892 14.0964 12.1687C14.4578 12.0482 14.9398 11.9277 15.9036 11.8072C16.988 11.8072 17.3494 11.8072 20 11.8072ZM20 10C17.2289 10 16.988 10 15.9036 10C14.8193 10 14.0964 10.241 13.494 10.4819C12.8916 10.7229 12.2892 11.0843 11.6867 11.6867C11.0843 12.2892 10.8434 12.7711 10.4819 13.494C10.241 14.0964 10.1205 14.8193 10 15.9036C10 16.988 10 17.3494 10 20C10 22.7711 10 23.012 10 24.0964C10 25.1807 10.241 25.9036 10.4819 26.506C10.7229 27.1084 11.0843 27.7108 11.6867 28.3133C12.2892 28.9157 12.7711 29.1566 13.494 29.5181C14.0964 29.759 14.8193 29.8795 15.9036 30C16.988 30 17.3494 30 20 30C22.6506 30 23.012 30 24.0964 30C25.1807 30 25.9036 29.759 26.506 29.5181C27.1084 29.2771 27.7108 28.9157 28.3133 28.3133C28.9157 27.7108 29.1566 27.2289 29.5181 26.506C29.759 25.9036 29.8795 25.1807 30 24.0964C30 23.012 30 22.6506 30 20C30 17.3494 30 16.988 30 15.9036C30 14.8193 29.759 14.0964 29.5181 13.494C29.2771 12.8916 28.9157 12.2892 28.3133 11.6867C27.7108 11.0843 27.2289 10.8434 26.506 10.4819C25.9036 10.241 25.1807 10.1205 24.0964 10C23.012 10 22.7711 10 20 10Z" />
      <path d="M20 14.8193C17.1084 14.8193 14.8193 17.1084 14.8193 20C14.8193 22.8916 17.1084 25.1807 20 25.1807C22.8916 25.1807 25.1807 22.8916 25.1807 20C25.1807 17.1084 22.8916 14.8193 20 14.8193ZM20 23.3735C18.1928 23.3735 16.6265 21.9277 16.6265 20C16.6265 18.1928 18.0723 16.6265 20 16.6265C21.8072 16.6265 23.3735 18.0723 23.3735 20C23.3735 21.8072 21.8072 23.3735 20 23.3735Z" />
      <path d="M25.3012 15.9036C25.9666 15.9036 26.506 15.3642 26.506 14.6988C26.506 14.0334 25.9666 13.494 25.3012 13.494C24.6358 13.494 24.0964 14.0334 24.0964 14.6988C24.0964 15.3642 24.6358 15.9036 25.3012 15.9036Z" />
    </svg>
  );
}

export function CheckCircle({ className = 'w-5 h-5', strokeWidth = '2' }: { className?: string; strokeWidth?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
