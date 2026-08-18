# Phase 0 — asset & content inventory

Read-only crawl of ajwoo.com, 2026-08-18. 34 pages fetched (3 section pages +
31 `/work/` detail pages), 127 unique images measured, 121.1 MB of imagery.
**Nothing was written to the live site.** GET requests only; the `/work/` pages
initially returned HTTP 406 from Bluehost's WAF until a `Referer` header was
added, and the crawl was rate-limited to 50 requests/minute thereafter.

---

## What the site actually is

| | |
|---|---|
| Platform | WordPress 7.0.4 on Bluehost |
| Theme | `semplice` |
| Plugins detected | `bluehost-wordpress-plugin`, `wp-p5js-block` |
| Image CDN | Jetpack Photon (`i0.wp.com`), resizing via `?fit=` |
| Fonts | Open Sans + PT Serif, Google Fonts CDN |
| HTML weight | 155–191 KB **per page** |
| Pages | 3 sections + 31 work detail pages |

### Three things worth knowing before we design anything

**1. Every page ships the WordPress block editor to visitors.** All 34 pages load
**45 distinct `wp-includes/js/dist/*` bundles** — `block-editor`, `editor`,
`components`, `blocks`, `react`, `react-dom`, `commands`, `preferences-persistence`,
and 37 more — plus jQuery, jQuery Migrate, and MediaElement. That is the admin
authoring environment, shipped to every reader. It is the single largest reason
the site feels slow, and it is the "Single Edit / Column Edit" leak's root cause
(see below). Nothing of it survives the migration.

**2. There is no `srcset` anywhere on the site.** Zero occurrences across every
page checked. Every image is a single fixed-size request through Photon's `?fit=`
parameter. A phone downloads the same bytes as a 5K display.

**3. Nine projects exist but are linked from nowhere.**

Linked from `/design/` (12): `10-borders`, `704`, `coin-lock`,
`dynamics-365-customer-voice`, `layout`, `netmarble`, `paintsound`, `pr-ae-frame`,
`product-visualize`, `seeing-ai`, `starbucks-technology`, `wrap-and-charge`

Linked from `/coffee/` (10): `3-coffee-shops-amsterdam`, `3-coffee-shops-in-tokyo`,
`5-coffee-shops-in-seattle`, `5-in-milan`, `best-coffee-shops-new-york-city`,
`blue-olive`, `telescope`, `top-3-fancy-cafes-paris`, `top-5-coffee-shop-paris`,
`top-5-coffee-shops-in-london`

**Orphaned — live, indexable, reachable by URL, linked from no section page (9):**
`3d-covid-19-map`, `canon-60d`, `emojify`, `hologlass`, `layout-password`,
`one-chat`, `plane`, `suvi`, `yo-yo-luggage-bag`

**You need to decide what these are** (D6). They're either work you chose to
retire — in which case they're cut and we set up redirects — or work that got
lost when the grid was last edited, in which case some of it may be better than
what's currently featured. I'm not guessing which.

---

## Content blocks

