# DEPLOY.md — cutover runbook

**Nothing in this file has been executed.** It is maintained from Phase 1 onward
and run by Alex, by hand, when he decides the site replaces ajwoo.com.

Live ajwoo.com is untouched by this project. No deploy CLI has been run, no
hosting provider linked, no remote configured, no DNS record read or written, no
live payment resource created, and nothing has been written to Figma.

---

## 0. Before you touch anything

- [ ] Take a full WordPress backup (files + database) and **verify you can restore it.**
      This is the rollback plan; without a tested restore there isn't one.
- [ ] Export a list of every live URL (`/`, `/design/`, `/coffee/`, and all 31
      `/work/<slug>/` pages) so redirects can be checked after cutover.
- [ ] Decide the orphan question (CLAUDE.md **D6**). Nine `/work/` pages are live
      and linked from nowhere; three more are password-protected. Each one is
      either redirected or intentionally returns 410.

## 1. Environment

Set these on the host. `.env.local` is gitignored and must never be committed;
`.env.example` holds placeholders only.

| Variable | Value at cutover |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://ajwoo.com` |
| `NEXT_PUBLIC_CALENDLY_URL` | The real event URL — see D7 below |
| `NEXT_PUBLIC_CHECKOUT_PROVIDER` | `gumroad` \| `polar` \| `stripe` — blank until D2 is decided |
| `NEXT_PUBLIC_CHECKOUT_BASE_URL` | Provider storefront base — blank until D2 |

**D7 must be resolved before launch.** The live Calendly event is
`calendly.com/ajwoo/30min` while the old copy said "20 min". The build currently
labels the action **"Book 30 minutes"**, following the link rather than the old
copy. Either change the Calendly event to 20 minutes and update
`site.ctaLabel`, or keep 30 and leave it as is. Do not ship a label that
misstates the commitment.

## 2. Build

```
npm ci
npm run assets   # only needed if the source images change
npm run build
```

Output is a fully static export in `out/`. There is no server component and no
serverless function — **unless D2 selects Stripe**, which requires a route to
create a Checkout session and therefore a host that runs functions.

## 3. Hosting

Any static host serves `out/` as-is. Requirements:
- HTTPS with HSTS.
- `trailingSlash: true` is set, so `/design/` is canonical — configure the host
  to match rather than redirect-looping.
- Long cache lifetimes on `/img/*` and `/fonts/*` (content-hashed at build).

## 4. Redirects — required, not optional

The WordPress URLs must keep resolving or every existing link and search result
breaks.

| From | To | Why |
|---|---|---|
| `/work/704/` | `/work/genai-in-premiere-pro/` | A bare post ID is the URL on the most recent, most senior work. Give it a real slug and redirect. |
| `/work/<slug>/` | same path in the new site | 22 linked projects; paths preserved. |
| The 9 orphans | per D6 | Redirect to the section page, or 410. Do not leave them 404. |
| `/feed/`, `/wp-json/`, `/wp-admin/` | 410 or drop | WordPress surface that no longer exists. |

Keep the existing favicon set (`/wp-content/uploads/fbrfg/`) or re-point the
paths — the icons themselves were kept.

## 5. DNS

Only after the build is verified on a preview URL.

- [ ] Lower the TTL on the A/CNAME record ~24h **before** cutover.
- [ ] Point the record at the new host.
- [ ] Verify `https://ajwoo.com` and `https://www.ajwoo.com` both resolve and
      that one canonically redirects to the other.
- [ ] Restore the normal TTL once stable.

## 6. WordPress decommission — last, and not on cutover day

Leave WordPress running and reachable at a temporary hostname for **at least two
weeks** after DNS moves. Then:

- [ ] Confirm analytics show no meaningful traffic hitting the old install.
- [ ] Final backup, stored off the host.
- [ ] Cancel the Bluehost plan / delete the install.
- [ ] Remove the Jetpack/Photon connection last — `i0.wp.com` URLs are not used
      by the new build, but confirm with a crawl before pulling it.

## 7. Rollback

If anything is wrong after DNS moves: point the DNS record back at Bluehost. The
WordPress install is still running (step 6), so rollback is a DNS change and a
TTL wait — nothing to restore. **This is why step 6 waits two weeks.**

## 8. Post-cutover checks

- [ ] `og:image` renders — the WordPress site shipped `og:image=""`, so every
      share was a blank card. Confirm the new one resolves absolutely.
- [ ] Pinch-zoom works on a phone. The old `viewport` had `maximum-scale=1.0`,
      which blocked it.
- [ ] No request to `i0.wp.com`, `wp-content`, `wp-includes`, or
      `html5shim.googlecode.com` appears in the network panel.
- [ ] Lighthouse on `/` and `/design/`.
- [ ] Re-run `reference/checklist.md`.
