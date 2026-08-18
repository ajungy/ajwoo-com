// /apps — the gallery of shipped apps and tools.
//
// DELIBERATELY EMPTY. The Phase 0 crawl found no shipped, distributable app on
// ajwoo.com: every /work/ entry is either an employer product (Seeing AI,
// Product Visualize, Dynamics 365, GenAI in Premiere Pro) that Alex designed but
// cannot distribute, or a concept with no download. Listing any of them with a
// "Get" action would invent a distribution channel that does not exist, and
// listing a price would invent a cost — which §6 of the design system says is
// never allowed to be wrong or hidden.
//
// So the page renders its empty state (Principle 7: name what's missing, offer
// the action that fills it). Add real entries below and the grid, badges,
// grouping and the guarded purchase action all light up with no other change.

export type App = {
  slug: string;
  name: string;
  /** What it does FOR THE USER, in one line. Not a feature list. */
  description: string;
  platform: string;
  /** Cost is never disclosed behind an interaction — it renders on the card. */
  price: { kind: 'free' } | { kind: 'paid'; label: string; checkoutId: string };
  /** Outcome-naming verb phrase. Never "Go" or "Click". */
  action: { label: string; href: string };
  /** Group by user intent, never by tech stack. ≤7 per group. */
  group: string;
};

/** Outcome-named groups. Never "Other" or "Misc". */
export const appGroups: { id: string; title: string; blurb: string }[] = [
  { id: 'make', title: 'Tools for making things', blurb: 'Small utilities that remove a step from a working day.' },
  { id: 'see',  title: 'Things to look through',  blurb: 'Viewers and readers for material you already have.' },
];

export const apps: App[] = [];
