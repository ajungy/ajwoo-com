import type { Metadata } from 'next';
import '@/styles/globals.css';
import { TopBar } from '@/components/TopBar';
import { Cursor } from '@/components/Cursor';
import { site } from '@/content/site';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4321';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Alex Woo', template: '%s, Alex Woo' },
  description: site.identity,
  openGraph: { title: 'Alex Woo', description: site.identity, url: '/', siteName: 'Alex Woo' },
};

// Runs BEFORE first paint. Three jobs: apply a saved theme so a chosen theme
// never flashes the other one, decide whether the entrance plays, and force
// the landing page to start at the very top on a hard refresh. Without this
// the first frame shows the pre-animation state and the entrance becomes a
// flash — worse than no entrance at all. Reduced motion is handled in CSS,
// so it wins regardless of what this did.
//
// scrollRestoration: browsers restore the LAST scroll position on a manual
// reload by default, which meant refreshing halfway down `/` reopened it
// halfway down instead of at the top — the landing page's job (Principle 1)
// is a decision made in one scroll from the very top, so this always wins
// for `/` specifically. Other pages keep the browser's normal restore
// behavior; only the landing page has this requirement.
const bootScript = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
try {
  if (!sessionStorage.getItem('entrance-played')) {
    document.documentElement.setAttribute('data-entrance', 'run');
    sessionStorage.setItem('entrance-played', '1');
  }
} catch (e) {}
try {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (location.pathname === '/') window.scrollTo(0, 0);
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // No data-theme: follow the OS. A toggle changes a preference the OS
    // already knows, and compact chrome is at its density ceiling.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {/* Scroll-reveal (.stagger-grid, components/StaggerReveal.tsx) needs
            JS to add the class that makes content visible. Without this,
            a no-JS visitor would see permanently-invisible sections —
            strictly worse than no animation at all. */}
        <noscript>
          <style>{'.stagger-grid > * { opacity: 1 !important; transform: none !important; }'}</style>
        </noscript>
      </head>
      <body>
        {/* Site-wide now, at Alex's direction — was landing-page-only. */}
        <Cursor />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-modal focus:m-6 focus:rounded-control focus:bg-raised focus:px-6 focus:py-4 focus:text-label focus:shadow-e2"
        >
          Skip to content
        </a>
        <TopBar />
        <main id="main">{children}</main>
        {/* The only copyright notice on the site now, at Alex's direction —
            every project page used to repeat "© 2015 ALEX J. WOO" as its own
            trailing text block; consolidated to this one line, present on
            every page via the root layout, instead of eleven copies of the
            same fact scattered through the content. */}
        <footer className="mt-15">
          <div className="mx-auto max-w-app px-page py-9 text-caption text-fg-tertiary">
            &copy; {site.fullName}
          </div>
        </footer>
      </body>
    </html>
  );
}
