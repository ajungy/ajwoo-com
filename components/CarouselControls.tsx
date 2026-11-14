export function CarouselControls({ count, index, go, setIndex, showControls = true, showIndicators = true }: {
  count: number; index: number; go: (step: -1 | 1) => void; setIndex: (index: number) => void;
  showControls?: boolean; showIndicators?: boolean;
}) {
  return (
        <div className="mt-6 flex items-center justify-center gap-4">
          {showControls && (
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              data-cursor-label="Previous"
              className={
                'inline-flex h-control-md w-control-md shrink-0 items-center justify-center ' +
                'rounded-control border border-transparent text-fg-tertiary transition ' +
                'duration-fast ease-standard can-hover:hover:bg-tertiary-hover ' +
                'can-hover:hover:text-fg motion-safe:active:scale-press'
              }
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-8 w-8">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {showIndicators && (
            <div className="flex items-center">
              {Array.from({ length: count }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-current={i === index ? "true" : undefined}
                  aria-label={`Show slide ${i + 1}`}
                  data-cursor-label={`Slide ${i + 1}`}
                  className="inline-flex h-control-md items-center justify-center rounded-control px-1"
                >
                  <span aria-hidden="true" className={
                    'h-2 rounded-full transition-all duration-base ease-standard ' +
                    (i === index ? 'w-6 bg-fg' : 'w-2 bg-fg-tertiary')
                  } />
                </button>
              ))}
            </div>
          )}

          {showControls && (
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              data-cursor-label="Next"
              className={
                'inline-flex h-control-md w-control-md shrink-0 items-center justify-center ' +
                'rounded-control border border-transparent text-fg-tertiary transition ' +
                'duration-fast ease-standard can-hover:hover:bg-tertiary-hover ' +
                'can-hover:hover:text-fg motion-safe:active:scale-press'
              }
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-8 w-8">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
  );
}
