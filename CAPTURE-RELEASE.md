# Capture beta release — 2026-09-26

Authorized by Alex: replace the Install download with the new build and deploy. Root card, Apps cards and Capture detail page share one versioned URL via `content/apps.ts` `downloadZip`; the stable `capture-beta.zip` alias serves the same bytes for older links. The 2026-09-13 versioned file stays in place so previously shared links keep working.

Artifact: capture-beta-20260926-221935.zip
SHA-256: 8577bb7c6e9dcc7f54dc88f30123a497dd535a173ff68319879c57533cbcda47
Desktop original: ~/Desktop/ajwoo-capture-20260926-221935.zip
Notarization: Accepted, stapled; Gatekeeper `accepted / source=Notarized Developer ID` on the extracted ZIP with the download quarantine flag applied.

What changed: universal binary (Apple silicon + Intel) — earlier releases were arm64-only and would not open on Intel Macs. Install dialog and beta notice now say "Apple silicon or Intel" (both previously said Apple silicon only; the notice inside the signed app was corrected before notarizing, so the shipped notice matches the site). Icon toolbar, hover states, idle/scrub performance, H.264 default.

Checks: static export build; browser-tested Capture detail page: Install opens notice with corrected requirements, Download disabled until acknowledgment, then links to the new versioned ZIP; served ZIP SHA-256 matches the notarized original.

Deploy: direct upload of `.next-build` to Cloudflare Pages project `ajwoo-com`, branch `main` (not the stale `out` directory).

---

# Capture beta release — 2026-09-13

Authorized by Alex in the Capture task: publish the latest notarized ZIP through both Install buttons. Shared CaptureInstallButton provides a beta-risk acknowledgment (not a license agreement and not server-recorded consent), system requirements, download instructions and privacy/support links. Root card, Apps cards and Capture detail page share the same versioned download URL. Older capture-beta.zip link also serves the new release.

Artifact: capture-beta-20260913-120655.zip
SHA-256: 0aca9efb9c1c7b56349e3cf50afc3abd2a252971798b46d799afcd080b12936d
Desktop original: ~/Desktop/ajwoo-capture-20260913-120655.zip
Contains only the notarized app and factual beta/privacy notices; no source, credentials or unfinished legal drafts. Notices also reside inside signed app Resources/ReleaseNotices.

Checks: optimized static export + TypeScript; browser tested detail Install, initial disabled download, acknowledgment enables versioned URL, Cancel; home slide 3 keyboard Install opens same notice. Signature/staple/Gatekeeper verified after archive extraction. No claim that notarization eliminates all OS prompts or establishes legal immunity.

Current production before release: 0738b61a-91a5-44b5-837f-ad787ea9e5b8, commit 8e14211. Cloudflare Pages project ajwoo-com, production branch main. Prior deployment can be restored via Cloudflare rollback if necessary.

Important build detail: npm run build exports static files into .next-build with the current Next configuration, not out. Deploy the newly generated .next-build directory; deploying the old out directory would silently restore stale content.

Legal limitation: counsel-reviewed license/liability terms and appropriate acceptance records remain necessary before representing the app as contractually protected or ready for paid sales. Existing draft terms are intentionally not published. Beta notices preserve non-waivable rights. App-local privacy claims exclude website/CDN and Apple language-resource downloads.
