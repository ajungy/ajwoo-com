import Link from 'next/link';
import { LegacyDesignRedirect } from '@/components/LegacyDesignRedirect';

export default function LegacyDesignPage() {
  return <>
    <meta httpEquiv="refresh" content="0;url=/work/" />
    <LegacyDesignRedirect />
    <p className="mx-auto max-w-app px-page py-12 type-body">
      This page has moved. <Link href="/work/" className="text-fg underline underline-offset-4">See Work</Link>
    </p>
  </>;
}
