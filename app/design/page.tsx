import type { Metadata } from 'next';
import { ProjectCard } from '@/components/ProjectCard';
import { designProjects } from '@/content/projects';

export const metadata: Metadata = { title: 'Design' };

export default function DesignPage() {
  return (
    <div className="mx-auto max-w-app px-page">
      <section className="pt-12 pb-9">
        <h1 className="text-h1 text-fg">Design</h1>
        <p className="mt-6 max-w-content text-body-lg text-fg-secondary">
          Creative tools, mixed reality, and industrial design — at Netflix, Adobe,
          Microsoft, and before.
        </p>
      </section>
      <section className="pb-12">
        <div className="grid grid-cols-1 gap-8 medium:grid-cols-2 expanded:grid-cols-3">
          {designProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} priority={i < 3} />
          ))}
        </div>
      </section>
    </div>
  );
}
