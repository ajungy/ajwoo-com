// All copy here is migrated from ajwoo.com (Phase 0 crawl). Facts unchanged.
// The headline carries the full credential now: Netflix, Adobe, Microsoft.
// The separate bio paragraph that used to spell that out underneath was
// redundant and got cut, at Alex's direction. Punchier: one line says
// everything the two used to.

export const site = {
  name: 'Alex Woo',
  fullName: 'Alex J. Woo',
  // Used for <title>/OpenGraph description — not rendered on the page
  // itself any more (see `headline` below, which replaced it there).
  identity: 'Alex Woo designs creative tools at Netflix, Adobe, Microsoft, and more.',
  // The landing page's single most important element, replacing the earlier
  // animated "Alex Woo [verb] creative tools at Netflix..." headline — at
  // Alex's direction, a calmer, wordmark-like statement in EB Garamond
  // italic (see .hero-serif in globals.css) instead of a typing loop.
  headline: 'Enable creativity.',
  greeting: "Hi, I'm Alex.",
  greetingEmphasis: "Let's grab coffee.",
  bio: "I'm a Design Lead at Netflix, shaping the future of creative tools. Previously at Adobe and Microsoft, I worked across video, AI, and AR. On weekends, I'm usually building something or hunting for great coffee.",
  // Switched from Calendly to a Google Calendar booking page, and the event
  // itself from 30 to 15 minutes, at Alex's direction.
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendar.app.google/NCKhKCPKq9SffYAZ7',
  ctaLabel: 'Book 15m',
  email: 'alex@ajwoo.com',
} as const;

export const nav = [
  { href: '/design/', label: 'Design' },
  { href: '/coffee/', label: 'Coffee' },
  { href: '/apps/', label: 'Apps' },
] as const;

// From Alex's LinkedIn, reverse-chronological (most recent first), matching
// Featured's own descending-year order below.
export const experience = [
  { company: 'Netflix', title: 'Product Design Lead', years: '2025 – Present' },
  { company: 'Adobe', title: 'Staff UX Designer', years: '2021 – 2025' },
  { company: 'Microsoft', title: 'Product Designer', years: '2016 – 2021' },
  { company: 'Netmarble Games', title: 'Designer', years: '2015' },
] as const;

export const education = [
  { school: 'Rhode Island School of Design', detail: 'BFA Industrial Design' },
  { school: 'Brown University', detail: 'Cross-registered student' },
  { school: 'Le Cordon Bleu Paris', detail: 'Pâtisserie de Base, Certifié' },
] as const;

// Rendered under the heading "Worked with" (was "Clients"), at Alex's
// direction — variable name kept as `clients` since that's what the data
// actually is; only the on-page label changed (see app/page.tsx).
export const clients = [
  'Kikkerland Design', 'The Container Store', 'USAA', 'Starbucks', 'MIT',
  'Brown University', 'Cheil Worldwide', 'IUCN', 'WIPO', 'Kim & Chang',
  'Yulchon LLC', 'TEDx',
] as const;

export const featured = [
  { year: '2025', what: 'AI UX Summit' },
  { year: '2022', what: 'Terra Carta' },
  { year: '2020', what: 'Starbucks Technology' },
  { year: '2019', what: 'RISD' },
  { year: '2018', what: 'Microsoft Garage Pitch, Winner' },
  { year: '2017', what: 'Microsoft MR Hack, 2nd place' },
  { year: '2017', what: 'UST' },
  { year: '2016', what: 'Microsoft HoloHack, 1st place' },
  { year: '2016', what: 'K-Design Award' },
  { year: '2016', what: 'Design Milk' },
  { year: '2016', what: 'RI Business Plan' },
  { year: '2016', what: 'Kikkerland Magazine' },
  { year: '2016', what: 'ICFF' },
  { year: '2012', what: 'IUCN' },
  { year: '2011', what: 'TEDx Geneva' },
] as const;

// Phase 0 recommendation: keep the two that serve the hiring-manager job, cut
// Facebook, Pinterest and Spotify. Five links dilute one primary action.
// Email is rendered separately (components/CopyEmailButton.tsx) — it copies
// the address and shows a toast rather than opening a mailto: link, at
// Alex's direction, so it isn't a plain href like the other two.
export const social = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alex-j-woo-8188ab99', external: true },
  { label: 'Instagram', href: 'https://www.instagram.com/alexwoodesign/', external: true },
] as const;

// Ten of the 25 principles in the "minimal" design system (the house style
// this whole site is built from — see public/minimal-design-system.md, the
// same file the Skills section below lets a visitor copy). Picked for being
// the most load-bearing and broadly applicable, not the first ten in the
// file. Full numbering preserved so a reader who wants the rest knows
// exactly what section to go find.
// Five bodies reworded at Alex's direction, in place — see each entry's
// own note. Word counts kept close to the originals throughout.
export const principles = [
  { n: 1, title: 'Solve the job to be done', body: 'Know what the user needs, and the shortest honest path there. If it doesn\'t serve that, it\'s decoration.' },
  { n: 2, title: 'Achieve the goal', body: 'Name every goal in play and rank them. The user\'s goal leads; nothing else competes with it for attention.' },
  { n: 3, title: 'One hierarchy, one emphasis', body: 'Exactly one thing is the most important thing on a screen, and nothing else fights it for attention.' },
  { n: 4, title: 'Clear start, clear end', body: 'Every experience has one unmistakable starting point and an unambiguous finish. Home is always reachable.' },
  // Was "Show what's actually happening, accurately. Never softened into
  // neutral, never dressed up as a triumph." — simplified: "never lie to
  // the user" said plainly, "help them understand" instead of "softened/
  // dressed up", at Alex's direction ("say something like never lie to
  // the users... hoping users understand what's actually happening, with
  // honesty").
  { n: 5, title: 'Be honest', body: 'Never lie to the user. Help them understand what\'s actually happening, with honesty.' },
  // Was "Identity top-left, global actions top-right. The eye never has to
  // backtrack to find the next step." — at Alex's direction: state the
  // actual reading-direction assumption behind the layout rule, note the
  // exception, and keep "elements follow the user's natural gaze" as the
  // throughline.
  { n: 6, title: 'Respect the gaze', body: 'Most people read left to right, top to bottom (some don\'t, so adjust for them). Place elements along that natural gaze, so the eye finds the next step fast.' },
  // Was "...No jargon the user didn't bring." — at Alex's direction, made
  // the standard concrete: picture someone trying this for the first time.
  { n: 7, title: 'Everything comprehensible', body: 'Plain words over clever ones. A label describes the outcome, not the mechanism. No jargon: picture the user trying this for the first time.' },
  { n: 8, title: 'Nothing invisible', body: 'Every interactive thing has a visible affordance at rest, not just a hint that appears on hover.' },
  // "amber" -> "yellow", at Alex's direction.
  { n: 9, title: 'Color carries meaning', body: 'Green succeeded, yellow needs attention, red failed. Colors carry intentional meaning, never just decoration.' },
  // Was "Group with distance, not lines. Use the same spacing scale for
  // the same relationship everywhere." — "not lines" dropped, "spacing is
  // a language" added, at Alex's direction ("remove not lines... include
  // spacing is a language... group with distance and clear spacing").
  { n: 10, title: 'Space is your friend', body: 'Spacing is a language: group with distance and clear spacing. Use the same spacing scale for the same relationship everywhere.' },
] as const;
