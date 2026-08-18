// Hosted-checkout adapter. No payment form, no card data, ever — the user is
// redirected to the provider's own hosted page.
//
// The provider is CLAUDE.md decision D2 and is UNANSWERED, so this ships
// unconfigured on purpose: `resolveCheckout` returns `null`, the purchase action
// renders in its guarded, non-firing state, and no live key exists anywhere in
// the project. Setting NEXT_PUBLIC_CHECKOUT_PROVIDER + _BASE_URL is the whole
// switch — a config change, not a rewrite.

export type CheckoutProvider = 'gumroad' | 'polar' | 'stripe';

const buildUrl: Record<CheckoutProvider, (base: string, id: string) => string> = {
  // Static link — keeps the site a pure static export.
  gumroad: (base, id) => `${base.replace(/\/$/, '')}/l/${id}`,
  // Static checkout link — also static-export safe.
  polar: (base, id) => `${base.replace(/\/$/, '')}/${id}`,
  // Stripe Checkout needs a server route to create a session, which would end
  // the static export. Left unimplemented until D2 chooses it deliberately.
  stripe: () => '',
};

export function resolveCheckout(checkoutId: string): string | null {
  const provider = process.env.NEXT_PUBLIC_CHECKOUT_PROVIDER as CheckoutProvider | undefined;
  const base = process.env.NEXT_PUBLIC_CHECKOUT_BASE_URL;
  if (!provider || !base || !buildUrl[provider]) return null;
  const url = buildUrl[provider](base, checkoutId);
  return url || null;
}
