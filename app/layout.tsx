import type { Metadata } from 'next';
import '@/styles/globals.css';
import { TopBar } from '@/components/TopBar';
import { Cursor } from '@/components/Cursor';
import { site } from '@/content/site';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4321';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Alex Woo', template: '%s — Alex Woo' },
  description: site.identity,
  openGraph: { title: 'Alex Woo', description: site.identity, url: '/', siteName: 'Alex Woo' },
};

// Runs BEFORE first paint. Without this the first frame shows the pre-animation
// state and the entrance becomes a flash — worse than no entrance at all.
// Reduced motion is handled in CSS, so it wins regardless of what this did.
const entranceScript = `
try {
  if (!sessionStorage.getItem('entrance-played')) {
    document.documentElement.setAttribute('data-entrance', 'run');
    sessionStorage.setItem('entrance-played', '1');
  }
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // No data-theme: follow the OS. A toggle changes a preference the OS
    // already knows, and compact chrome is at its density ceiling.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: entranceScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-modal focus:m-6 focus:rounded-control focus:bg-raised focus:px-6 focus:py-4 focus:text-label focus:shadow-e2"
        >
          Skip to content
        </a>
        <TopBar />
        <main id="main">{children}</main>
        <footer className="mt-15 border-t border-line-subtle">
          <div className="mx-auto max-w-app px-page py-9 text-caption text-fg-tertiary">
            {site.fullName}
          </div>
        </footer>
        <Cursor />
      </body>
    </html>
  );
}
