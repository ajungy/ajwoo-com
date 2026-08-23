import { Picture } from './Picture';
import type { Block } from '@/content/projects';

/** "Environment 4.5/5" — the coffee reviews score every shop this way. The
 *  colon in this comment's own example was never actually in the source
 *  data (it's plain "Label N/5", no punctuation) — the regex used to require
 *  one, which meant it silently never matched anything and every score line
 *  fell through to the plain-heading branch below instead. That went
 *  unnoticed until the heading-dedup pass in Blocks() started collapsing
 *  identical score TEXT across different shops (two shops scoring
 *  "Environment 4/5" is a coincidence, not a repeated heading) — same value,
 *  different shop, silently dropped. The colon is optional now, matching
 *  what's actually in content/images.json. */
const SCORE = /^([A-Za-z][A-Za-z /&-]{1,24}):?\s*([\d.]+)\s*\/\s*(\d+)\s*$/;
/** A short line with no terminal punctuation is a section heading in the
 *  original layout ("Process", "AudioHaptics", "Environment"). */
const isHeading = (s: string) => s.length <= 44 && !/[.!?,;:]$/.test(s) && !SCORE.test(s);
/** Price tier, recovered from the live site rather than invented: the
 *  original markup styled a run of 5 "$" characters with the first N in the
 *  page's default text color and the rest in a light gray span — e.g.
 *  `Price $$<span style="color:#A9A9A9">$$$</span>` for a 2-of-5 rating.
 *  The Phase 0 crawl flattened that styling to plain "Price $$$$$" text
 *  (or, for a post's 2nd+ shop, just "$$$$$" with no "Price" label),
 *  losing exactly the information the symbol exists to carry. Re-scraped
 *  every coffee page's real markup and re-encoded each one here as
 *  "PRICE:N" (content/images.json) so this component can render the actual
 *  black/gray split instead of five uniform, meaningless dollar signs. */
const PRICE = /^PRICE:([1-5])$/;
/** "1. Supreme Coffee" — the source markup numbers each shop's heading. The
 *  number is redundant with plain reading order (and, in multi-shop posts,
 *  the same numbered name is ALSO listed once already as a bare intro list
 *  — see the dedup pass in Blocks() below), so it's stripped at render. */
const LEADING_NUMBER = /^\d+\.\s+/;
/** "[Seeing AI App (iOS download)](https://apps.apple.com/...)" — a plain
 *  markdown-style link, the convention used in content/images.json wherever
 *  the live site had a real hyperlink (an app store badge, a linked product
 *  name) that the original text-only crawl flattened to a bare string. Short
 *  link labels like this used to fall through to the heading branch below
 *  (no terminal punctuation, under the length cutoff), rendering as an
 *  oversized `<h2>` — checked before that here so they render as an inline
 *  link inside a normal body paragraph instead, matching the rest of the
 *  running text around them. */
const LINK = /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/;

