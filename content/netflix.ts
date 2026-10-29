// Alex's contribution is based on his own supplied scope. The linked public
// resources describe Netflix's broader ecosystem, across several teams/years.
export const netflixWork = {
  years: '2025, 2026',
  introduction: "Designing the systems and tools for video, artwork, copy, and analytics.",
  overview: "A story can reach audiences through a few seconds of video, a piece of artwork, or a few words. Behind each introduction is a creative workflow: finding the right clip, frame, or words for the right surface, then testing their performance and applying those insights to improve the Netflix experience. My work at Netflix spans the workflows, tools, and automation that support this process across video, artwork, copy, and analytics.",
  contribution: "As a Product Designer, I led the design of creative tools, workflows, and automation for promotional video across Netflix’s TV, web, and mobile experiences and marketing channels. This included Netflix originals, such as ONE PIECE and Wednesday, and partner content from TF1 and HBO. Video was my primary focus; I also led design across artwork, copy, and analytics as team priorities and capacity required.",
  distribution: "The throughline is a streamlined creative system that preserves the judgment that makes each story exciting, helps creative assets perform well, and aligns with business goals.",
  challenge: "The design problem extends beyond any single editor or screen. Creative teams need to find meaningful moments in long-form content, develop assets for different contexts, and coordinate decisions. Friction at any handoff can interrupt momentum. Automation can make repeatable production work easier, faster, and more effective while preserving human judgment where it matters most.",
  areas: [
    { image: { src: '/img/netflix-video-surface.webp?v=643ceabbcc', alt: 'Annotated Netflix homepage showing the video preview area for Animals.' }, title: "Video", description: "Designing workflows for finding, editing, and developing video assets for Netflix surfaces and marketing channels, including Instagram, TikTok, YouTube, and other destinations." },
    { image: { src: '/img/netflix-artwork-surface.webp?v=09c7574943', alt: 'Annotated Netflix homepage showing the featured artwork area for Animals.' }, title: "Artwork", description: "Designing tools and workflows for the images that introduce a title. The challenge is helping creatives explore and choose imagery that captures the excitement of the story and represents it authentically." },
    { image: { src: '/img/netflix-copy-surface.webp', alt: 'Annotated Netflix homepage showing the synopsis copy for Animals.' }, title: "Copy", description: "Designing workflows for the words that help people understand and discover content, from writing and generating copy to reviewing and publishing it for each story." },
    { image: null, title: "Analytics", description: "Connecting creative work with audience insights. The challenge is making performance information useful for creative decisions." },
  ],
  impactContext: 'Netflix’s public writing illustrates why this scope matters: Clips supports collaborative moment selection, AVA surfaces imagery for creative exploration, Nutshell coordinates synopsis workflows, and Muse makes audience response available to creative teams. These sources describe the broader ecosystem across multiple teams and years; their results are not attributed to my individual work.',
  links: [
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
    kind: 'embed',
    title: 'Visual search / Finding the right clip and frame',
    description: 'My contributions also included designing workflows that help creatives find the right clip or frame using different algorithms, AI, and media-understanding technologies. At the product, UX, and UI layers, I worked to make these capabilities easier to use in creative work, helping teams explore relevant moments and choose assets that fit the use case. The public video below, Visual Search @ Netflix, provides context for the technology behind these workflows.',
    src: 'https://www.youtube-nocookie.com/embed/I9VGd4JYshc?start=0',
    videoTitle: 'Visual Search @ Netflix',
    credit: 'WeAreNetflix / YouTube',
    sourceHref: 'https://www.youtube.com/watch?v=I9VGd4JYshc',
  },
] as const;
