// Alex's contribution is based on his own supplied scope. The linked public
// resources describe Netflix's broader ecosystem, across several teams/years.
export const netflixWork = {
  years: '2025, 2026',
  introduction: "Designing the systems and tools for video, artwork, copy, and analytics.",
  overview: "A story can reach audiences through a few seconds of video, a piece of artwork, or a few words. Behind each introduction is a creative workflow: finding the right clip, frame, or words for the right surface, then testing and learning how they perform to improve the Netflix experience. My work at Netflix spans the tools and automation that support this process across video, artwork, copy, and analytics.",
  contribution: "As a Product Designer, I led the design of creative workflows, tools, and automation for Netflix’s own content and content from its partners. The scope extends across Netflix on TV, web, and mobile.",
  distribution: "The throughline is a streamlined creative system that preserves the judgment that makes each story exciting, helps creative assets perform well, and aligns with business goals.",
  challenge: "The design problem extends beyond any single editor or screen. Creative teams need to find meaningful moments in long-form content, develop assets for different contexts, and coordinate decisions. Friction at any handoff can interrupt momentum. Another challenge is using automation to make repeatable production work easier, faster, and more effective, while keeping people involved where their judgment matters most.",
  areas: [
    { image: { src: '/img/netflix-video-surface.webp?v=643ceabbcc', alt: 'Annotated Netflix homepage showing the video preview area for Animals.' }, title: "Video", description: "Designing workflows for finding, editing, and developing video assets for Netflix surfaces and marketing channels, including Instagram, TikTok, YouTube, and other destinations." },
    { image: { src: '/img/netflix-artwork-surface.webp?v=09c7574943', alt: 'Annotated Netflix homepage showing the featured artwork area for Animals.' }, title: "Artwork", description: "Designing tools and workflows for the images that introduce a title. The challenge is helping creatives explore and choose imagery that captures the excitement of the story and represents it authentically." },
    { image: { src: '/img/netflix-copy-surface.webp', alt: 'Annotated Netflix homepage showing the synopsis copy for Animals.' }, title: "Copy", description: "Designing workflows for the words that help people understand and discover content, from writing and generating copy to reviewing and publishing it for the right story." },
    { image: null, title: "Analytics", description: "Connecting creative work with audience insights. The challenge is making performance information useful for creative decisions." },
  ],
  impactContext: 'Netflix’s public writing illustrates why this scope matters: Clips supports collaborative moment selection, AVA surfaces imagery for creative exploration, Nutshell coordinates synopsis workflows, and Muse makes audience response available to creative teams. These sources describe the broader ecosystem across multiple teams and years; their results are not attributed to my individual work.',
  links: [
    {
      title: 'Promotional video / Creative control in editing',
      source: 'Netflix TechBlog / June 2026',
      description: 'Netflix researchers discuss editing challenges in trailers, teasers, and social videos, with published examples of Vera and VOID. Related research context / not documentation of CCM or a shipped editing product.',
      href: 'https://netflixtechblog.com/toward-more-controllable-ai-video-editing-an-early-research-exploration-at-netflix-eb8160ed60a2',
    },
    {
      title: 'Video editing / Public interactive research demos',
      source: 'Netflix / Caltech researchers / 2026',
      description: 'Vera’s public project page includes video comparisons showing edit layers and composited results. A research prototype / not a CCM interface or my individual design deliverable.',
      href: 'https://vera-layered-diffusion.github.io/',
    },
    {
      title: 'Creative automation / Workflow strategy and trust',
      source: 'First Round Review / September 2026',
      description: 'An interview with former Netflix product leader Mckenzie Lock on creative workflows, localization, and introducing AI while preserving craft and creative control. Broader organizational context.',
      href: 'https://review.firstround.com/netflix-ai-strategy/',
    },
    {
      title: 'Clips / Creative workflows and automation',
      source: 'Netflix TechBlog / 2022',
      description: 'An earlier public account of Clips, collaborative moment selection, and automation for promotional video production.',
      href: 'https://netflixtechblog.medium.com/from-weeks-to-seconds-building-mega-assets-to-uncover-joyful-moments-b3cedcf37ffc',
    },
    {
      title: 'AVA / Finding authentic moments',
      source: 'Netflix TechBlog / 2023',
      description: 'Public interface examples showing how Discovery View surfaces storylines, tones, characters, and environments for artwork exploration.',
      href: 'https://netflixtechblog.com/ava-discovery-view-surfacing-authentic-moments-b8cd145491cc',
    },
    {
      title: 'Clips / A published design perspective',
      source: 'Judd Smith / Public portfolio',
      description: 'Another designer’s case study with Clips interface examples and Dynamic Assembly workflows. Linked as related historical context, with design credit to Judd Smith.',
      href: 'https://www.juddzsmith.com/dynamic-sizzle',
    },
    {
      title: 'Automated moment selection / Patent drawings',
      source: 'Netflix patent / Published 2025',
      description: 'A public technical reference for automated clip extraction. The patent describes an approach rather than confirming a shipped product experience.',
      href: 'https://patents.google.com/patent/US12293779B2/en',
    },
    {
      title: 'Creative insights with Muse',
      source: 'Netflix TechBlog / 2025',
      description: 'How creative teams explore artwork and video performance to inform their decisions.',
      href: 'https://netflixtechblog.com/scaling-muse-how-netflix-powers-data-driven-creative-insights-at-trillion-row-scale-aa9ad326fd77',
    },
    {
      title: 'Media understanding with MediaFM',
      source: 'Netflix TechBlog / 2026',
      description: 'Multimodal media understanding that supports clip discovery, tagging, and creative insights.',
      href: 'https://netflixtechblog.com/mediafm-the-multimodal-ai-foundation-for-media-understanding-at-netflix-e8c28df82e2d',
    },
    {
      title: 'Multimodal video search',
      source: 'Netflix TechBlog / 2026',
      description: 'How signals from video, characters, and dialogue are combined to help teams find relevant moments.',
      href: 'https://netflixtechblog.com/powering-multimodal-intelligence-for-video-search-3e0020cf1202',
    },
    {
      title: 'Synopsis workflows with Nutshell',
      source: 'Netflix Studio Partner',
      description: 'A public overview of synopsis writing, collaboration, publishing, and localization.',
      href: 'https://studiopartner.netflix.net/studio/nutshell',
    },
    {
      title: 'Clips',
      source: 'Netflix Studio Partner',
      description: 'Netflix’s public partner resource for Clips.',
      href: 'https://studiopartner.netflix.net/studio/l2-clips',
    },
    {
      title: 'Video clipping and content discovery',
      source: 'Marketing Brew / 2025',
      description: 'Reporting on Netflix’s content-clipping patent and its approach to discoverability.',
      href: 'https://www.marketingbrew.com/stories/2025/06/06/netflix-patents-a-content-clipping-tool-after-overhauling-its-platform-to-boost-discoverability',
    },
  ],
};

