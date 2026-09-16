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
