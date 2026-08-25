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
  /** Longer copy for the app's own page. A plain string is a full paragraph.
   *  `{ lead }` is the opening statement, bolded and set apart. `{ label,
   *  body }` is one line of a feature list — label on its own line, bolded,
   *  body directly below it, same size/family as everything else on the
   *  page (same "weight only, never a different type scale" rule
   *  Blocks.tsx uses for the work-page feature sections) — with a bit more
   *  space above each one than a plain paragraph gets, so the feature list
   *  reads as a series of small sections, not a wall of text. */
  detail: (string | { lead: string } | { label: string; body: string })[];
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
  /** Full-width demo video on the app's own detail page, between the
   *  header (icon/name/Waitlist) and the body copy — base filename with no
   *  extension, resolved the same way as `thumbnailVideo`. Never
   *  autoplays: carries a poster and controls, same as every other video
   *  on this site (Principle 14 — nothing moves until the reader asks). */
  demoVideo?: string;
};

export const apps: App[] = [
  {
    slug: 'capture',
    icon: 'capture',
    name: 'Capture',
    description: 'Screen recording, auto editing',
    trigger: 'Record a display or a region, with camera and mic',
    platform: 'macOS',
    traits: ['macOS', 'Auto video edit', 'Subtitle', 'Screen record', 'Local', 'Fully on-device', 'No cloud'],
    thumbnailVideo: 'appcard-capture',
    demoVideo: 'capture-demo',
    detail: [
      { lead: 'Capture is the fastest way to turn an idea on your screen into a video that’s ready to share.' },
      'Record your screen, camera, and microphone with one click. Capture automatically transforms your raw recording into a polished video.',
      { label: 'Record once. Get a polished video.', body: 'Capture takes care of the tedious editing for you:' },
      { label: 'Automatic Zooms', body: 'Capture identifies important areas of your screen and automatically zooms in to keep viewers focused on what matters.' },
      { label: 'Beautiful Backgrounds', body: 'Give your recordings a clean, professional look with customizable backgrounds.' },
      { label: 'Better Cursor Visibility', body: 'Make your cursor easier to follow with automatic cursor styling and emphasis.' },
      { label: 'Automatic Camera Styling', body: 'Customize your camera’s size, shape, position, and overall appearance to create the look you want.' },
      { label: 'Clean Up Your Audio', body: 'Improve your recording with automatic audio cleanup, volume adjustments, and pause removal.' },
      { label: 'Remove Filler Words', body: 'Automatically remove distracting filler words like “um” and “uh” from your recording.' },
      { label: 'Automatic Transcription', body: 'Capture transcribes what you say, giving you an editable transcript alongside your video.' },
      { label: 'Dynamic Subtitles', body: 'Generate subtitles automatically and customize their typography, size, animations, and visual effects.' },
      { label: 'Export and Share', body: 'Make a few tweaks if you want, then export your finished video and share it wherever you like.' },
      'Whether you’re creating product demos, tutorials, educational content, software walkthroughs, presentations, or social videos, Capture helps you go from recording to finished video in seconds.',
      'Stop spending an hour editing screen recordings. Just Capture it.',
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