// Only media already published in these public articles is used below.
// Credits identify the original publisher, not Alex's individual authorship.
export const netflixPublicExamples = [
  {
    kind: 'image',
    title: 'Muse / Creative insights',
    description: 'Netflix’s publicly shared Muse interface brings artwork, video, and creative performance into one view.',
    alt: 'Public Muse screenshot showing media filters, artwork thumbnails, and creative performance indicators.',
    src: '/img/netflix-public/muse.webp',
    fallback: '/img/netflix-public/muse.png',
    width: 1400,
    height: 728,
    credit: 'Netflix Technology Blog / 2025',
    sourceHref: 'https://netflixtechblog.com/scaling-muse-how-netflix-powers-data-driven-creative-insights-at-trillion-row-scale-aa9ad326fd77',
  },
  {
    kind: 'image',
    title: 'MediaFM / Understanding media',
    description: 'A public technical diagram showing how video, audio, captions, and title metadata contribute to media understanding. Related technology context / not an interface design deliverable.',
    alt: 'Netflix’s published MediaFM architecture diagram connecting video frames, audio, captions, and title metadata to contextualized shot representations.',
    src: '/img/netflix-public/mediafm.webp',
    fallback: '/img/netflix-public/mediafm.png',
    width: 1400,
    height: 1172,
    credit: 'Netflix Technology Blog / 2026',
    sourceHref: 'https://netflixtechblog.com/mediafm-the-multimodal-ai-foundation-for-media-understanding-at-netflix-e8c28df82e2d',
  },
  {
    kind: 'image',
    title: 'Video search / Connecting signals to moments',
    description: 'A public technical diagram illustrating how multiple models contribute signals to video search. Related technology context / not an interface design deliverable.',
    alt: 'Netflix’s published multimodal result-processing diagram showing model signals aligned to video timelines and combined for search.',
    src: '/img/netflix-public/video-search.webp',
    fallback: '/img/netflix-public/video-search.png',
    width: 1400,
    height: 408,
    credit: 'Netflix Technology Blog / 2026',
    sourceHref: 'https://netflixtechblog.com/powering-multimodal-intelligence-for-video-search-3e0020cf1202',
  },
] as const;
