import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Action } from '@/components/Action';
import { Picture } from '@/components/Picture';
import { projects, getProject, imageData } from '@/content/projects';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProject(params.slug);
  return { title: p?.title ?? 'Work' };
}

export default function WorkPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();
  const gallery = imageData.projects[project.slug]?.gallery ?? [];
  const backHref = project.kind === 'coffee' ? '/coffee/' : '/design/';

  return (
    <div className="mx-auto max-w-content px-page">
      {/* A way back, at the top-left of the content area — not the browser's. */}
      <div className="pt-9">
        <Action href={backHref} variant="tertiary" cursorLabel="Go back">
          ← {project.kind === 'coffee' ? 'Coffee' : 'Design'}
        </Action>
      </div>

      <header className="pt-8 pb-9">
        <h1 className="text-h1 text-fg">{project.title}</h1>
        <p className="mt-4 text-body text-fg-secondary">{project.category}</p>
      </header>

      <div className="space-y-8 pb-12">
        {gallery.map((img, i) => (
          <Picture
            key={img.base}
            img={img}
            alt={`${project.title} — image ${i + 1}`}
            priority={i === 0}
            sizes="(min-width: 720px) 720px, 100vw"
            className="block w-full h-auto rounded-lg border border-line-subtle"
          />
        ))}
      </div>
    </div>
  );
}
