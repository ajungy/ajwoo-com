import type { Price } from '@/content/apps';

/**
 * Cost is never disclosed behind an interaction — it renders on the card, at
 * rest, always (reference/disclosure.md). Where no price has been set the badge
 * says so rather than implying "free", because a wrong price is worse than a
 * missing one.
 */
export function PriceBadge({ price }: { price: Price }) {
  const label =
    price.kind === 'free' ? 'Free' : price.kind === 'paid' ? price.label : 'Pricing TBD';
  return (
    <span className="shrink-0 rounded-xs bg-neutral-bg px-4 py-1 text-caption font-medium text-neutral">
      {label}
    </span>
  );
}
