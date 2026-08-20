// All copy here is migrated from ajwoo.com (Phase 0 crawl). Facts unchanged.
// The bio is reordered so the strongest credential arrives first — the visitor's
// job is to decide, and "Design Lead at Netflix" is what moves that decision.

export const site = {
  name: 'Alex Woo',
  fullName: 'Alex J. Woo',
  // The single most important element on `/` — and the only thing that animates.
  identity: 'Alex Woo designs creative tools at Netflix.',
  bio:
    'Before Netflix, Adobe Premiere Pro — pioneering the future of film and video — ' +
    'and Microsoft, incubating Mixed Reality, HoloLens, AI, and IoT. ' +
    'On weekends I review coffee shops around the world, looking for the perfect cup.',
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/ajwoo/30min',
  // D7 is unresolved: the live Calendly event is 30 minutes but the old copy said
  // 20. The label below follows the LINK, because a label that misstates the
  // commitment is exactly the kind of dishonesty §6 of the checklist forbids.
  ctaLabel: 'Book 30 minutes',
  email: 'alex.wooj@gmail.com',
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
  { year: '2018', what: 'Microsoft Garage Pitch — Winner' },
  { year: '2017', what: 'Microsoft MR Hack — 2nd place' },
  { year: '2017', what: 'UST' },
  { year: '2016', what: 'Microsoft HoloHack — 1st place' },
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
export const social = [
  { label: 'Email', href: 'mailto:alex.wooj@gmail.com', external: false },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alex-j-woo-8188ab99', external: true },
  { label: 'Instagram', href: 'https://www.instagram.com/alexwoodesign/', external: true },
] as const;
