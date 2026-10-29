import { WorkProjectActions } from '@/components/WorkProjectActions';
import { ExternalLink } from '@/components/Icons';
import type { NetflixPayload } from '@/lib/netflix/types';
import { type Project } from '@/content/projects';
import { NetflixMuseExample, NetflixPublicExamples } from './NetflixPublicExamples';

export function NetflixProject({ project, work: netflixWork, examples }: { project: Project } & NetflixPayload) {

  return (
    <>
      <div className="mx-auto max-w-app px-page">
        <header className="pt-12 pb-12">
          <h1 className="text-h1 text-fg">{project.title}</h1>
          <p className="mt-4 text-body text-fg-secondary">{project.category} - {netflixWork.years}</p>
        </header>

        <article className="pb-12">
          <div className="mb-12 max-w-content">
            <video autoPlay loop muted playsInline preload="auto"
              poster="/img/netflix-creative-tools-intro-poster.webp?v=43e413deb0"
              width={1918} height={1080}
              aria-label="Netflix creative tools video example"
              className="block h-auto w-full">
              <source src="/img/netflix-creative-tools-intro.mp4?v=43e413deb0" type="video/mp4" />
            </video>
          </div>
          <section className="max-w-content" aria-labelledby="netflix-overview">
            <h2 id="netflix-overview" className="text-title text-fg">{netflixWork.introduction}</h2>
            <p className="mt-6 text-body text-fg-secondary">{netflixWork.overview}</p>
          </section>

          <section className="mt-12 max-w-content" aria-labelledby="netflix-contribution">
            <h2 id="netflix-contribution" className="text-title text-fg">My scope</h2>
            <p className="mt-6 text-body text-fg">{netflixWork.contribution}</p>
            <p className="mt-6 text-body text-fg-secondary">{netflixWork.distribution}</p>
            <dl className="mt-9 space-y-12">
              {netflixWork.areas.map((area) => (
                <div key={area.title}>
                  <dt className="text-title text-fg">{area.title}</dt>
                  <dd className="mt-4 text-body text-fg-secondary">
                    <p>{area.description}</p>
                    {area.title === 'Analytics' && <NetflixMuseExample examples={examples} />}
                    {area.image && (
                      <figure className="mt-8">
                        <img src={area.image.src} alt={area.image.alt} width={1465} height={833}
                          loading="lazy" decoding="async" className="block h-auto w-full" />
                        <figcaption className="mt-4 text-body text-fg-secondary">
                          Public Netflix member experience / Annotated example of where {area.title.split(' / ')[0].toLowerCase()} appears / October 14, 2026
                        </figcaption>
                      </figure>
                    )}
                    {area.title === 'Video' && (
                      <div className="mt-12 grid max-w-content grid-cols-2 gap-6">
            <figure>
              <video autoPlay loop muted playsInline preload="metadata"
                poster="/img/netflix-wednesday-marketing-poster.webp"
                width={552} height={1200}
                aria-label="Wednesday vertical marketing video example"
                className="block aspect-[1465/1666] h-auto w-full object-contain">
                <source src="/img/netflix-wednesday-marketing-hdr.mp4" type='video/mp4; codecs="hvc1"' media="(dynamic-range: high)" />
                <source src="/img/netflix-wednesday-marketing.mp4?v=sdr2" type="video/mp4" />
              </video>
              <figcaption className="mt-6 text-body text-fg-secondary">
                Wednesday / Marketing channel example: vertical video for Instagram Reels.
              </figcaption>
            </figure>
            <figure>
              <video autoPlay loop muted playsInline preload="metadata"
                poster="/img/netflix-onepiece-clips-poster.webp"
                width={552} height={1200}
                aria-label="ONE PIECE Netflix Clips mobile video example"
                className="block aspect-[1465/1666] h-auto w-full object-contain">
                <source src="/img/netflix-onepiece-clips-hdr.mp4" type='video/mp4; codecs="hvc1"' media="(dynamic-range: high)" />
                <source src="/img/netflix-onepiece-clips.mp4?v=sdr2" type="video/mp4" />
              </video>
              <figcaption className="mt-6 text-body text-fg-secondary">
                ONE PIECE / Netflix member experience: subtitled vertical video for Netflix Clips.
              </figcaption>
            </figure>
          </div>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12 max-w-content" aria-labelledby="netflix-challenge">
            <h2 id="netflix-challenge" className="text-title text-fg">The challenge / Creative complexity at scale</h2>
            <p className="mt-6 text-body text-fg-secondary">{netflixWork.challenge}</p>
            <p className="mt-6 text-body text-fg-secondary">{netflixWork.impactContext}</p>
          </section>

          <NetflixPublicExamples examples={examples} />

          <section className="mt-12 max-w-content" aria-labelledby="netflix-links">
            <h2 id="netflix-links" className="text-title text-fg">Links related to this project</h2>
            <p className="mt-6 text-body text-fg-secondary">
              Public writing and resources about Netflix’s creative tools and technology.
              These span several teams and years and provide context for the work described above.
            </p>
            <ul className="mt-6">
              {netflixWork.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer"
                    data-cursor-label="Read public resource"
                    className="-mx-6 block rounded-lg px-6 py-7 transition-colors duration-fast ease-standard can-hover:hover:bg-hover">
                    <p className="text-body text-fg-secondary">{link.source}</p>
                    <h3 className="mt-3 flex items-start justify-between gap-6 text-title text-fg">
                      <span className="underline decoration-line underline-offset-4">{link.title}</span>
                      <ExternalLink className="mt-1 h-7 w-7 shrink-0" />
                    </h3>
                    <p className="mt-4 text-body text-fg-secondary">{link.description}</p>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <WorkProjectActions />
        </article>


      </div>
    </>
  );
}
