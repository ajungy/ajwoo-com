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
  /** Key into components/AppIcon.tsx. Placeholder marks until real artwork. */
  icon: string;
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
  /** Longer copy for the app's own page. */
  detail: string[];
  /** Real exported app icon, when one exists. Falls back to the drawn glyph. */
  iconImage?: string;
  /** A recording of the app doing its job, shown as the card's media. */
  media?: { base: string; poster: string; width: number; height: number };
};

export const apps: App[] = [
  {
    slug: 'capture',
    icon: 'capture',
    name: 'Capture',
    description: 'Records your screen, then edits itself — trim, cut, zoom and a cursor you can restyle after the fact.',
    trigger: 'Record a display or a region, with camera and mic',
    platform: 'macOS',
    traits: ['Native macOS app', 'Runs fully on-device', 'Exports movie or GIF'],
    price: { kind: 'tbd' },
    action: { label: 'Get Capture', href: '#' },
    detail: [
      'Capture records a full display or a region — with camera and microphone — and writes the master at native pixels alongside a metadata file. Nothing is baked in at record time, so every edit stays reversible.',
      'Zoom is a crop, never an upscale. A 2x zoom on a 3456x2234 master exporting to 1080p is still sampling real pixels, so it stays sharp instead of turning to mush.',
      'The cursor is not in the video. It is recorded as a path and drawn at export, which means it can be resized, restyled, smoothed and animated afterwards — and it stays a constant on-screen size at any zoom level.',
      'Recording and editing both happen on your Mac. No upload step, no account, and no link that expires.',
    ],
    iconImage: 'appicon-capture',
    media: { base: 'capture-demo', poster: 'capture-demo-poster.webp', width: 1280, height: 804 },
  },
  {
    slug: 'dictate',
    icon: 'dictate',
    name: 'Dictate',
    description: 'Turns speech into text anywhere you can type, without sending your voice to a server.',
    trigger: 'Double-tap Command to start talking',
    platform: 'macOS',
    traits: ['Native macOS app', 'Runs fully on-device'],
    price: { kind: 'tbd' },
    action: { label: 'Get Dictate', href: '#' },
    detail: [
      'Dictate puts speech into whatever already has your cursor — a document, a terminal, a message box. There is no window to switch to and nothing to paste.',
      'The speech model runs on your Mac. Your voice is never uploaded, so it works on a plane and it keeps working if this site disappears.',
    ],
  },
  {
    slug: 'narrate',
    icon: 'narrate',
    name: 'Narrate',
    description: 'Reads any text you select out loud, so you can take in a long page without reading it.',
    trigger: 'Select text, press once to listen',
    platform: 'macOS',
    traits: ['Native macOS app', 'Runs fully on-device'],
    price: { kind: 'tbd' },
    action: { label: 'Get Narrate', href: '#' },
    detail: [
      'Narrate reads the text you have selected, anywhere in macOS, with one key. Useful for long articles, for proofreading your own writing, and for resting your eyes.',
      'Synthesis happens locally, so there is no per-character billing and nothing you read leaves the machine.',
    ],
  },
];

// Deliberately no groups. reference/disclosure.md caps a group at 7 and says a
// group of one is not a group — at three apps, grouping is an unearned control
// and the flat grid is the simpler thing that works (Principle 12). Introduce
// outcome-named groups when this list passes about seven.
