import type { NetflixPayload } from '@/lib/netflix/types';

export function NetflixMuseExample({ examples: netflixPublicExamples }: Pick<NetflixPayload, 'examples'>) {
  const example = netflixPublicExamples[0];
  return (
    <figure className="mt-8 max-w-content">
      <p className="type-body">{example.description}</p>
      <picture className="mt-6 block">
        <source srcSet={example.src} type="image/webp" />
        <img src={example.fallback} alt={example.alt} width={example.width} height={example.height}
          loading="lazy" decoding="async" className="block h-auto w-full" />
      </picture>
      <figcaption className="mt-4 type-caption">
        <p>Related example / Source: {example.credit}</p>
        <a href={example.sourceHref} target="_blank" rel="noopener noreferrer"
          aria-label={`Public image / source article: ${example.title}`}
          className="mt-3 inline-block text-fg underline underline-offset-4 can-hover:hover:text-fg-secondary">
          Public image / source article ↗
        </a>
      </figcaption>
    </figure>
  );
}

export function NetflixPublicExamples({ examples: netflixPublicExamples }: Pick<NetflixPayload, 'examples'>) {
  return (
    <section className="mt-9 scroll-mt-[88px]" aria-label="Public creative tools examples">
      <div className="space-y-9">
        {netflixPublicExamples.slice(1).map((example) => (
          <figure key={example.title} className="max-w-content">
            <div className="mb-6 max-w-content">
              <h3 className="type-decision">{example.title}</h3>
              <p className="mt-4 type-body">{example.description}</p>
            </div>
            {example.kind === 'embed' ? (
              <div className="overflow-hidden rounded-lg border border-line-subtle bg-sunken">
                <iframe src={example.src} title={example.videoTitle} loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen className="aspect-video w-full" />
              </div>
            ) : (
            <picture>
              <source srcSet={example.src} type="image/webp" />
              <img src={example.fallback} alt={example.alt} width={example.width} height={example.height}
                loading="lazy" decoding="async" className="block h-auto w-full" />
            </picture>
            )}
            <figcaption className="mt-4 max-w-content type-caption">
              <p>Related example / Source: {example.credit}</p>
              {example.kind !== 'embed' && (
              <a href={example.sourceHref} target="_blank" rel="noopener noreferrer"
                aria-label={`Public image / source article: ${example.title}`}
                className="mt-3 inline-block text-fg underline underline-offset-4 can-hover:hover:text-fg-secondary">
                Public image / source article ↗
              </a>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
