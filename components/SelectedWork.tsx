import { Action } from './Action';
import { ProjectCard } from './ProjectCard';
import { getProject } from '@/content/projects';

export function SelectedWork() {
  return (
    <section id="selected-work" className="pt-12 scroll-mt-12">
      <h2 className="text-h3 text-fg">Selected work</h2>
      <p className="mt-4 max-w-content text-body-lg text-fg-secondary">AI for professional creation, connected workflows, and tools I build independently.</p>
      <div className="mt-9 grid grid-cols-1 gap-9 medium:grid-cols-2">
        <div>
          <ProjectCard project={getProject('premiere-generative-ai')!} priority />
          <p className="mt-6 text-body text-fg-secondary">Adobe · 2024 · Staff UX Designer</p>
          <p className="mt-4 text-body text-fg">Exploring how generative AI fits into an editor’s workflow.</p>
          <p className="mt-4 text-body text-fg-secondary">My scope: UX, UI, rapid exploration, design vision, discovery, and production.</p>
        </div>
        <div>
          <ProjectCard project={getProject('pr-ae-frame')!} priority />
          <p className="mt-6 text-body text-fg-secondary">Adobe · 2022 · Staff UX Designer</p>
          <p className="mt-4 text-body text-fg">Bringing review and collaboration into Premiere Pro and After Effects.</p>
          <p className="mt-4 text-body text-fg-secondary">My scope: product design, UX, UI, content, discovery, user research, and marketing.</p>
        </div>
      </div>
      <section className="mt-12 grid grid-cols-1 gap-9 medium:grid-cols-2">
        <div>
          <p className="text-body text-fg-secondary">Independent product · Design and build</p>
          <h3 className="mt-4 text-h3 text-fg">Convert: a shorter path from file to format</h3>
          <p className="mt-6 text-body-lg text-fg-secondary">A browser-based file converter, built around a simple sequence: drop files, choose a format, download. A focused look at product scope and hands-on implementation.</p>
          <div className="mt-6"><Action href="/work/convert/">Read the product story →</Action></div>
        </div>
        <video controls playsInline preload="none" poster="/img/appcard-convert-poster.webp" className="w-full rounded-lg" aria-label="Convert product demonstration">
          <source src="/img/appcard-convert.webm" type="video/webm" />
          <source src="/img/appcard-convert.mp4" type="video/mp4" />
        </video>
      </section>
      <div className="mt-9 flex flex-wrap gap-4">
        <Action href="/work/">More work →</Action>
        <Action href="/apps/">Explore all apps →</Action>
      </div>
    </section>
  );
}