| Block | Source | Current role | Recommendation | Reasoning |
|---|---|---|---|---|
| Name — "Alex J. WOO" | `/` header + footer | Identity | **Keep** | Becomes the top-left home affordance on every page. |
| Bio — "Hi, I'm Alex" + paragraph | `/` | The only prose on the site | **Keep, rewrite** | The facts are right; the sentence order buries them. "Design Lead at Netflix" arrives after "Let's grab coffee!" — the strongest credential should not be third. |
| Calendly CTA | `/` → `calendly.com/ajwoo/30min` | Primary action | **Keep, fix** | **The copy says "grab 20 min"; the link books 30.** See D7 — this decides the CTA label. |
| Social links | `/` | Instagram, LinkedIn, Facebook, Pinterest, Spotify | **Keep 2, cut 3** | LinkedIn and Instagram serve the hiring-manager job. Facebook, Pinterest and Spotify don't, and five links dilute one primary action. |
| Education | `/` | RISD BFA ID · Brown cross-registration · Le Cordon Bleu Paris | **Keep** | Three lines, high signal, memorable. Le Cordon Bleu is the line people remember. |
| Clients (12) | `/` | Kikkerland, Container Store, USAA, Starbucks, MIT, Brown, Cheil, IUCN, WIPO, Kim & Chang, Yulchon, TEDx | **Keep as text** | Keep as a typeset list. Not a logo wall — that's mood, and the outbound links to `containerstore.com` etc. send visitors away at the exact moment we want them booking. |
| Featured / awards (13, 2011–2020) | `/` | Credential list | **Keep, demote** | Real evidence, but the newest is 6 years old. Belongs below the fold, not in the one-scroll decision. |
| Footer — "© 2015 ALEX J. WOO" | all | Copyright | **Cut** | Eleven years stale. A stale date actively signals an abandoned site. |
| Footer — "Thank you for visiting ajwoo.com" | all | — | **Cut** | Says nothing and costs a line. |
| Nav — "About / Coffee / Design" | all | Navigation | **Restructure** | "About" is the home page. Becomes Design / Coffee / Apps per the IA in `CLAUDE.md`. |
| **"Single Edit" / "Column Edit"** ×10 | `/` (×10), `/coffee/`, `/design/` | Leaked builder UI | **Cut** | Argued below. |
| **javascript-snow** | `/` | Decoration | **Cut** | Argued below. |
| 13 YouTube + 1 Vimeo embeds | `/work/*` | Project videos | **Keep, re-host as facades** | The content is good. Each iframe is ~700 KB of third-party JS with its own cookies; replace with a click-to-load poster. |
| 3 `<video>`/`.mp4` refs | `/work/*` | Inline video | **Keep** | Self-hosted already; re-encode. |
| `wp-p5js-block` CSS + `iframe-sizer.js` | all 3 section pages | p5.js sketch embed | **Cut** | Loaded on every page; no sketch is actually rendered on any of the three. Dead weight. |
| `html5shim.googlecode.com/svn/trunk/html5.js` | all | IE8 polyfill | **Cut** | Loaded over **plain `http://`** from **a domain that has not existed since 2016**. Every visitor makes a failing insecure request. |
| `og:image` | all | Social preview | **Cut and replace** | Currently `content=""` — empty. Every share of ajwoo.com renders a blank card. |
| `viewport ... maximum-scale=1.0` | all | — | **Cut** | Blocks pinch-zoom. Accessibility failure; the system's §7 floor forbids it. |
| Favicon set (`/fbrfg/`) | all | Browser icon | **Keep** | Complete set already exists; port as-is. |

---

## The two you asked me to argue against

### "Single Edit" / "Column Edit" — cut, and it's not a close call