function Text({ value }: { value: string }) {
  const link = value.match(LINK);
  if (link) {
    const [, label, href] = link;
    return (
      <p className="max-w-content text-body text-fg-secondary leading-relaxed">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-label={label}
          className="text-fg underline underline-offset-2 transition-colors duration-fast ease-standard can-hover:hover:text-fg-secondary"
        >
          {label}
        </a>
      </p>
    );
  }
  const price = value.match(PRICE);
  if (price) {
    const filled = Number(price[1]);
    return (
      // Same shape as a score row (w-13 label, gap-6, items-baseline, plain
      // text — no mono, no tighter tracking) so Price reads as one more row
      // in the same list, not a differently-styled outlier next to it.
      <p className="flex items-baseline gap-6">
        <span className="w-13 shrink-0 text-label text-fg-secondary">Price</span>
        <span className="text-body text-fg tabular-nums" aria-label={`Price: ${filled} of 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < filled ? 'text-fg' : 'text-fg-tertiary'}>$</span>
          ))}
        </span>
      </p>
    );
  }
  const score = value.match(SCORE);
  if (score) {
    const [, label, got, outOf] = score;
    return (
      <p className="flex items-baseline gap-6">
        {/* Fixed label column: figures only pay off if the numbers actually
            line up under each other. Plain text, same size as body — no mono,
            matching every other line on this page rather than standing out
            as a different typeface. */}
        <span className="w-13 shrink-0 text-label text-fg-secondary">{label}</span>
        <span className="text-body text-fg tabular-nums">
          {got}
          <span className="text-fg-tertiary">/{outOf}</span>
        </span>
      </p>
    );
  }
  if (isHeading(value)) {
    // Same size and family as every other line on the page, at Alex's
    // direction — only weight sets it apart as a label ("Process",
    // "Alarm Switch"), not a different type scale. Used to render as a
    // real `<h2 className="text-h3">`, which was a visibly different font
    // size from the surrounding paragraphs; the outer Blocks() wrapper now
    // owns this element's spacing, so no margin here either.
    return <p className="max-w-content text-body font-semibold text-fg leading-relaxed">{value.replace(LEADING_NUMBER, '')}</p>;
  }
  // Smaller (body, 15px, not body-lg's 17px) and more air between paragraphs
  // than the surrounding space-y-11 grid alone gives them — the combination
  // is what reads as restrained/premium rather than as a dense text wall.
  return <p className="max-w-content text-body text-fg-secondary leading-relaxed">{value}</p>;
}

/** A converted GIF. Never autoplays — it carries a poster and controls, so
 *  nothing moves until the reader asks for it (Principle 14). The originals
 *  totalled 42 MB and played themselves; these are a few hundred KB. */
function Motion({ block }: { block: Extract<Block, { kind: 'motion' }> }) {
  return (
    <video
      controls
      loop
      muted
      playsInline
      preload="none"
      poster={`/img/${block.base}-poster.webp`}
      width={block.width}
      height={block.height}
      className="block h-auto w-full rounded-lg border border-line-subtle bg-sunken"
    >
      {block.hasWebm && <source src={`/img/${block.base}.webm`} type="video/webm" />}
      <source src={`/img/${block.base}.mp4`} type="video/mp4" />
    </video>
  );
}

/** YouTube/Vimeo, lazily loaded and cookie-light. The space is reserved by
 *  aspect-ratio so nothing shifts when the frame arrives. */
function Embed({ block }: { block: Extract<Block, { kind: 'embed' }> }) {
  const src = block.src.replace('://www.youtube.com/', '://www.youtube-nocookie.com/');
  return (
    <div className="overflow-hidden rounded-lg border border-line-subtle bg-sunken">
      <iframe
        src={src}
        title={block.title || 'Video'}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full"
      />
    </div>
  );
}

export function Blocks({ blocks, alt }: { blocks: Block[]; alt: string }) {
  // Multi-shop posts (e.g. "3 Coffee Shops in Tokyo") list each shop's name
  // once as a plain intro line ("1. Supreme Coffee"), then repeat the exact
  // same numbered name as that shop's own section heading further down —
  // the live source markup double-lists it. Since the number is stripped at
  // render anyway (see LEADING_NUMBER above), keep only the LAST occurrence
  // of any heading text that repeats — the one immediately followed by that
  // shop's actual ratings and write-up — and drop the earlier, bare mention.
  const headingCounts = new Map<string, number>();
  for (const b of blocks) {
    if (b.kind === 'text' && isHeading(b.value)) {
      const key = b.value.replace(LEADING_NUMBER, '');
      headingCounts.set(key, (headingCounts.get(key) || 0) + 1);
    }
  }
  const seen = new Map<string, number>();

  // Three spacing tiers, replacing a single flat `space-y-11` that gave
  // every pair of blocks the same 48px gap regardless of what they were —
  // which read as cramped around photos/videos and as oddly loose between
  // a shop's own Experience/Taste/Environment/Price rows, at Alex's
  // direction: those four score-style rows are one cluster and should sit
  // close together, while text-to-media transitions need real "reading
  // room" so a photo or embed reads as a break, not a line in the same
  // paragraph flow. Margins are applied per-block below instead of a
  // uniform container gap, so each pair can pick its own tier.
  const isRatingRow = (v: string) => PRICE.test(v) || SCORE.test(v);
  const TIGHT = 'mt-2';   // 4px — consecutive rating rows in one cluster
  // TEXT was mt-14 (96px); Alex asked for run-on paragraphs (e.g. the
  // "Generative Extend" / "Object Addition" / "Featured: ..." run on the
  // GenAI page) to sit a third as far apart, once the increased MEDIA gap
  // below made plain text-to-text pairs feel disproportionately loose by
  // comparison.
  const TEXT = 'mt-9';    // 32px — paragraph to paragraph, heading to paragraph
  const MEDIA = 'mt-15';  // 128px — anything touching a photo, video, or embed

  let prevKind: 'text' | 'rating' | 'media' | null = null;

  return (
    <div>
      {blocks.map((b, i) => {
        const isMedia = b.kind !== 'text';
        const isRating = b.kind === 'text' && isRatingRow(b.value);
        const kind: 'text' | 'rating' | 'media' = isMedia ? 'media' : isRating ? 'rating' : 'text';

        let mt = '';
        if (prevKind !== null) {
          mt = kind === 'media' || prevKind === 'media' ? MEDIA
            : kind === 'rating' && prevKind === 'rating' ? TIGHT
            : TEXT;
        }

        if (b.kind === 'text') {
          if (isHeading(b.value)) {
            const key = b.value.replace(LEADING_NUMBER, '');
            const total = headingCounts.get(key) || 1;
            const count = (seen.get(key) || 0) + 1;
            seen.set(key, count);
            if (count < total) return null; // an earlier, redundant mention
          }
          prevKind = kind;
          return <div key={`t${i}`} className={mt}><Text value={b.value} /></div>;
        }
        prevKind = kind;
        if (b.kind === 'motion') return <div key={`m${i}`} className={mt}><Motion block={b} /></div>;
        if (b.kind === 'embed') return <div key={`e${i}`} className={mt}><Embed block={b} /></div>;
        return (
          <div key={`i${i}`} className={mt}>
            <Picture
              img={b}
              alt={alt}
              priority={i === 0}
              sizes="(min-width: 1200px) 1120px, 100vw"
              className="block h-auto w-full rounded-lg border border-line-subtle"
            />
          </div>
        );
      })}
    </div>
  );
}
