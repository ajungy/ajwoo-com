import type { CSSProperties } from 'react';

type Source = { base: string; widths?: number[]; fallbackWidth?: number; width: number; height: number };

/**
 * Plain <picture> with AVIF -> WebP -> JPEG. `next/image` does not optimize
 * under `output: 'export'`, so the pipeline runs at build time (scripts/build-assets.mjs).
 * width/height are ALWAYS explicit: an image without them is a layout shift,
 * and layout shift is a Principle 4 failure.
 */
export function Picture({
  img, alt, sizes, className, style, priority = false,
}: {
  img: Source; alt: string; sizes: string; className?: string; style?: CSSProperties; priority?: boolean;
}) {
  const widths = img.widths ?? [img.width];
  const srcset = (ext: string) => widths.map((w) => `/img/${img.base}-${w}.${ext} ${w}w`).join(', ');
  const single = !img.widths;
  const fallback = single ? `/img/${img.base}.jpg` : `/img/${img.base}-${img.fallbackWidth ?? widths[widths.length - 1]}.jpg`;
  return (
    <picture>
      <source type="image/avif" srcSet={single ? `/img/${img.base}.avif` : srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={single ? `/img/${img.base}.webp` : srcset('webp')} sizes={sizes} />
      <img
        src={fallback}
        alt={alt}
        width={img.width}
        height={img.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        className={className}
        style={style}
      />
    </picture>
  );
}
