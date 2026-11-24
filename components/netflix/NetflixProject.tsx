import { WorkMediaTransition } from '@/components/WorkMediaTransition';
import { workOpeningMedia } from '@/content/work-opening-media';
import { WorkProjectActions } from '@/components/WorkProjectActions';
import { ProjectLinks } from '@/components/ProjectLinks';
import type { NetflixPayload } from '@/lib/netflix/types';
import { type Project } from '@/content/projects';
import { NetflixMuseExample, NetflixPublicExamples } from './NetflixPublicExamples';

export function NetflixProject({ project, work: netflixWork, examples }: { project: Project } & NetflixPayload) {

  const hero = workOpeningMedia(project.slug).video!;
  return (
    <>
      <WorkMediaTransition />
      <div className="portfolio-media work-reading-column">
        <header className="pt-12 pb-12">
          <h1 className="type-project-title">{project.title}</h1>
          <p className="mt-4 type-caption">{project.category} - {netflixWork.years}</p>
        </header>

        <article>
          <div className="detail-hero-media mb-[var(--section-gap)]" style={{ viewTransitionName: 'work-project-media' }}>
            <video autoPlay loop muted playsInline preload="auto"
              poster={`/img/${hero.base}-poster.webp`}
              width={hero.width} height={hero.height}
              aria-label={hero.label}
              className="block h-auto w-full">
              <source src={`/img/${hero.base}.mp4`} type="video/mp4" />
            </video>
          </div>
          <section className="max-w-content" aria-labelledby="netflix-overview">
            <h2 id="netflix-overview" className="type-section-heading">{project.lead}</h2>
            <p className="mt-4 type-body">{netflixWork.overview}</p>
          </section>

          <section className="mt-[var(--section-gap)] max-w-content" aria-labelledby="netflix-contribution">
            <h2 id="netflix-contribution" className="type-decision">My scope</h2>
            <p className="mt-4 type-body">{netflixWork.contribution}</p>
            <p className="mt-6 type-body">{netflixWork.distribution}</p>
            <dl className="mt-[var(--section-gap)] space-y-[var(--section-gap)]">
              {netflixWork.areas.map((area) => (
                <div key={area.title}>
                  <dt className="type-decision">{area.title}</dt>
                  <dd className="mt-4 type-body">
                    <p>{area.description}</p>
                    {area.title === 'Analytics' && <NetflixMuseExample examples={examples} />}
                    {area.title === 'Video' ? (
                      <figure className="mt-8">
                        <video autoPlay loop muted playsInline preload="metadata"
                          src="/img/netflix-video-workflow.mp4" poster="/img/netflix-video-workflow-poster.webp"
                          width={1792} height={822} aria-label="Stranger Things featured video on Netflix, 2026"
                          className="block h-auto w-full" />
                        <figcaption className="mt-4 type-caption">Stranger Things featured video on Netflix, 2026</figcaption>
                      </figure>
                    ) : area.image && (
                      <figure className="mt-8">
                        <img src={area.image.src} alt={area.image.alt} width={area.title === 'Artwork' ? 2746 : 1172} height={area.title === 'Artwork' ? 1260 : 731}
                          loading="lazy" decoding="async" className="block h-auto w-full" />
                        <figcaption className="mt-4 type-caption">
                          {area.title === 'Artwork' ? 'Stranger Things featured artwork on Netflix, 2026' : 'Stranger Things featured synopsis on Netflix, 2026'}
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
              <figcaption className="mt-4 type-caption">
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
              <figcaption className="mt-4 type-caption">
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

          <section className="mt-[var(--section-gap)] max-w-content" aria-labelledby="netflix-challenge">
            <h2 id="netflix-challenge" className="type-decision">The challenge / Creative complexity at scale</h2>
            <p className="mt-4 type-body">{netflixWork.challenge}</p>
            <p className="mt-6 type-body">{netflixWork.impactContext}</p>
          </section>

          <NetflixPublicExamples examples={examples} />

          <ProjectLinks links={netflixWork.links} intro="Public writing and resources about Netflix’s creative tools and technology. These span several teams and years and provide context for the work described above." />

          <WorkProjectActions slug={project.slug} />
        </article>


      </div>
    </>
  );
}
