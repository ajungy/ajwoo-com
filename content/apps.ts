// /apps — shipped desktop tools.
//
// Content supplied by Alex. Two claims are load-bearing and appear on every
// card because they are the reason someone would choose these over a web tool:
// they are native macOS apps, and they do their work on-device.
//
// NOTE ON PRICE (CLAUDE.md D2, still unanswered): no price has been set for any
// of these. §6 of the design system says cost is never hidden and never wrong,
// so rather than invent one the cards render an explicit "Pricing TBD". Set
// `price` to { kind: 'free' } or { kind: 'paid', ... } and the badge and the
// guarded checkout action resolve themselves.

export type Price =
  | { kind: 'free' }
  | { kind: 'tbd' }
  | { kind: 'paid'; label: string; checkoutId: string };

export type App = {
  slug: string;
  name: string;
  /** What it does FOR THE USER, in one line. Not a feature list. */
  description: string;
  /** The gesture that starts it — the thing people actually remember. */
  trigger: string;
  platform: string;
  /** Short, factual capability claims. Rendered as neutral badges, never as
   *  status colour: "local" is a property, not a success state. */
  traits: string[];
  price: Price;
  /** Outcome-naming verb phrase. Never "Go" or "Click". */
  action: { label: string; href: string };
};

export const apps: App[] = [
  {
    slug: 'capture',
    name: 'Capture',
    description: 'Records what happened on your screen and hands back a cut version, already edited.',
    trigger: 'Records, then edits itself',
    platform: 'macOS',
    traits: ['Native macOS app', 'Runs fully on-device'],
    price: { kind: 'tbd' },
    action: { label: 'Get Capture', href: '#' },
  },
  {
    slug: 'dictate',
    name: 'Dictate',
    description: 'Turns speech into text anywhere you can type, without sending your voice to a server.',
    trigger: 'Double-tap Command to start talking',
    platform: 'macOS',
    traits: ['Native macOS app', 'Runs fully on-device'],
    price: { kind: 'tbd' },
    action: { label: 'Get Dictate', href: '#' },
  },
  {
    slug: 'narrate',
    name: 'Narrate',
    description: 'Reads any text you select out loud, so you can take in a long page without reading it.',
    trigger: 'Select text, press once to listen',
    platform: 'macOS',
    traits: ['Native macOS app', 'Runs fully on-device'],
    price: { kind: 'tbd' },
    action: { label: 'Get Narrate', href: '#' },
  },
];

// Deliberately no groups. reference/disclosure.md caps a group at 7 and says a
// group of one is not a group — at three apps, grouping is an unearned control
// and the flat grid is the simpler thing that works (Principle 12). Introduce
// outcome-named groups when this list passes about seven.
