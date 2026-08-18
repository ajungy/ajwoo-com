import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary';

const base =
  'inline-flex items-center justify-center h-control-md rounded-control border ' +
  'text-label font-medium transition duration-fast ease-standard ' +
  'motion-safe:active:scale-press';

const variants: Record<Variant, string> = {
  // Solid. Hover moves the fill one step toward mid-gray; press returns it.
  primary:
    'bg-primary text-primary-fg border-transparent px-6 ' +
    'can-hover:hover:bg-primary-hover active:bg-primary-active',
  // Real alternatives. 1px border so outer dimensions match primary exactly.
  secondary:
    'bg-secondary text-secondary-fg border-secondary-line px-6 ' +
    'can-hover:hover:bg-secondary-hover can-hover:hover:border-secondary-line-hover ' +
    'active:bg-secondary-active',
  // No border ever. Typography is the affordance; the 10px shape fades in.
  tertiary:
    'bg-tertiary text-tertiary-fg border-transparent px-5 font-semibold ' +
    'can-hover:hover:bg-tertiary-hover active:bg-tertiary-active',
};

/**
 * Every action on this site is a navigation, so the component is an anchor.
 * `cursorLabel` is what the custom cursor echoes — it must never be the ONLY
 * place the verb appears, which is why it defaults to the visible children.
 */
export function Action({
  href, children, variant = 'secondary', external = false, cursorLabel, className = '',
}: {
  href: string; children: ReactNode; variant?: Variant; external?: boolean;
  cursorLabel?: string; className?: string;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const label = cursorLabel ?? (typeof children === 'string' ? children : undefined);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} data-cursor-label={label}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} data-cursor-label={label}>
      {children}
    </Link>
  );
}
