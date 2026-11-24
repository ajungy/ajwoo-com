// Static-image projects keep the browser's cross-document transition.
export function WorkMediaTransition() {
  return <style>{`
    @media (prefers-reduced-motion: no-preference) {
      @view-transition { navigation: auto; }
      ::view-transition-group(work-project-media) {
        animation-duration: 500ms;
        animation-timing-function: var(--e-standard, ease-in-out);
      }
      ::view-transition-group(root) { animation-duration: 500ms; }
    }
  `}</style>;
}
