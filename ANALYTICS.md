# AJWOO PostHog installation

## Current status

Website update, October 28, 2026: consent-gated session replay and automatic
link/button click events are enabled in the SDK. The public remote project
configuration confirms replay is already enabled server-side. No PostHog project
or billing settings were changed. Existing app integrations in Draw and Convert
continue to use their earlier, event-only configuration.

The compact prompt is “Help improve ajwoo with cookies and session replay?”
with equal Decline/Allow actions and a Details link to `/privacy/`. The website's
version-2 consent cookie requires a fresh choice from prior opt-ins; prior
version-1 declines remain respected. Replay starts only after the new Allow.

Dashboard: https://us.posthog.com/project/610209/dashboard/2098006
Recordings: https://us.posthog.com/project/610209/replay

## Connect the account

1. Sign into PostHog and create one project named AJWOO (or reuse the existing one).
2. Copy its public project token and ingestion host. Never use a personal API key.
3. Website build environment: NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST.
   Draw/Convert build environments: VITE_POSTHOG_KEY and VITE_POSTHOG_HOST.
4. Use the same token/region in all three. Host must be https://us.i.posthog.com or
   https://eu.i.posthog.com. Rebuild after changing these public build variables.
5. Leave billing details absent; set each enabled product's spending limit to $0
   where offered. Verify this in the dashboard. Additional events can be dropped
   when the free allowance is exhausted. Do not enable other paid products.
6. Select and verify retention/deletion settings in the project before activation.
7. Deploy only on Alex's explicit instruction and verify real ingestion afterward.

## Data and consent

The SDK is dynamically loaded after opt-in only; declining sends no events.
A first-party AJWOO-domain choice cookie lasts 180 days. The always-accessible
Analytics control allows withdrawal. GPC and DNT override opt-in. Visitors who
consent can be connected across AJWOO subdomains via the SDK's shared cookie.
The SDK is only active on the application's exact production hostname(s), never
localhost, preview deployments, or alternate domains. It creates no person profiles.

Product events retain allowlisted metadata, query/hash-free page URLs, and
structural click information (element tag and position, without text or attributes).
Replay uses the bundled `posthog-js/full/no-external` recorder after opt-in, and
loads project configuration via JSON. Replay snapshots use their own SDK masking
pipeline and must bypass the scalar product-event sanitizer to remain playable.

Inputs are masked; hidden/file inputs, canvases, iframes, `[data-private]` and
`.ph-no-capture` subtrees are blocked. Both locked and unlocked Netflix portfolio
views are marked private before content renders. Editable text is masked, URL
attributes lose query/hash, and value/title/alt/placeholder/aria-label attributes
are removed. Console logging, network bodies/headers, canvas recording, surveys,
feature flag evaluation, and person profiles are disabled. Browser privacy signals
and withdrawing consent stop capture and recording. The network masker strips
headers and bodies even if remote project settings enable them later.

PostHog receives browser/device metadata and a pseudonymous identifier; receiving
servers necessarily see the network IP. Server-side retention is governed by the
project; this change does not alter it. Withdrawal stops future collection, not
previously collected data. Privacy questions and deletion requests go to Alex.

## Initial dashboard plan

One overview, filtered per app (website, draw, convert):
- Visitors and traffic sources (Web Analytics).
- App launches from the site: app_opened, grouped by destination_app.
- Booking clicks: booking_clicked (not a confirmed booking).
- External clicks: outbound_clicked, grouped by destination_domain.
- Website and Convert downloads: download_requested.
- Draw exports: drawing_export_requested, grouped by format; drawing_export_failed.
- Convert: conversion_started counts batches; conversion_succeeded and
  conversion_failed count individual jobs. Do not divide job totals by batch totals.
  conversion_cancelled records batch cancellation requests.

A download-request event does not confirm the OS saved the file. Retention and
cross-app journey reports cover consenting browsers only; blockers can prevent data.

## Maintenance

Website analytics now differs intentionally from the earlier event-only copies in
Draw/Convert. Do not copy replay configuration into those apps without auditing
file previews, drawings, documents, and their consent notices first. This website
records app launches, not interactions inside separate apps.

A production CSP must allow the configured ingestion and asset/config hosts in
connect-src. The recorder is bundled locally; remote extension scripts stay off.

Official docs: https://posthog.com/docs/libraries/next-js
https://posthog.com/docs/session-replay/privacy
https://posthog.com/docs/libraries/js/config

## Verification

`node scripts/test-analytics.cjs` covers default-off behavior, old-consent
migration, withdrawal and resume, GPC/DNT, event filtering, snapshot preservation,
URL masking, network body/header stripping, and click metadata filtering.
Production build and TypeScript checks pass. Verify a fresh consenting browser
session in PostHog after rollout; old sessions cannot gain recordings retroactively.

Automatic consent prompting starts on the first interior route, including direct
interior visits. The homepage stays free of automatic prompts; Privacy settings
can open the panel on any route. No optional collection starts before Allow.
The banner slides in/out and respects reduced motion.
