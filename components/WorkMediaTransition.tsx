// Static-image projects keep the browser's cross-document transition.
export function WorkMediaTransition() {
  return <style>{`
    @keyframes coffee-thumbnail-corners {
      from { clip-path: inset(0 round 0px); }
      to { clip-path: inset(0 round 8px); }
    }
    @media (prefers-reduced-motion: no-preference) {
      @view-transition { navigation: auto; }
      ::view-transition-group(work-project-media),
      ::view-transition-group(coffee-review-media) {
        animation-duration: 300ms;
        animation-timing-function: var(--e-media-transition, ease-in-out);
      }
      /* Keep the same photo visible as its corners round on arrival. */
      ::view-transition-old(coffee-review-media):not(:only-child) {
        height: 100%;
        animation: coffee-thumbnail-corners 300ms var(--e-media-transition, ease-in-out) both;
        mix-blend-mode: normal;
      }
      ::view-transition-new(coffee-review-media):not(:only-child) {
        opacity: 0;
        animation: none;
      }
      ::view-transition-group(root) { animation-duration: 500ms; }
    }
  `}</style>;
}
