import { pageMetadata } from '@/lib/metadata';
import { AnalyticsSettingsLink } from '@/lib/analytics/AnalyticsConsent';

export const metadata = pageMetadata('/privacy/', 'Analytics privacy');

export default function PrivacyPage() {
  return <article className="mx-auto max-w-content px-page py-12 text-body text-fg-secondary">
    <h1 className="text-h2 text-fg">Analytics privacy</h1>
    <p className="mt-8">If you choose Allow, ajwoo.com uses PostHog to measure visits, clicks, app launches, and downloads, and to replay interactions on this website. Replay reconstructs the webpage and pointer movements; it does not record your camera, microphone, desktop, or other browser tabs.</p>
    <p className="mt-6">Form inputs are masked. Password-protected portfolio content, embedded pages, and canvases are excluded. Network request bodies, headers, and console logs are not recorded. Analytics page URLs omit query strings and fragments.</p>
    <p className="mt-6">PostHog receives a pseudonymous browser identifier, browser and device information, and usage data in its US cloud service. Requests also reach PostHog’s servers with your network IP address. The website does not create identified person profiles. Session recordings are retained for 30 days. Analytics event retention is governed separately by PostHog’s project settings.</p>
    <p className="mt-6">Your choice and analytics cookies can last up to 180 days. Decline keeps optional analytics and replay off. You can change your choice using Privacy settings at any time; withdrawing consent stops future collection, but does not erase earlier data. Global Privacy Control and Do Not Track are respected.</p>
    <p className="mt-6">Replay on this website does not enable recordings inside separately hosted apps. Those apps have their own analytics configuration.</p>
    <p className="mt-6">For privacy questions or deletion requests, email <a className="underline" href="mailto:alex@ajwoo.com">alex@ajwoo.com</a>. See <a className="underline" href="https://posthog.com/privacy">PostHog’s privacy notice</a> for its handling of data.</p>
    <div className="mt-8"><AnalyticsSettingsLink /></div>
  </article>;
}