These strings appear **10 times each on the home page** and once on each section
page. They are control labels from the semplice page builder's editing overlay,
rendered into the published HTML because the theme ships the editor bundle to the
frontend (finding #1 above). They are not content. They have no meaning to a
reader. A hiring manager who lands on ajwoo.com sees the words "Single Edit"
twenty times before reaching the awards list.

They also fail the system on their own terms: Principle 5 says nothing that does
nothing may look like it does something — these read as controls and do nothing.
Principle 6 says every label is a plain verb phrase naming its outcome; "Column
Edit" names an outcome the visitor cannot have. **Cut, with no replacement.**

### javascript-snow — cut

The home page carries a `javascript snow` credit link to
`free-web-tools.com/image-fall-like-snow/`. It fails Principle 14 at the first
sentence — *nothing on the page moves unless the user caused it or is waiting on
it* — and it fails the checklist line "the screen is calm at rest." It is also
the exact category of thing §0 calls decoration: it does not shorten the path to
booking 20 minutes or getting an app.

There's a sharper argument than the rule, though. Your brief asks for a build
where a single 400ms entrance is a *considered addition* requiring written
justification. Perpetual falling snow is the same budget spent badly. If the site
is going to move at all, it should move once, deliberately, and then hold still.
**Cut, along with the `htmlfreecodes.com` credit link beside it.**

---

## The image problem, precisely

You predicted the images would be the binding constraint on "expensive." That's
half right, and the half that's wrong is good news.

**The source photography is genuinely good.** 69 of 127 assets are keepers —
coffee shoots at 2000–5184px and 170–370 KB/MP. `IMG_4107.jpg` (Télescope) is
5184×3456. The Seattle, NYC, Milan and Paris posts are shot on real cameras at
real resolution. **That material can carry an expensive-feeling site today.**

**The damage is concentrated in exactly the place that does the most harm: the
grid tiles.** All 15 thumbnails — the entire first impression of `/design` and
`/coffee` — are 1x. Ten of them are ≤865px for a tile displayed at 370–570 CSS px.
`370x370_tokyo_cover.png` is 370×370, so it is soft on *any* modern display.
`Starbucks_Logo_Hi_res...png` is 577px wide despite the filename.

| Verdict | Count | What it means |
|---|---|---|
| **Keep** | 69 | Re-encode to AVIF/WebP, add `srcset`. No new photography. |
| **Re-export** | 49 | A better source likely exists — re-export from the original file. |
| **Re-encode** | 8 | GIFs → MP4/WebM + static poster. |
| **Re-shoot** | 1 | `whitea.png` (570px, no recoverable source). |

### Findings inside that table

**The GIFs are the worst thing on the site.** Eight animated GIFs, 42.4 MB total:

| File | Displayed | Weight | Frames |
|---|---|---|---|
| `2017/01/33.gif` | 570×570 | **13.1 MB** | — |
| `2017/01/chairloopicon.gif` | 960×540 | 10.5 MB | — |
| `2019/02/ezgif-2-16a9f28470d2.gif` | 600×338 | 4.8 MB | — |
| `2017/01/22.gif` | 570×570 | 4.5 MB | — |
| `2020/08/2.gif` | 335×335 | 4.3 MB | — |
| `2019/02/layout33333d.gif` | 865×864 | 2.6 MB | **241** |
| `2024/07/genai-pr-570-compressed.gif` | 570×570 | 1.6 MB | 60 |
| `2017/01/10b97b32239665....gif` | 600×579 | 1.1 MB | — |

Three of them (`layout33333d`, `genai-pr-570-compressed`, `2.gif` = 8.5 MB) are
**grid thumbnails, so they auto-play on all 31 detail pages simultaneously.** A
13.1 MB GIF at 570×570 is roughly 40,000 KB per megapixel; the same clip as H.264
is about 300 KB. Beyond the weight, they are auto-animating motion the user did
not cause — the same Principle 14 failure as the snow, at 8.5 MB.
**Re-encode to MP4/WebM, show a static poster frame, play on click.**

**Eleven images are Facebook round-trips** (`*_1379490358765590_836124176_o.jpg`
and similar) — files downloaded back out of Facebook after Facebook already
recompressed them. They're second-generation JPEGs capped at 1080–2048px. All in
the London and Blue Olive posts. If the camera originals exist, this is a
re-export; if not, those two posts are the weakest in the set.

**One real recovery:** the home hero is served as
`Original-bw-long-scaled.png` (2560×1328) — WordPress's auto-downscale of an
oversized upload. **The true original, `Original-bw-long.png` at 2788×1446, is
still on the server** and I confirmed it returns HTTP 200. Free quality.

**Over-compressed beyond saving without the source:** `hololens.jpg` (1754×1754
at 22 KB/MP — the Paint Sound tile), `22222222222.jpg` (3840×2160 at 35 KB/MP),
`IMG_3666.jpg`, `19619688..._o.jpg`, `SalesAssistHeroImage.jpg`.

> **Note on PNGs:** low KB/MP on a PNG means flat color, not damage — PNG is
> lossless. `Untitlesd-2-04.png` at 6 KB/MP is a clean flat graphic, not a soft
> one. I only flagged JPEGs on compression ratio.

---

## What this changes in `CLAUDE.md`

1. **`/design` gets cards, not a list.** §5 of `CLAUDE.md` deferred this to
   Phase 0. The answer is cards *conditional on re-exporting the 15 tiles* — the
   underlying project imagery is strong enough to be the argument, but only if
   the tiles stop being 1x. If tiles can't be re-exported, the list wins.
2. **The IA has a fourth template I didn't account for:** `/work/<slug>` detail
   pages, ×22 (or ×31). `CLAUDE.md` §4 lists four routes and needs a fifth.
3. **`/work/704/` is "GenAI in Premiere Pro"** — a bare post ID as a URL, on the
   most recent and most senior piece of work. Needs a real slug and a redirect.
4. **The CTA label is blocked on D7.** "Book 20 minutes" is in `CLAUDE.md` as the
   primary action's label; the Calendly link is a 30-minute event.

---

## Open decisions added

| ID | Decision | Needed by |
|---|---|---|
| **D6** | The 9 orphaned projects: retire (with redirects) or restore? | Phase 5 |
| **D7** | Calendly — change the event to 20 min, or change the label to "Book 30 minutes"? | Phase 4 |
| **D8** | Can you re-export the 15 grid tiles from originals? This decides cards vs. list on `/design`. | Phase 5 |
| **D9** | The 3 animated grid GIFs — re-encode to click-to-play video, or replace with stills? | Phase 5 |

---

## Appendix — full asset table

Every one of the 127 assets, with source path, type, measured dimensions, weight,
recommendation and reasoning.

### A. Grid thumbnails - Tier 1, loaded on all 31 work pages

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Current role | Recommendation | Reasoning |
|---|---|---|---|---|---|---|
| `2020/08/2.gif` | gif | 335x335 | 4453 KB | Project grid tile | **RE-ENCODE** | 4.3 MB GIF auto-animating in the grid - MP4/WebM with a static poster is ~1/20 the weight |
| `2024/01/370x370_tokyo_cover.png` | png | 370x370 | 80 KB | Project grid tile | **RE-EXPORT** | 370px tile is 1x - soft on every retina display, and this grid is the first impression |
| `2015/07/netmarble-570.png` | png | 570x570 | 19 KB | Project grid tile | **RE-EXPORT** | 570px tile is 1x - soft on every retina display, and this grid is the first impression |
| `2017/01/Seeing-ai-570.png` | png | 570x570 | 59 KB | Project grid tile | **RE-EXPORT** | 570px tile is 1x - soft on every retina display, and this grid is the first impression |
| `2017/01/coin.png` | png | 570x570 | 52 KB | Project grid tile | **RE-EXPORT** | 570px tile is 1x - soft on every retina display, and this grid is the first impression |
| `2024/07/genai-pr-570-compressed.gif` | gif | 570x570 | 1628 KB | Project grid tile | **RE-ENCODE** | 1.6 MB GIF auto-animating in the grid - MP4/WebM with a static poster is ~1/20 the weight |
| `2020/07/Starbucks_Logo_Hi_res.5d386796a60b6.png` | png | 577x576 | 69 KB | Project grid tile | **RE-EXPORT** | 577px tile is 1x - soft on every retina display, and this grid is the first impression |
| `2018/06/usb800x8003.png` | png | 800x800 | 74 KB | Project grid tile | **RE-EXPORT** | 800px tile is 1x - soft on every retina display, and this grid is the first impression |
| `2020/10/customervoice.png` | png | 800x800 | 19 KB | Project grid tile | **RE-EXPORT** | 800px tile is 1x - soft on every retina display, and this grid is the first impression |
| `2019/02/layout33333d.gif` | gif | 865x864 | 2628 KB | Project grid tile | **RE-ENCODE** | 2.6 MB GIF auto-animating in the grid - MP4/WebM with a static poster is ~1/20 the weight |
| `2019/02/20180313_120917-1-1.jpg` | jpeg | 1081x1083 | 274 KB | Project grid tile | **RE-EXPORT** | 1081px tile is 1x - soft on every retina display, and this grid is the first impression |
| `2017/01/SalesAssistHeroImage5.png` | png | 1433x1432 | 498 KB | Project grid tile | **RE-EXPORT** | 1433px - under 2x for the 770px column; re-export larger if the source allows |
| `2022/04/1.png` | png | 1433x1432 | 50 KB | Project grid tile | **RE-EXPORT** | 1433px - under 2x for the 770px column; re-export larger if the source allows |
| `2017/01/69bc7d_eecfb66147bc4668832aca72ef5b6b32.png` | png | 1500x1000 | 185 KB | Project grid tile | **RE-EXPORT** | 1500px - under 2x for the 770px column; re-export larger if the source allows |
| `2000/01/hololens.jpg` | jpeg | 1754x1754 | 68 KB | Project grid tile | **RE-EXPORT** | 22 KB/MP - visibly over-compressed; re-export from the original |

**Subtotal: 9.9 MB, re-downloaded on every one of the 31 detail pages.**


### B. Content images - by project


**(home / section pages)**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/06/19650396_1379490358765590_836124176_o.png` | png | 1080x1080 | 1242 KB | **RE-EXPORT** | Facebook round-trip export - second-generation JPEG; use the camera original |
| `2017/09/asas.jpg` | jpeg | 1636x1636 | 956 KB | **KEEP** | 1636x1636, 357 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/06/telescopefron.jpg` | jpeg | 1443x1444 | 714 KB | **RE-EXPORT** | 1443px - under 2x for the 770px column; re-export larger if the source allows |
| `2017/08/20170707_123007front.jpg` | jpeg | 1334x1334 | 666 KB | **RE-EXPORT** | 1334px - under 2x for the 770px column; re-export larger if the source allows |
| `2017/10/as.jpg` | jpeg | 1146x1146 | 594 KB | **RE-EXPORT** | 1146px - under 2x for the 770px column; re-export larger if the source allows |
| `2017/08/22.jpg` | jpeg | 1352x1352 | 531 KB | **RE-EXPORT** | 1352px - under 2x for the 770px column; re-export larger if the source allows |
| `2017/08/IMG_20170623_232342_244-2.jpg` | jpeg | 1079x1080 | 416 KB | **RE-EXPORT** | 1079px - under 2x for the 770px column; re-export larger if the source allows |
| `2025/08/Original-bw-long-scaled.png` | png | 2560x1328 | 372 KB | **KEEP** | 2560x1328, 109 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/07/20205645_1397148523666440_354054058_o.jpg` | jpeg | 1080x1080 | 257 KB | **RE-EXPORT** | Facebook round-trip export - second-generation JPEG; use the camera original |
| `2017/01/whitea.png` | png | 570x570 | 28 KB | **RE-SHOOT** | 570px - below the content column even at 1x; nothing to recover from |

**`/work/10-borders/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/01/ten-borders-01-1.png` | png | 1920x2773 | 735 KB | **KEEP** | 1920x2773, 138 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/01/ten-borders-2.png` | png | 2448x1286 | 51 KB | **KEEP** | 2448x1286, 16 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/3-coffee-shops-amsterdam/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/10/20170723_133230.jpg` | jpeg | 1919x1439 | 782 KB | **KEEP** | 1919x1439, 283 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/10/20170723_1439390.jpg` | jpeg | 1947x1460 | 721 KB | **KEEP** | 1947x1460, 254 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/10/20170723_133221.jpg` | jpeg | 1947x1460 | 687 KB | **KEEP** | 1947x1460, 242 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/10/20170722_152158.jpg` | jpeg | 1662x1247 | 613 KB | **KEEP** | 1662x1247, 296 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/10/20170723_144432.jpg` | jpeg | 1520x1146 | 597 KB | **RE-EXPORT** | 1520px - under 2x for the 770px column; re-export larger if the source allows |
| `2017/10/20170722_151938.jpg` | jpeg | 1934x703 | 439 KB | **KEEP** | 1934x703, 323 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/10/20170722_150235.jpg` | jpeg | 1417x937 | 422 KB | **RE-EXPORT** | 1417px - under 2x for the 770px column; re-export larger if the source allows |

**`/work/3-coffee-shops-in-tokyo/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2024/01/IMG_5191.jpg` | jpeg | 2394x1796 | 1014 KB | **KEEP** | 2394x1796, 236 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2024/01/your-name.png` | png | 1941x544 | 639 KB | **KEEP** | 1941x544, 605 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2024/01/IMG_3666.jpg` | jpeg | 2394x1796 | 285 KB | **RE-EXPORT** | 66 KB/MP - visibly over-compressed; re-export from the original |
| `2024/01/IMG_5024.jpg` | jpeg | 1348x1101 | 246 KB | **RE-EXPORT** | 1348px - under 2x for the 770px column; re-export larger if the source allows |

**`/work/5-coffee-shops-in-seattle/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2019/02/20170825_165625-1.jpg` | jpeg | 4032x3024 | 2291 KB | **KEEP** | 4032x3024, 188 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2019/02/20180617_140458.jpg` | jpeg | 4032x3024 | 1625 KB | **KEEP** | 4032x3024, 133 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2019/02/20160731_140045-2.jpg` | jpeg | 4032x1187 | 1013 KB | **KEEP** | 4032x1187, 212 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2019/02/20171120_120129.jpg` | jpeg | 2056x1542 | 651 KB | **KEEP** | 2056x1542, 205 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2019/02/a.jpg` | jpeg | 2056x1154 | 475 KB | **KEEP** | 2056x1154, 200 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2019/02/IMG_0019.jpg` | jpeg | 1156x889 | 248 KB | **RE-EXPORT** | 1156px - under 2x for the 770px column; re-export larger if the source allows |
| `2019/02/IMG_0027.jpg` | jpeg | 1149x596 | 98 KB | **RE-EXPORT** | 1149px - under 2x for the 770px column; re-export larger if the source allows |

**`/work/5-in-milan/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/08/20170701_143009.jpg` | jpeg | 1827x1370 | 729 KB | **KEEP** | 1827x1370, 291 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/08/20170703_142816.jpg` | jpeg | 1560x1249 | 715 KB | **KEEP** | 1560x1249, 367 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/08/20170701_142047.jpg` | jpeg | 1795x1346 | 654 KB | **KEEP** | 1795x1346, 271 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/08/20170702_201101.jpg` | jpeg | 1827x1370 | 629 KB | **KEEP** | 1827x1370, 252 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/08/20170703_135524.jpg` | jpeg | 1370x1370 | 562 KB | **RE-EXPORT** | 1370px - under 2x for the 770px column; re-export larger if the source allows |
| `2017/08/20170703_195615.jpg` | jpeg | 1827x1370 | 425 KB | **KEEP** | 1827x1370, 170 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/08/55.jpg` | jpeg | 1827x449 | 311 KB | **KEEP** | 1827x449, 379 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/704/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2024/07/obj-add-2.png` | png | 3946x1027 | 862 KB | **KEEP** | 3946x1027, 213 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/best-coffee-shops-new-york-city/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/09/20170801_112309-1.jpg` | jpeg | 2181x1636 | 1221 KB | **KEEP** | 2181x1636, 342 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/09/20170801_152508.jpg` | jpeg | 2106x1678 | 1045 KB | **KEEP** | 2106x1678, 296 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/09/20170801_152452.jpg` | jpeg | 2237x1678 | 1007 KB | **KEEP** | 2237x1678, 268 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/09/20170731_144729.jpg` | jpeg | 2205x1654 | 981 KB | **KEEP** | 2205x1654, 269 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/09/20170610_122608.jpg` | jpeg | 2237x1678 | 966 KB | **KEEP** | 2237x1678, 258 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/09/20170801_164752.jpg` | jpeg | 2238x1678 | 665 KB | **KEEP** | 2238x1678, 177 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/09/a.jpg` | jpeg | 2237x1678 | 643 KB | **KEEP** | 2237x1678, 171 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/09/20170731_124830.jpg` | jpeg | 2237x390 | 303 KB | **KEEP** | 2237x390, 348 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/blue-olive/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/06/IMG_3884.jpg` | jpeg | 4841x3220 | 4773 KB | **KEEP** | 4841x3220, 306 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/06/IMG_3878.jpg` | jpeg | 3839x2797 | 3328 KB | **KEEP** | 3839x2797, 310 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/06/19650136_1379492855432007_1868628096_o-1.jpg` | jpeg | 1920x1440 | 598 KB | **RE-EXPORT** | Facebook round-trip export - second-generation JPEG; use the camera original |
| `2017/06/aaa-copy.jpg` | jpeg | 1396x1906 | 347 KB | **RE-EXPORT** | 1396px - under 2x for the 770px column; re-export larger if the source allows |
| `2017/06/19619688_1379492322098727_659505103_o.jpg` | jpeg | 1920x1440 | 279 KB | **RE-EXPORT** | 101 KB/MP - visibly over-compressed; re-export from the original |
| `2017/06/19650396_1379490358765590_836124176_o-1.png` | png | 1080x178 | 101 KB | **RE-EXPORT** | Facebook round-trip export - second-generation JPEG; use the camera original |

**`/work/coin-lock/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/01/33.gif` | gif | 570x570 | 13394 KB | **RE-ENCODE** | 13.1 MB GIF - MP4/WebM with a static poster is ~1/20 the weight |
| `2017/01/22.gif` | gif | 570x570 | 4580 KB | **RE-ENCODE** | 4.5 MB GIF - MP4/WebM with a static poster is ~1/20 the weight |
| `2017/01/untitled.42_2-copy.jpg` | jpeg | 4499x3342 | 4030 KB | **KEEP** | 4499x3342, 268 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/01/aaa-02.png` | png | 1920x2184 | 931 KB | **KEEP** | 1920x2184, 222 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/01/coin_1.png` | png | 1920x1080 | 638 KB | **KEEP** | 1920x1080, 308 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/01/22222222222.jpg` | jpeg | 3840x2160 | 290 KB | **RE-EXPORT** | 35 KB/MP - visibly over-compressed; re-export from the original |
| `2017/01/sg.png` | png | 1828x734 | 20 KB | **KEEP** | 1828x734, 15 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/01/Untitlesd-2-04.png` | png | 1920x847 | 9 KB | **KEEP** | 1920x847, 6 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/dynamics-365-customer-voice/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2020/10/Screen-Shot-2020-10-01-at-9.15.46-PM.png` | png | 1127x435 | 195 KB | **RE-EXPORT** | 1127px - under 2x for the 770px column; re-export larger if the source allows |

**`/work/emojify/`**  -  **ORPHANED: not linked from any section page**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/01/emojify-01.png` | png | 1920x5781 | 1258 KB | **KEEP** | 1920x5781, 113 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/01/10b97b32239665.567559135509d.gif` | gif | 600x579 | 1114 KB | **RE-ENCODE** | 1.1 MB GIF - MP4/WebM with a static poster is ~1/20 the weight |
| `2017/01/emojify-02.png` | png | 1920x3305 | 296 KB | **KEEP** | 1920x3305, 47 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/hologlass/`**  -  **ORPHANED: not linked from any section page**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/01/hologlass.png` | png | 1926x9369 | 1331 KB | **KEEP** | 1926x9369, 74 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/layout/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2019/02/ezgif-2-16a9f28470d2.gif` | gif | 600x338 | 4895 KB | **RE-ENCODE** | 4.8 MB GIF - MP4/WebM with a static poster is ~1/20 the weight |
| `2019/02/asdc.png` | png | 2000x714 | 736 KB | **KEEP** | 2000x714, 516 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2019/02/van.png` | png | 1538x875 | 13 KB | **RE-EXPORT** | 1538px - under 2x for the 770px column; re-export larger if the source allows |

**`/work/netmarble/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2015/07/aa.png` | png | 1075x574 | 42 KB | **RE-EXPORT** | 1075px - under 2x for the 770px column; re-export larger if the source allows |

**`/work/one-chat/`**  -  **ORPHANED: not linked from any section page**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/01/onechatl.png` | png | 2205x5112 | 435 KB | **KEEP** | 2205x5112, 39 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/01/Picture.png` | png | 1838x935 | 214 KB | **KEEP** | 1838x935, 125 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/paintsound/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/01/Screen-Shot-2018-06-16-at-4.22.45-PM.png` | png | 3360x1611 | 1193 KB | **KEEP** | 3360x1611, 221 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/01/Future-of-AR-06-1.png` | png | 1920x898 | 18 KB | **KEEP** | 1920x898, 11 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/pr-ae-frame/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2022/04/Frame-io-Adobe-copy.jpg` | jpeg | 1600x394 | 134 KB | **KEEP** | 1600x394, 213 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/product-visualize/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2019/09/SalesAssistHeroImage.jpg` | jpeg | 2500x1079 | 319 KB | **RE-EXPORT** | 119 KB/MP - visibly over-compressed; re-export from the original |

**`/work/seeing-ai/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/01/chairloopicon.gif` | gif | 960x540 | 10749 KB | **RE-ENCODE** | 10.5 MB GIF - MP4/WebM with a static poster is ~1/20 the weight |
| `2017/01/seesing-ai.png` | png | 1987x642 | 336 KB | **KEEP** | 1987x642, 264 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/starbucks-technology/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2020/07/SBX20190610-Starbucks-Tryer-Lab-Featured-Image.jpg` | jpeg | 1440x700 | 719 KB | **RE-EXPORT** | 1440px - under 2x for the 770px column; re-export larger if the source allows |
| `2014/07/IMG_8519B7BC7D82-1.png` | png | 1778x1000 | 69 KB | **KEEP** | 1778x1000, 39 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2014/07/1.png` | png | 1778x1000 | 67 KB | **KEEP** | 1778x1000, 38 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2014/07/2.png` | png | 1778x1000 | 49 KB | **KEEP** | 1778x1000, 28 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/telescope/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/06/IMG_4107.jpg` | jpeg | 5184x3456 | 5745 KB | **KEEP** | 5184x3456, 321 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/06/IMG_4114.jpg` | jpeg | 5184x3456 | 5710 KB | **KEEP** | 5184x3456, 319 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/06/aaa.jpg` | jpeg | 1832x916 | 407 KB | **KEEP** | 1832x916, 243 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/06/IMG_4104.jpg` | jpeg | 2244x545 | 388 KB | **KEEP** | 2244x545, 318 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/top-3-fancy-cafes-paris/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/08/20170704_163455.jpg` | jpeg | 1094x1458 | 777 KB | **RE-EXPORT** | 1094px - under 2x for the 770px column; re-export larger if the source allows |
| `2017/08/20170718_170130.jpg` | jpeg | 1030x1374 | 394 KB | **RE-EXPORT** | 1030px - under 2x for the 770px column; re-export larger if the source allows |
| `2017/08/IMG_20170623_232342_244.jpg` | jpeg | 1080x1350 | 380 KB | **RE-EXPORT** | 1080px - under 2x for the 770px column; re-export larger if the source allows |
| `2017/08/aaas.jpg` | jpeg | 970x216 | 81 KB | **RE-EXPORT** | 970px - under 2x for the 770px column; re-export larger if the source allows |

**`/work/top-5-coffee-shop-paris/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/08/IMG_3986.jpg` | jpeg | 2000x1333 | 943 KB | **KEEP** | 2000x1333, 354 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/08/20170629_181107.jpg` | jpeg | 1944x1458 | 826 KB | **KEEP** | 1944x1458, 292 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/08/20170707_123007.jpg` | jpeg | 1639x1334 | 787 KB | **KEEP** | 1639x1334, 360 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/08/20170714_155651.jpg` | jpeg | 1734x1240 | 682 KB | **KEEP** | 1734x1240, 318 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/08/20170725_161239.jpg` | jpeg | 1615x1210 | 511 KB | **KEEP** | 1615x1210, 262 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/08/IMG_3995.jpg` | jpeg | 2000x1472 | 502 KB | **KEEP** | 2000x1472, 171 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/08/20170629_181040.jpg` | jpeg | 1944x858 | 407 KB | **KEEP** | 1944x858, 244 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/08/20170725_161521.jpg` | jpeg | 1032x815 | 213 KB | **RE-EXPORT** | 1032px - under 2x for the 770px column; re-export larger if the source allows |

**`/work/top-5-coffee-shops-in-london/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/07/20216741_1397152833666009_781567314_o.jpg` | jpeg | 2048x1536 | 573 KB | **RE-EXPORT** | Facebook round-trip export - second-generation JPEG; use the camera original |
| `2017/07/20216768_1397148553666437_1983934829_o.jpg` | jpeg | 2048x1536 | 444 KB | **RE-EXPORT** | Facebook round-trip export - second-generation JPEG; use the camera original |
| `2017/07/20216458_1397148566999769_1585143206_o.jpg` | jpeg | 2048x1536 | 393 KB | **RE-EXPORT** | Facebook round-trip export - second-generation JPEG; use the camera original |
| `2017/07/20186991_1397148543666438_1553485314_o.jpg` | jpeg | 1820x1271 | 383 KB | **RE-EXPORT** | Facebook round-trip export - second-generation JPEG; use the camera original |
| `2017/07/20205568_1397148520333107_1470007983_o-1.jpg` | jpeg | 1737x1284 | 361 KB | **RE-EXPORT** | Facebook round-trip export - second-generation JPEG; use the camera original |
| `2017/07/20216333_1397168966997729_1992974993_o.jpg` | jpeg | 2022x857 | 208 KB | **RE-EXPORT** | Facebook round-trip export - second-generation JPEG; use the camera original |

**`/work/wrap-and-charge/`**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2019/02/Screen-Shot-2019-02-08-at-9.13.43-PM.png` | png | 2020x902 | 673 KB | **KEEP** | 2020x902, 370 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2019/02/Screen-Shot-2019-02-08-at-9.12.54-PM.png` | png | 1980x896 | 385 KB | **KEEP** | 1980x896, 218 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2019/02/Screen-Shot-2019-02-08-at-9.33.33-PM.png` | png | 2132x1190 | 382 KB | **KEEP** | 2132x1190, 151 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2019/02/bbb.jpg` | jpeg | 1620x903 | 304 KB | **KEEP** | 1620x903, 208 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2019/02/Screen-Shot-2019-02-08-at-9.08.25-PM.png` | png | 2014x1122 | 280 KB | **KEEP** | 2014x1122, 124 KB/MP - real source quality; re-encode to AVIF/WebP |

**`/work/yo-yo-luggage-bag/`**  -  **ORPHANED: not linked from any section page**

| Source (under `/wp-content/uploads/`) | Type | Dimensions | Weight | Recommendation | Reasoning |
|---|---|---|---|---|---|
| `2017/01/e7bfa333396421.56d7d894650b2.png` | png | 3473x4972 | 1372 KB | **KEEP** | 3473x4972, 79 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/01/2a26cd33396421.56d7d894658f5.png` | png | 3492x4974 | 618 KB | **KEEP** | 3492x4974, 36 KB/MP - real source quality; re-encode to AVIF/WebP |
| `2017/01/c7bf9633396421.56d7c3916a612.png` | png | 1110x603 | 13 KB | **RE-EXPORT** | 1110px - under 2x for the 770px column; re-export larger if the source allows |
| `2017/01/cccd0d33396421.56d7c39169f67.png` | png | 905x520 | 9 KB | **RE-EXPORT** | 905px - under 2x for the 770px column; re-export larger if the source allows |