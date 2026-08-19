import { Picture } from './Picture';
import type { Block } from '@/content/projects';

/** "Environment: 4.5/5" — the coffee reviews score every shop this way. */
const SCORE = /^([A-Za-z][A-Za-z /&-]{1,24}):\s*([\d.]+)\s*\/\s*(\d+)\s*$/;
/** A short line with no terminal punctuation is a section heading in the
 *  original layout ("Process", "AudioHaptics", "Environment"). */
const isHeading = (s: string) => s.length <= 44 && !/[.!?,;:]$/.test(s) && !SCORE.test(s);

function Text({ value }: { value: string }) {
  const score = value.match(SCORE);
  if (score) {
    const [, label, got, outOf] = score;
    return (
      <p className="flex items-baseline gap-6">
        {/* Fixed label column: tabular figures only pay off if the numbers
            actually line up under each other. */}
        <span className="w-13 shrink-0 text-label text-fg-secondary">{label}</span>
        {/* Mono earns its place only here: scores sit in a column and should
            align. Used nowhere else on the site. */}
        <span className="font-mono text-body text-fg tabular-nums">
          {got}
          <span className="text-fg-tertiary">/{outOf}</span>
        </span>
      </p>
    );
  }
  if (isHeading(value)) {
    return <h2 className="mt-12 text-h3 text-fg first:mt-0">{value}</h2>;
  }
  return <p className="max-w-content text-body-lg text-fg-secondary">{value}</p>;
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
  return (
    <div className="space-y-8">
      {blocks.map((b, i) => {
        if (b.kind === 'text') return <Text key={`t${i}`} value={b.value} />;
        if (b.kind === 'motion') return <Motion key={`m${i}`} block={b} />;
        if (b.kind === 'embed') return <Embed key={`e${i}`} block={b} />;
        return (
          <Picture
            key={`i${i}`}
            img={b}
            alt={alt}
            priority={i === 0}
            sizes="(min-width: 1200px) 1120px, 100vw"
            className="block h-auto w-full rounded-lg border border-line-subtle"
          />
        );
      })}
    </div>
  );
}
