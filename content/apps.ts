// /apps — desktop tools built in Claude Code, pre-release.
//
// Content supplied by Alex, plus facts pulled from each app's own repo
// (README/NOTES) rather than invented. Two claims are load-bearing and appear
// on every detail page: native macOS app, runs fully on-device.
//
// NOTE ON PRICE (CLAUDE.md D2, still unanswered): no price badge anywhere on
// this site any more, at Alex's direction — every app is pre-release, and a
// price nobody can act on yet is noise, not information. Revisit once D2 is
// actually answered and something is purchasable; the `Price` type this used
// to carry can come back then rather than staying half-wired in the meantime.

// All three apps are pre-release right now, so every "Install"/"Waitlist"
// action on the grid and every detail page points here instead of a real
// download or checkout — one honest next step (Principle 9), not a
// disabled button with no explanation.
export const WAITLIST_FORM_URL = 'https://forms.gle/WsvMej7L7Y2uf6fB6';

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
  /** Longer copy for the app's own page. */
  detail: string[];
  /** Real exported app icon. Falls back to the drawn glyph in AppIcon.tsx. */
  iconImage?: string;
  /** Static square card thumbnail, base filename with no extension —
   *  resolved to `${thumbnail}.webp` with a `.jpg` fallback. Mutually
   *  exclusive with `thumbnailVideo` below. */
  thumbnail?: string;
  /** Autoplaying square card thumbnail (Capture's real screen-recording
   *  demo), base filename with no extension — resolved to
   *  `${thumbnailVideo}.mp4`/`.webm` with a `${thumbnailVideo}-poster.webp`
   *  poster frame. Takes priority over `thumbnail` when both are present. */
  thumbnailVideo?: string;
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
    thumbnailVideo: 'appcard-capture',
    detail: [
      'Capture records a full display or a region, with camera and microphone, and writes the master at native pixels alongside a metadata file. Nothing is baked in at record time, so every edit stays reversible.',
      'Zoom is a crop, never an upscale. A 2x zoom on a 3456x2234 master exporting to 1080p is still sampling real pixels, so it stays sharp instead of turning to mush.',
      'The cursor is not in the video. It is recorded as a path and drawn at export, which means it can be resized, restyled, smoothed and animated afterwards, and it stays a constant on-screen size at any zoom level.',
      'Built end to end in Claude Code, alongside this site — the demo above is Capture recording its own editing pass on this very page. Recording and editing both happen on your Mac; no upload step, no account, no link that expires.',
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
    thumbnail: 'appcard-dictate',
    detail: [
      'Dictate puts speech into whatever already has your cursor: a document, a terminal, a message box. There is no window to switch to and nothing to paste.',
      'The speech model runs on your Mac. Your voice is never uploaded, so it works on a plane and it keeps working if this site disappears.',
      'Built in Claude Code as a companion to Capture and Narrate — same principle across all three: the model runs locally, nothing you say or select ever leaves the machine.',
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
    thumbnail: 'appcard-narrate',
    detail: [
      'Narrate reads whatever you have highlighted in any macOS app out loud, the moment you double-tap a modifier key. No window, no dock icon: it lives in the menu bar and stays out of the way until you need it.',
      'Voices are neural only, running locally in a sidecar (Kokoro-82M). The built-in macOS voices are not offered as a choice; they only appear as an emergency fallback if the neural engine cannot start.',
      'Nothing you select is sent anywhere. The model runs on your Mac. Like Capture and Dictate, this one was built in Claude Code, one conversation at a time.',
    ],
    iconImage: 'appicon-narrate',
  },
];

// Deliberately no groups. reference/disclosure.md caps a group at 7 and says a
// group of one is not a group — at three apps, grouping is an unearned control
// and the flat grid is the simpler thing that works (Principle 12). Introduce
// outcome-named groups when this list passes about seven.
