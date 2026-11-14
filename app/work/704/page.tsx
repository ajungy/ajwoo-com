import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premiere Generative AI',
  alternates: { canonical: '/work/premiere-generative-ai/' },
  robots: { index: false },
};

export default function LegacyPremierePage() {
  return <>
    <meta httpEquiv="refresh" content="0;url=/work/premiere-generative-ai/" />
    <p className="mx-auto max-w-app px-page py-12 type-body">
      <Link href="/work/premiere-generative-ai/" className="text-fg underline">View Premiere Generative AI</Link>
    </p>
  </>;
}
