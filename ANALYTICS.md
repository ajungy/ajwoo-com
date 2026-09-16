# AJWOO PostHog installation

## Current status

Local integrations installed in the website, ../ajwoo-draw and ../ajwoo-convert.
Connected to US Cloud project 610209. The public token is configured locally in
all three apps. Free plan verified: 1 million product events per monthly cycle,
with no paid upgrade. Discard client IP data is enabled. A labeled setup-test
pageview and app launch were received and inspected in PostHog. The AJWOO overview
dashboard and pageview-to-app-launch funnel are configured. Server retention
was not changed; no retention control was exposed on the inspected settings pages. Nothing was deployed. A blank project token disables both tracking
and the consent UI. Production rollout remains pending, so existing visitor traffic is not yet collected.
Dashboard: https://app.posthog.com/project/610209/dashboard/2098006

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

Allowlisted events/properties only. No replay, DOM autocapture, surveys, feature
flags, exception capture, file contents, filenames, drawings, inputs or messages.
URLs omit query and hash; referrers are domains only. Only utm_source, utm_medium,
and utm_campaign are retained for attribution; never put personal data in these.
PostHog receives browser/device metadata and a pseudonymous identifier; receiving
servers necessarily see the network IP. Configure retention in the account rather
than assuming SDK options determine server retention. Withdrawal stops future
tracking; deleting earlier events requires the operator's PostHog deletion workflow.

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

lib/analytics is copied into src/analytics in Draw and Convert. Keep core.ts,
AnalyticsConsent.tsx and analytics.css synchronized. Convert's prior no-telemetry
rule now has a documented opt-in exception; conversion files remain local.
Any production CSP must allow the chosen ingestion host in connect-src. The SDK
is bundled locally; recording scripts and remote extensions are disabled.

Official docs: https://posthog.com/docs/libraries/next-js
https://posthog.com/docs/privacy/data-collection
https://posthog.com/docs/billing/limits-alerts

## Verification

Website, Draw and Convert production builds pass. Draw: 78 tests pass; Convert:
76 tests, typecheck, lint, license audit and updated origin audit pass. Shared
analytics checks pass via `node scripts/test-analytics.cjs`. Consent was visually
checked and accept/decline exercised in a temporary localhost:4333 harness.
Synthetic events use app=setup-test. Exclude them from real traffic reports.
Cross-subdomain identity requires final production verification after deployment.

Project renamed AJWOO; reporting timezone set to America/Los_Angeles.
Overview default filter excludes app=setup-test. Live app conversion/export
events are instrumented; detailed per-app outcome charts can be configured once
real traffic arrives. No user data was used in the synthetic verification.
