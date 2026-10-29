import type { Block } from './projects';

// Scope and collaborators are taken from Alex's public case studies and account of his work.
// Product descriptions are context, not evidence of individual measured impact.
export const caseStudies: Record<string, { problem: string; scope: string; collaboration: string; outcome: string; additionalBlocks?: Block[] }> = {
  'premiere-generative-ai': {
    problem: 'Professional editors need ways to adjust the contents of a shot, extend it, or add and remove details without losing the flow of an edit. This 2024 work explored generative AI within Premiere.',
    scope: 'I led three designers to introduce selection and masking workflows in Premiere, enabling editors to target an area of a video for generative AI, color grading, and effects. My work spanned design vision, discovery, rapid exploration, UX, UI, and production.',
    collaboration: 'Premiere design, engineering, product, marketing, and brand teams, alongside other contributors.',
    outcome: 'The first two videos show the generative AI direction presented in 2024. The final video highlights Premiere’s 2026 updates, including selection and masking. The 2024 vision video helped establish the design foundations and user experience for features that later shipped, including selection, masking, Generative Extend, and other generative AI video effects. The early demonstrations show the broader exploration; not every capability shown was released.',
    additionalBlocks: [
      { kind: 'text', value: 'Selection as a creative foundation' },
      { kind: 'text', value: 'The design challenge was to give editors a clear way to define where an edit should happen. I led a team of three designers on workflows for selection, masking, and generative AI video effects.' },
      { kind: 'text', value: 'A shared selection workflow supports more than one feature: editors can isolate an area of a shot, then choose how to change it. This connects emerging AI capabilities with the everyday work of finishing an edit in Premiere.' },
      { kind: 'embed', src: 'https://www.youtube.com/embed/OGKbVm94uoE', title: "What's New in Premiere | 2026 Updates | Adobe Video" },
    ],
  },
  'pr-ae-frame': {
    problem: 'Creative teams need to share assets, discuss revisions, and review work while editing. The Frame.io extension brings that collaboration into Premiere Pro and After Effects.',
    scope: 'Product design, UX, UI, content, discovery, user research, and marketing.',
    collaboration: 'Premiere Pro, After Effects, and Frame.io teams.',
    outcome: 'The public integration connects asset sharing, comments, and revision tracking with editing workflows. The demonstration below shows the experience. Product reach is not presented as a measure of my individual impact.',
  },
};
