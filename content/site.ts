// All copy here is migrated from ajwoo.com (Phase 0 crawl). Facts unchanged.
// The headline carries the full credential now: Netflix, Adobe, Microsoft.
// The separate bio paragraph that used to spell that out underneath was
// redundant and got cut, at Alex's direction. Punchier: one line says
// everything the two used to.

export const site = {
  name: 'Alex Woo',
  fullName: 'Alex J. Woo',
  // The single most important element on `/` — and the only thing that animates.
  identity: 'Alex Woo designs creative tools at Netflix, Adobe, Microsoft, and more.',
  // Switched from Calendly to a Google Calendar booking page, and the event
  // itself from 30 to 15 minutes, at Alex's direction.
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendar.app.google/qmRwUtHFyeMUzYQj8',
  ctaLabel: 'Book 15 min',
  email: 'alexjungyeopwoo@gmail.com',
} as const;

export const nav = [
  { href: '/design/', label: 'Design' },
  { href: '/coffee/', label: 'Coffee' },
  { href: '/apps/', label: 'Apps' },
] as const;

export const education = [
  { school: 'Rhode Island School of Design', detail: 'BFA Industrial Design' },
  { school: 'Brown University', detail: 'Cross-registered student' },
  { school: 'Le Cordon Bleu Paris', detail: 'Pâtisserie de Base, Certifié' },
] as const;

export const clients = [
  'Kikkerland Design', 'The Container Store', 'USAA', 'Starbucks', 'MIT',
  'Brown University', 'Cheil Worldwide', 'IUCN', 'WIPO', 'Kim & Chang',
  'Yulchon LLC', 'TEDx',
] as const;

export const featured = [
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
export const principles = [
  { n: 1, title: 'Solve the job to be done', body: 'Know what the user is trying to finish, and the shortest honest path to done. If a decision doesn\'t serve that, it\'s decoration.' },
  { n: 2, title: 'Achieve the goal', body: 'Name every goal in play and rank them. The user\'s goal leads; nothing else competes with it for attention.' },
  { n: 3, title: 'One hierarchy, one emphasis', body: 'Exactly one thing is the most important thing on a screen, and nothing else fights it for attention.' },
  { n: 4, title: 'Clear start, clear end', body: 'Every experience has one unmistakable starting point and an unambiguous finish. Home is always reachable.' },
  { n: 5, title: 'Be honest', body: 'Show what\'s actually happening, accurately. Never softened into neutral, never dressed up as a triumph.' },
  { n: 6, title: 'Respect the gaze', body: 'Identity top-left, global actions top-right. The eye never has to backtrack to find the next step.' },
  { n: 7, title: 'Everything comprehensible', body: 'Plain words over clever ones. A label describes the outcome, not the mechanism. No jargon the user didn\'t bring.' },
  { n: 8, title: 'Nothing invisible', body: 'Every interactive thing has a visible affordance at rest, not only on hover.' },
  { n: 9, title: 'Color carries meaning', body: 'Green succeeded, amber needs attention, red failed. Colors carry intentional meaning, never just decoration.' },
  { n: 10, title: 'Space is your friend', body: 'Group with distance, not lines. Use the same spacing scale for the same relationship everywhere, so gaps read as a consistent language.' },
] as const;
