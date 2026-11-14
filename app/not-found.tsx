import { Action } from '@/components/Action';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-content px-page py-12">
      <p className="type-caption">404</p>
      <h1 className="mt-4 type-project-title">Page not found</h1>
      <Action href="/" variant="primary" className="mt-8">Go home</Action>
    </section>
  );
}
