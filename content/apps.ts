// /apps — tools built in Claude Code. Capture/Dictate/Narrate are desktop
// apps, pre-release. Convert is different: a real, already-shipped web app
// at convert.ajwoo.com, so it's the one entry with `openUrl` set (see below).
//
// Content supplied by Alex, plus facts pulled from each app's own repo
// (README/NOTES) rather than invented. Two claims are load-bearing and appear
// on every detail page for the three desktop apps: native macOS app, runs
// fully on-device. Convert's equivalent claim, pulled directly from its own
// in-app "About" panel rather than invented, is that every conversion runs
// inside the browser tab itself — nothing is ever uploaded to a server.
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
  /** Same slot as `demoVideo` (full-width, between the header and the body
   *  copy) but a YouTube video instead of a self-hosted file — a YouTube
   *  video ID, e.g. the "tyNCdZQMKMA" in youtu.be/tyNCdZQMKMA. Takes
   *  priority over `demoVideo` when both are set. Embedded via
   *  youtube-nocookie.com; YouTube's own player already shows a thumbnail
   *  and needs a click to play, so this satisfies Principle 14 (nothing
   *  autoplays) the same way the self-hosted video's `controls` attribute
   *  does, without this site needing to supply its own poster frame. */
  demoVideoYoutube?: string;
  /** When set, this app already exists and is real — the card footer button
   *  and the detail page's header action both read "Open" and link straight
   *  here (external) instead of "Waitlist" -> WAITLIST_FORM_URL. Every other
   *  app in this array is pre-release and omits this. */
  openUrl?: string;
  /** Path to a downloadable build (a plain `download` link, same pattern as
   *  CopySkillButton.tsx) — when set, the card footer button reads "Install"
   *  and downloads this file directly instead of "Waitlist" ->
   *  WAITLIST_FORM_URL. Takes priority over the Waitlist fallback but not
   *  over `openUrl` (an app that's fully live gets "Open", not "Install"). */
  downloadZip?: string;
  /** Shows "Beta" next to the app's name on its /apps grid card only (not
   *  the detail page's own h1) — at Alex's direction, for apps that are
   *  functional but not yet a finished v1. */
  beta?: boolean;
  /** The "Request Alex" card only: a plain static square (theme-adaptive
   *  background, a centered "+" glyph) instead of a real screenshot/demo
   *  — there's nothing to show a preview OF. Matches the Figma reference
   *  (node 516:2907) rather than this card's usual skeleton-shimmer
   *  loading treatment, which would otherwise loop forever since no real
   *  media ever arrives to replace it (a Principle 14 problem). */
  thumbnailPlus?: boolean;
  /** The "Request Alex" card only: overrides BOTH the stretched card-link
   *  and the footer button to point here (external) instead of the
   *  usual `/apps/<slug>/` detail page — there's no detail page worth
   *  having for a card whose entire job is "click through to a form". */
  cardHref?: string;
  /** Overrides the footer button's label in the Waitlist fallback branch
   *  (still `WAITLIST_FORM_URL`/`cardHref`, just different words) — used
   *  by "Request Alex" to read "Request" instead of "Waitlist". */
  ctaLabel?: string;
  /** `thumbnailVideo` only: seeks to (just before) the clip's own last
   *  frame once its metadata loads, so playback genuinely BEGINS there —
   *  it plays that final sliver, then `loop` wraps it back to the start
   *  and it runs normally from then on. Used by Dictate, at Alex's
   *  direction ("start the video from the last frame of the video"). */
  thumbnailStartAtEnd?: boolean;
};

