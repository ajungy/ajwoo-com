import type { NetflixPayload } from '@/lib/netflix/types';

export function NetflixMuseExample({ examples: netflixPublicExamples }: Pick<NetflixPayload, 'examples'>) {
  const example = netflixPublicExamples[0];
  return (
    <figure className="mt-8 max-w-content">
      <p className="text-body text-fg-secondary">{example.description}</p>
      <picture className="mt-6 block">
        <source srcSet={example.src} type="image/webp" />
        <img src={example.fallback} alt={example.alt} width={example.width} height={example.height}
          loading="lazy" decoding="async" className="block h-auto w-full" />
      </picture>
      <figcaption className="mt-6 text-body text-fg-secondary">
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
    <section className="mt-12 scroll-mt-[88px]" aria-labelledby="netflix-public-examples">
      <div className="max-w-content">
        <h2 id="netflix-public-examples" className="text-title text-fg">Related public examples</h2>
        <p className="mt-6 text-body text-fg-secondary">
          Published examples from Netflix’s teams, shared as context for the creative tools ecosystem.
          These are not presented as my individual design deliverables.
        </p>
      </div>
      <div className="mt-9 space-y-12">
        {netflixPublicExamples.slice(1).map((example) => (
          <figure key={example.title} className="max-w-content">
            <div className="mb-6 max-w-content">
              <h3 className="text-title text-fg">{example.title}</h3>
              <p className="mt-4 text-body text-fg-secondary">{example.description}</p>
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
            <figcaption className="mt-6 max-w-content text-body text-fg-secondary">
              <p>Related example / Source: {example.credit}</p>
              <a href={example.sourceHref} target="_blank" rel="noopener noreferrer"
                aria-label={`${example.kind === 'embed' ? 'Watch on YouTube' : 'Public image / source article'}: ${example.title}`}
                className="mt-3 inline-block text-fg underline underline-offset-4 can-hover:hover:text-fg-secondary">
                {example.kind === 'embed' ? 'Watch on YouTube ↗' : 'Public image / source article ↗'}
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
