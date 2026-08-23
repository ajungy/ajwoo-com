// /apps — shipped desktop tools.
//
// Content supplied by Alex, plus facts pulled from each app's own repo
// (README/NOTES) rather than invented. Two claims are load-bearing and appear
// on every detail page: native macOS app, runs fully on-device.
//
// NOTE ON PRICE (CLAUDE.md D2, still unanswered): no price has been set for any
// of these. The /apps grid no longer shows a price badge at Alex's direction —
// see app/apps/page.tsx for the reasoning. Price still lives here and still
// renders on each app's own detail page, because §6 of the design system says
// cost may never be hidden, only the *grid* was asked to simplify.

export type Price =
  | { kind: 'free' }
  | { kind: 'tbd' }
  | { kind: 'paid'; label: string; checkoutId: string };

export type App = {
  slug: string;
  /** Key into components/AppIcon.tsx. Used only when iconImage is absent. */
  icon: string;
  name: string;
  /** One line, fits in a single row next to the icon. Not a feature list. */
  description: string;
  /** The gesture that starts it — the thing people actually remember. */
  trigger: string;
  platform: string;
  /** Short, factual capability claims, shown on the detail page. */
  traits: string[];
  price: Price;
  /** Outcome-naming verb phrase. Never "Go" or "Click". */
  action: { label: string; href: string };
  /** True for an app with no build to download yet — the grid card's own
   *  button reads "Waitlist" instead of "Install" for these, at Alex's
   *  direction. Separate from `action.label` (the detail page's own,
   *  longer "Get Dictate" style copy), since the card needs a shorter,
   *  outcome-specific word that fits one row next to the icon and title. */
  waitlist?: boolean;
  /** Longer copy for the app's own page. */
  detail: string[];
  /** Real exported app icon. Falls back to the drawn glyph in AppIcon.tsx. */
  iconImage?: string;
  /** Static square card thumbnail (Figma node 359:987, "Apps cards with
   *  png"), base filename with no extension — resolved to `${thumbnail}.webp`
   *  with a `.jpg` fallback. Replaces an earlier video-loop treatment that
   *  only Capture had real footage for; the demo clip itself is still on
   *  disk (public/img/capture-demo.*) if a future detail-page use wants it,
   *  just no longer wired into any component. */
  thumbnail?: string;
};

export const apps: App[] = [
  {
    slug: 'capture',
    icon: 'capture',
    name: 'Capture',
    description: 'Screen recording, auto editing',
    trigger: 'Record a display or a region, with camera and mic',
    platform: 'macOS',
    traits: ['Native macOS app', 'Runs fully on-device', 'Exports movie or GIF'],
    price: { kind: 'tbd' },
    action: { label: 'Get Capture', href: '#' },
    thumbnail: 'appcard-capture',
    detail: [
      'Capture records a full display or a region, with camera and microphone, and writes the master at native pixels alongside a metadata file. Nothing is baked in at record time, so every edit stays reversible.',
      'Zoom is a crop, never an upscale. A 2x zoom on a 3456x2234 master exporting to 1080p is still sampling real pixels, so it stays sharp instead of turning to mush.',
      'The cursor is not in the video. It is recorded as a path and drawn at export, which means it can be resized, restyled, smoothed and animated afterwards, and it stays a constant on-screen size at any zoom level.',
      'Recording and editing both happen on your Mac. No upload step, no account, and no link that expires.',
    ],
    iconImage: 'appicon-capture',
  },
  {
    slug: 'dictate',
    icon: 'dictate',
    name: 'Dictate',
    description: 'Speech to text on any surface',
    trigger: 'Double-tap Command to start talking',
    platform: 'macOS',
    traits: ['Native macOS app', 'Runs fully on-device'],
    price: { kind: 'tbd' },
    action: { label: 'Get Dictate', href: '#' },
    waitlist: true,
    thumbnail: 'appcard-dictate',
    detail: [
      'Dictate puts speech into whatever already has your cursor: a document, a terminal, a message box. There is no window to switch to and nothing to paste.',
      'The speech model runs on your Mac. Your voice is never uploaded, so it works on a plane and it keeps working if this site disappears.',
    ],
    iconImage: 'appicon-dictate',
  },
  {
    slug: 'narrate',
    icon: 'narrate',
    name: 'Narrate',
    description: 'Narrate anything highlighted',
    trigger: 'Highlight text, double-tap a modifier key',
    platform: 'macOS',
    traits: ['Native macOS app', 'Runs fully on-device', 'Neural voice, no cloud'],
    price: { kind: 'tbd' },
    action: { label: 'Get Narrate', href: '#' },
    thumbnail: 'appcard-narrate',
    waitlist: true,
    detail: [
      'Narrate reads whatever you have highlighted in any macOS app out loud, the moment you double-tap a modifier key. No window, no dock icon: it lives in the menu bar and stays out of the way until you need it.',
      'Voices are neural only, running locally in a sidecar (Kokoro-82M). The built-in macOS voices are not offered as a choice; they only appear as an emergency fallback if the neural engine cannot start.',
      'Nothing you select is sent anywhere. The model runs on your Mac.',
    ],
    iconImage: 'appicon-narrate',
  },
];

// Deliberately no groups. reference/disclosure.md caps a group at 7 and says a
// group of one is not a group — at three apps, grouping is an unearned control
// and the flat grid is the simpler thing that works (Principle 12). Introduce
// outcome-named groups when this list passes about seven.
