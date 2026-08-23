/**
 * Laurel branch — the only ornament on the site, used once, to mark the one
 * featured app. Filled leaves rather than outlined: at 56px an outlined leaf
 * collapses into a squiggle, and the system's 1.5px stroke is meant for icons
 * at 16–24px, not for foliage.
 *
 * Path data pulled from Alex's Figma reference (Vibe-code-components, node
 * 300:253). Same five leaf shapes as the earlier version, PLUS a sixth path
 * — "Vector 1 (Stroke)", a thin curved stem running through the leaf cluster
 * — that the earlier pull was missing. That stem is what was meant by "the
 * left icons are different": without it the leaves read as a loose scatter;
 * with it they read as a single branch. viewBox is the source's native
 * 21.4996×38.6276 (smaller and slightly differently proportioned than the
 * 26.0262×59.6279 version this replaces).
 *
 * Both sides share one piece of artwork. Figma's own left copy is built via
 * `scaleY(-1) rotate(180deg)` on the identical path data used for the right
 * side — composing those two (scale applies first, then rotate, per CSS
 * transform-function order) nets out to a plain horizontal mirror, which is
 * exactly what `flip` already does here via `scaleX(-1)`.
 */
export function Laurel({ flip = false, className = 'h-14 w-auto' }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 21.4996 38.6276"
      fill="none"
      aria-hidden="true"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <g fill="currentColor">
        <path d="M9.90107 28.8018C13.5984 27.8111 17.3426 28.2709 20.5299 29.832C18.5502 32.7778 15.538 35.0487 11.8404 36.0394C8.14277 37.0302 4.39871 36.5696 1.21134 35.0083C3.19105 32.0628 6.2037 29.7925 9.90107 28.8018Z" />
        <path d="M10.7216 20.8116C13.5395 19.1848 16.7142 18.7413 19.6748 19.3209C18.6965 22.175 16.7258 24.703 13.9077 26.3301C11.0892 27.9574 7.91357 28.401 4.95237 27.8209C5.93069 24.9667 7.90333 22.4387 10.7216 20.8116Z" />
        <path d="M9.01328 14.2463C10.908 12.3516 13.3392 11.3228 15.8178 11.1527C15.6478 13.6314 14.619 16.0625 12.7242 17.9572C10.8293 19.852 8.39845 20.881 5.91969 21.0508C6.08959 18.5721 7.11855 16.1412 9.01328 14.2463Z" />
        <path d="M6.37331 9.00154C7.52179 7.01231 9.30636 5.62041 11.321 4.92989C11.7303 7.01991 11.4172 9.26129 10.2687 11.2505C9.12009 13.2398 7.33579 14.6318 5.321 15.3222C4.91154 13.2322 5.22488 10.9909 6.37331 9.00154Z" />
        <path d="M3.47426 4.8268C3.96941 2.97888 5.1049 1.47464 6.57682 0.484781C7.35673 2.07805 7.58882 3.94857 7.09365 5.79661C6.5984 7.6449 5.46224 9.14947 3.98989 10.1393C3.20986 8.54598 2.97904 6.67497 3.47426 4.8268Z" />
        <path d="M5.43596 8.14844C5.24193 7.63169 4.66576 7.36982 4.14885 7.56348C3.63173 7.7574 3.369 8.33445 3.56292 8.85157C4.51051 11.3786 5.42056 16.1428 5.20061 21.3076C4.98053 26.475 3.6373 31.8868 0.24065 35.8496C-0.118593 36.2689 -0.0700779 36.8994 0.349048 37.2588C0.768374 37.6182 1.39978 37.5697 1.7592 37.1504C5.56228 32.7132 6.96873 26.7917 7.19866 21.3926C7.42869 15.9909 6.48833 10.9548 5.43596 8.14844Z" />
      </g>
    </svg>
  );
}
