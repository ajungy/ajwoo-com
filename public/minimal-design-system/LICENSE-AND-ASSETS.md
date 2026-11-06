# Minimal — Licensing & Asset Provenance

Everything in this system is free for commercial use, free to modify, and free to
redistribute. Nothing here requires payment, attribution in your UI, or a licence
review before you ship.

This file exists so that if someone ever asks, you can answer in one page.

---

## Summary

| Asset | Source | Licence | Commercial use | Redistribute | Cost |
|---|---|---|---|---|---|
| **Design tokens** | this system | yours | yes | yes | £0 |
| **Icon set** | **drawn from scratch here** | yours | yes | yes | £0 |
| **Component designs** | this system | yours | yes | yes | £0 |
| **Plus Jakarta Sans** | Tokotype | **SIL OFL 1.1** | yes | yes | £0 |
| **Inter** (fallback) | Rasmus Andersson | SIL OFL 1.1 | yes | yes | £0 |
| **System stack** (fallback) | OS-provided | n/a — never embedded | yes | n/a | £0 |

---

## Typeface — Plus Jakarta Sans

Licensed under the **SIL Open Font License 1.1**, the most permissive font
licence in common use. Under OFL you may:

- use it in commercial products, unlimited seats, unlimited pageviews
- embed it in apps, websites, PDFs and binaries
- modify it and redistribute the modification
- bundle it inside a product you sell

The only OFL conditions, none of which affect normal use:

1. You may not sell the font **by itself**. Selling a product that includes it is
   fine.
2. If you modify and redistribute the font files, the derivative must also be OFL
   and must not use the reserved name "Plus Jakarta Sans".
3. Include the OFL text alongside the font files when you redistribute them.

Practically: ship `PlusJakartaSans-*.woff2` plus its `OFL.txt` in your assets
folder and you are done. No attribution in your UI is required.

Get the files from Google Fonts or the Tokotype GitHub repository. **Self-host
them** — don't hotlink the Google Fonts CDN, which adds a third-party request and
a GDPR question you don't need.

```
/public/fonts/
  PlusJakartaSans-Regular.woff2      (400)
  PlusJakartaSans-Medium.woff2       (500)
  PlusJakartaSans-SemiBold.woff2     (600)
  OFL.txt
```

Only three weights. The system has no bold in the UI, so don't ship one.

```css
@font-face {
  font-family: "Plus Jakarta Sans";
  src: url("/fonts/PlusJakartaSans-Regular.woff2") format("woff2");
  font-weight: 400; font-style: normal; font-display: swap;
}
/* repeat for 500 and 600 */
```

`font-display: swap` matters: it renders fallback text immediately rather than
holding a blank screen, which is the same 100ms principle as everything else here.

---

## Icons

**The icon set in this system was drawn from scratch.** It is not a fork, not a
subset, and not derived from any existing library — so there is no third-party
licence attached to it at all. It is yours outright.

That was a deliberate choice over importing an existing set. Even permissive icon
libraries (Lucide is ISC, Phosphor and Heroicons are MIT, Material Symbols is
Apache 2.0 — all genuinely fine) carry an attribution or notice obligation
somewhere in the chain, and every one of them is drawn to its own optical rules.
Drawing our own removes the obligation entirely *and* guarantees the icons match
the system's single 1.5px line weight.

**Scale caveat, stated honestly.** Drawing our own was the right call at ~220
icons. It is *not* the right call at 1,000+. Hand-drawing at that volume produces
a long tail of subtly-wrong shapes, and the legal benefit over an MIT/ISC library
is marginal — those licences already permit commercial use, modification,
redistribution, and shipping inside a product you sell. Their only obligation is
a licence file in your repo.

So: use the bespoke set as the core, and reach for **Lucide** (ISC, ~1,600 icons,
official free Figma plugin) for anything it doesn't cover. That is the
recommendation, not a fallback.

If you later want to supplement the set, these are safe:

| Library | Licence | Notes |
|---|---|---|
| Lucide | ISC | Closest match to this system's stroke and grid |
| Phosphor | MIT | Multiple weights; use the "regular" weight only |
| Heroicons | MIT | Tailwind's set; heavier optical weight |
| Radix Icons | MIT | 15px grid — will not align with a 16px system |
| Material Symbols | Apache 2.0 | Variable weight; needs tuning to match |

Whatever you add, **redraw it to a 16px grid at 1.5px stroke** or it will read as
imported.

---

## Figma library

Publishing this file as a shared library needs a paid Figma seat, which the
GG Studios plan already includes. There is **no additional cost** to publish, and
no per-file or per-consumer fee.

To publish: **Assets panel → Libraries → Publish**. Other files then subscribe
from the same menu. Anything you publish stays under your ownership; Figma claims
no rights over it.

If you later share the library outside your org, note that consuming a published
library requires the consumer to have a Figma seat. That is Figma's pricing, not
a licence on this system — the tokens and designs themselves remain free to
redistribute in any form.

---

## What is *not* included, deliberately

- **No stock photography.** The media containers use neutral placeholder fills.
  Every stock licence has terms; none are worth inheriting into a design system.
- **No third-party illustration.** Empty states use type and a single icon.
- **No brand assets.** Logo placement rules are defined; the logo is yours.
- **No analytics, no CDN dependencies, no runtime licence checks.** The system is
  a set of files. Nothing phones home.

---

## If you are ever asked

> The Minimal design system is original work. Its icon set was drawn in-house and
> carries no third-party licence. Its typeface, Plus Jakarta Sans, is licensed
> under the SIL Open Font License 1.1, which permits unlimited commercial use,
> embedding, modification and redistribution at no cost. No component of this
> system requires payment, attribution, or a licence renewal.
