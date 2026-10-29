import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Adobe: Premiere Generative AI',
  alternates: { canonical: '/work/premiere-generative-ai/' },
  robots: { index: false },
};

export default function LegacyPremierePage() {
  return <>
    <meta httpEquiv="refresh" content="0;url=/work/premiere-generative-ai/" />
    <p className="mx-auto max-w-app px-page py-12 text-body">
      <Link href="/work/premiere-generative-ai/" className="text-fg underline">View Adobe: Premiere Generative AI</Link>
    </p>
  </>;
}
