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
  greetingEmphasis: "I make bold ideas real.",
  bio: "At Netflix, I led design for promotional video, artwork, copy, and analytics workflows. At Adobe, I worked on AI and collaborative video editing. At Microsoft, I designed for mixed reality and accessibility. I’m always happy to meet people building something cool.",
  // Switched from Calendly to a Google Calendar booking page, and the event
  // itself from 30 to 15 minutes, at Alex's direction.
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendar.app.google/NCKhKCPKq9SffYAZ7',
  ctaLabel: 'Book 15m',
  email: 'alex@ajwoo.com',
} as const;

export const nav = [
  { href: '/work/', label: 'Work' },
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
  { school: 'University of Washington', detail: 'Graduate coursework in HCDE' },
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

export const principles = [
  { n: 1, title: 'Solve the real job', body: 'Understand what people need to accomplish. Find the simplest path to get them there.' },
  { n: 2, title: 'Know what matters', body: 'Make user needs, business goals, and constraints explicit. Decide what takes priority and why.' },
  { n: 3, title: 'Lead with hierarchy', body: 'Make the most important information and action clear at a glance.' },
  { n: 4, title: 'Make the path clear', body: 'Show where to start, what comes next, and how to finish or go back.' },
  { n: 5, title: 'Tell the truth', body: "Be clear about what the system is doing, what it knows, and what it doesn't." },
  { n: 6, title: 'Design beyond the screen', body: 'Connect decisions across the whole experience. Make patterns consistent and flexible.' },
  { n: 7, title: 'Speak plainly', body: 'Choose familiar words. Make labels describe what will happen.' },
  { n: 8, title: 'Make actions discoverable', body: 'Help people see what they can do and how to do it.' },
  { n: 9, title: 'Give color purpose', body: 'Use color consistently to communicate meaning. Reinforce it with words, shapes, or icons.' },
  { n: 10, title: 'Use space deliberately', body: 'Use spacing to create focus, relationships, and some room to breathe.' },
] as const;