// Convert leads the array — at Alex's direction, ordering is now
// Convert, Capture, Dictate, Narrate — so it renders as the /apps grid's
// first (top-left) card.
//
// A later pass removed every em dash from this file's RENDERED copy (Alex:
// "prevent using em dashes everywhere on the website... not a single em
// dash"), rewrote Dictate's and Narrate's detail copy from scripts Alex
// supplied (Narrate's "please edit more" — lightly tightened rather than
// pasted verbatim), and reworded Convert's "Bulk, not one at a time" label
// and Capture's closing line. Em dashes inside `//` and `/** */` comments
// are untouched — they never render on the page, only in this source file.
export const apps: App[] = [
  {
    slug: 'convert',
    icon: 'convert',
    name: 'Convert',
    description: 'Bulk convert images, videos, audio, docs, sheets, archives',
    trigger: 'Drop files, pick a format, download',
    platform: 'Web',
    traits: [
      'Runs in your browser',
      'Nothing uploaded',
      'Works offline',
      'Up to 100 files at once',
      'Images, video, audio, docs, sheets, archives',
    ],
    thumbnailVideo: 'appcard-convert',
    demoVideoYoutube: '-RXXSfrtokY',
    openUrl: 'https://convert.ajwoo.com/',
    detail: [
      { lead: 'A private file converter that never uploads.' },
      'Drop files, pick a format, download. Everything runs inside the browser tab. Nothing is sent to a server, and it still works offline.',
      { label: 'On your device only', body: 'Files never leave your machine. Nothing is uploaded or stored anywhere but that browser tab.' },
      { label: 'Bulk, multiple at a time', body: 'Convert up to 100 files in a batch. It stays responsive and runs several at once.' },
      { label: 'Nearly any file', body: 'Images, video, audio, documents, spreadsheets, and archives, in and out. Scale, quality, background removal, and batch rename are built in.' },
      'Works in any current browser, on a computer, phone, or tablet. Built in Claude Code, like Capture, Dictate, and Narrate.',
    ],
    iconImage: 'appicon-convert',
  },
  {
    slug: 'capture',
    icon: 'capture',
    name: 'Capture',
    description: 'Screen recording, auto editing',
    trigger: 'Record a display or a region, with camera and mic',
    platform: 'macOS',
    traits: ['macOS', 'Auto video edit', 'Subtitle', 'Screen record', 'Local', 'Fully on-device', 'No cloud'],
    thumbnailVideo: 'appcard-capture',
    downloadZip: '/downloads/capture-beta.zip',
    beta: true,
    demoVideo: 'capture-demo',
    // Detail-page demo replaced with a YouTube video, at Alex's direction —
    // takes priority over demoVideo above in rendering (see
    // app/apps/[slug]/page.tsx). demoVideo itself is left in place rather
    // than deleted: still the /apps grid card's own thumbnail source is
    // separate (thumbnailVideo), and there's no reason to lose the
    // self-hosted file's data if this ever needs to revert.
    demoVideoYoutube: 'tyNCdZQMKMA',
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
      'Stop spending hours editing screen recordings, just capture it.',
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
    // Real screen recording (Alex's "Dictate Beta Thumbnail.mov"), same
    // pattern as Capture's card — was a static `thumbnail` before.
    thumbnailVideo: 'appcard-dictate',
    // This card only, at Alex's direction ("just for this Dictate Beta
    // thumbnail can you start the video from the last frame").
    thumbnailStartAtEnd: true,
    // Renders between the header (icon/name/Waitlist) and the body copy
    // below — the same slot Convert/Capture's demoVideoYoutube already
    // uses (see app/apps/[slug]/page.tsx) — at Alex's direction ("between
    // waitlist button and the body text... include this YouTube video
    // link").
    demoVideoYoutube: 'w6eWPNnpNyE',
    beta: true,
    detail: [
      { lead: 'Dictate listens to your voice, transcribes it to text, cleans up grammar and punctuation, and pastes it anywhere.' },
      'Notes, docs, Claude, the terminal, you name it. Fast, accurate, and done.',
      { label: 'Settings', body: 'Remap the activation key, switch languages, pick your voice-to-text model, toggle grammar correction, toggle auto-copy/paste, and set how long the widget stays on screen.' },
      'Watch it turn any voice recording into clean, clear, professional text on any surface.',
      'The speech model runs on your Mac. Your voice is never uploaded, so it works on a plane and it keeps working if this site disappears. Built in Claude Code as a companion to Capture and Narrate: same principle across all three, the model runs locally, nothing you say or select ever leaves the machine.',
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
    beta: true,
    detail: [
      { lead: 'Narrate reads whatever you have highlighted on your Mac out loud, the moment you double-tap a modifier key.' },
      'Your browser, the terminal, notes, Claude, a PDF, anything selectable. No window, no dock icon. It lives in the menu bar and stays out of the way until you need it.',
      'Voices are neural, natural, and professional, running locally in a sidecar (Kokoro-82M). The built-in macOS voices are not offered as a choice; they only appear as an emergency fallback if the neural engine cannot start.',
      'Nothing you select is sent anywhere. The model runs on your Mac. Like Capture and Dictate, this one was built in Claude Code, one conversation at a time.',
    ],
    iconImage: 'appicon-narrate',
  },
  // "Request Alex" — deliberately LAST in this array, always, at Alex's
  // direction ("this card should be the last card, always the last card
  // inside the apps page on the bottom right"). Not a real app: a card
  // that behaves like every other one (same AppCard component, same grid
  // slot, same hover/press treatment) but both its stretched card-link
  // and its footer button point straight at the same waitlist form the
  // other cards use as their pre-release fallback, asking for feature/app
  // requests instead of joining a waitlist for something specific.
  // Because it's last, the /apps/[slug]/page.tsx "More apps" section
  // (which shows the first 3 OTHER entries in array order) never surfaces
  // it on any of the four real apps' own detail pages — it only shows up
  // on the main /apps grid, which is the one place Alex wants it.
  {
    slug: 'request',
    icon: 'plus',
    name: 'Request Alex',
    description: 'Ask Alex for features or apps',
    trigger: 'Tell Alex what you want built',
    platform: 'Web',
    traits: ['Feature requests', 'New app ideas', 'Direct to Alex'],
    thumbnailPlus: true,
    cardHref: WAITLIST_FORM_URL,
    ctaLabel: 'Request',
    detail: [
      { lead: 'Have an idea for a feature, or a whole app you wish existed?' },
      'This form goes straight to Alex — not a support queue, not a backlog. Missing something from Convert, Capture, Dictate, or Narrate, or want something new entirely? Say so here.',
    ],
    iconImage: 'appicon-request',
  },
];

// Deliberately no groups. reference/disclosure.md caps a group at 7 and says a
// group of one is not a group — at four apps (five with Request Alex), grouping
// is still an unearned control and the flat grid is the simpler thing that
// works (Principle 12). Introduce outcome-named groups when this list passes
// about seven.
