import type { Block } from './projects';

// Scope and collaborators are taken from Alex's public case studies and account of his work.
// Product descriptions are context, not evidence of individual measured impact.
export const caseStudies: Record<string, { intro?: string; problem: string; scope: string; collaboration?: string; outcome: string; outcomeHeading?: string; additionalBlocks?: Block[] }> = {
  'premiere-generative-ai': {
    problem: 'Professional editors need ways to adjust the contents of a shot, extend it, or add and remove details without losing the flow of an edit. This 2024 work explored generative AI within Premiere.',
    scope: 'I led three designers to introduce selection and masking workflows in Premiere, enabling editors to target an area of a video for generative AI, color grading, and effects. My work spanned design vision, discovery, rapid exploration, UX, UI, and production. I collaborated with Premiere design, engineering, product, marketing, and brand teams, alongside other contributors.',
    outcomeHeading: 'Generative AI vision for Premiere',
    outcome: 'The video below shows the generative AI direction presented in 2024. The final video highlights Premiere’s 2026 updates, including selection and masking. The 2024 vision video helped establish the design foundations and user experience for features that later shipped, including selection, masking, Generative Extend, and other generative AI video effects. The 2024 video includes exploratory capabilities that did not all ship.',
    additionalBlocks: [
      { kind: 'text', value: 'Selection as a creative foundation' },
      { kind: 'text', value: 'The design challenge was to give editors a clear way to define where an edit should happen. I led a team of three designers on workflows for selection, masking, and generative AI video effects.' },
      { kind: 'text', value: 'A shared selection workflow supports more than one feature: editors can isolate an area of a shot, then choose how to change it. This connects emerging AI capabilities with the everyday work of finishing an edit in Premiere.' },
      { kind: 'embed', src: 'https://www.youtube.com/embed/OGKbVm94uoE', title: "What's New in Premiere | 2026 Updates | Adobe Video" },
    ],
  },
  'pr-ae-frame': {
    intro: 'Frame.io connects Premiere Pro and After Effects to a shared workspace in the cloud. An editor can upload a cut from Premiere Pro and send a review link. A fellow editor or a client can open the cut in a browser, pause on a frame, and leave a comment. The editor sees that feedback back in Premiere Pro while making the next edit.',
    problem: 'Editing happens in a timeline. Reviewing a cut involves a wider team, including producers, clients, and other collaborators who may never open an editing tool. The design challenge was to give everyone a shared cut to discuss while letting each person work where they were comfortable. Editors needed to bring assets into the cloud from their creative tools, and reviewers needed to be able to point to a specific moment simply by opening a link.',
    scope: 'I used storytelling and design vision to show Adobe’s video leadership what collaborative editing could look like across Premiere Pro, After Effects, and Frame.io. That work helped inform Adobe’s decision to acquire Frame.io, a deal announced at approximately $1.3 billion. My discovery work focused on the handoff between the person making the edit and the people reviewing it. My growth work focused on how Creative Cloud customers would discover Frame.io and start using it. I collaborated with the product teams, Creative Cloud Desktop, Adobe.com, Legal, and Marketing.',
    outcome: 'The demo below shows how an editor shares a Premiere Pro cut through Frame.io and brings reviewer comments back to the timeline.',
  },
};
