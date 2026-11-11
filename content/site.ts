// Single source of truth for every word on the site.
// Edit text here; components read from this file only.
// House rule: no em dashes in copy.

export type Metric = {
  /** Numeric part that counts up. Omit for non numeric metrics. */
  value?: number;
  prefix?: string;
  suffix?: string;
  /** Shown instead of a counter when value is omitted. */
  display?: string;
  label: string;
  caption: string;
};

export type Project = {
  id: string;
  index: string;
  name: string;
  role: string;
  period: string;
  /** YYYY-MM; end omitted means ongoing. */
  start: string;
  end?: string;
  group: "Ventures" | "Community" | "Consulting";
  org?: string;
  category?: string;
  /** One line shown on the row. */
  oneLiner: string;
  /** The big number. Scrambles in on hover. */
  resultValue: string;
  resultLabel: string;
  /** Card copy, under 80 words in total. */
  card: { problem: string; did: string; result: string };
  /** Expanded overlay copy. */
  expanded: {
    problem: string[];
    did: string[];
    result: string[];
    facts: { label: string; value: string }[];
  };
  tags: string[];
  /** Live product link. Shown on the row and the project page. */
  link?: { href: string; label: string };
  /** Hover preview + project page hero. Omit to use the abstract dot card. */
  media?: { kind: "video" | "image"; src: string; poster?: string; alt: string };
  /** Short product highlights, taken from the live site. */
  product?: { tagline: string; points: string[] };
  /** Extra outbound links shown as pills on the row (e.g. Instagram). */
  socials?: { href: string; label: string }[];
  /** Channels, brand partners and events. Pickup Games only for now. */
  showcase?: {
    channels: { kind: string; href: string; label: string; meta: string; internal?: boolean }[];
    partners: string[];
    events: { name: string; date: string; note: string }[];
  };
};

export type City = {
  name: string;
  note: string;
  lon: number;
  lat: number;
};

export const site = {
  name: "Eason Gan",
  firstName: "Eason",
  lastName: "Gan",
  monogram: "EG",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://easongan123.github.io",

  meta: {
    title: "Eason Gan | Founder, UC Berkeley Haas & Data Science",
    description:
      "Eason Gan is a founder who builds products people actually use. Co-Founder & CEO of Pickup Games (25,000+ users, zero ad spend). Business Administration (Haas Spieker) and Data Science at UC Berkeley.",
  },

  status: {
    show: false,
    text: "Open to Summer 2027 internships",
  },

  hero: {
    // Words wrapped in *asterisks* render in Instrument Serif italic.
    oneLiner: "Building what *matters*.",
    proof: "From ideation to launch.",
    subLine: "Founder · Business Administration (Haas Spieker) + Data Science @ UC Berkeley",
    ctaWork: "View work",
    ctaResume: "Resume ↓",
  },

  metrics: [
    {
      value: 25000,
      suffix: "+",
      label: "Active users",
      caption: "On Pickup Games, built from zero in Hong Kong",
    },
    {
      value: 20,
      suffix: "M+",
      label: "Organic views",
      caption: "Near zero CAC. No paid ads, ever",
    },
    {
      value: 2000,
      suffix: "+",
      label: "Students",
      caption: "Across 5 countries on HandsOnExams",
    },
    {
      display: "Gold",
      label: "Medal, Geneva",
      caption: "International Exhibition of Inventions. Top 10 of 800+",
    },
  ] satisfies Metric[],

  about: {
    heading: "Four cities, *one* habit: building.",
    body: "I grew up between Shanghai, Hong Kong and London, and I now study business and data at Berkeley. Every move taught me the same lesson: find the people who care, then build the thing they keep coming back to.",
    education: [
      {
        school: "UC Berkeley",
        detail: "B.S. Business Administration (Haas, Spieker Program) and B.A. Data Science",
        meta: "GPA 4.0 / 4.0 · Expected May 2030",
      },
      {
        school: "Westminster School",
        detail: "London",
        meta: "",
      },
    ],
    languages: [
      { name: "English", level: "Fluent" },
      { name: "Mandarin", level: "Fluent" },
      { name: "Cantonese", level: "Fluent" },
      { name: "German", level: "Conversational" },
      { name: "Spanish", level: "Conversational" },
    ],
  },

  journey: {
    // Personalize: add years to each note if you want them on the map.
    route: [
      { name: "Shanghai", note: "Where it started", lon: 121.47, lat: 31.23 },
      { name: "Hong Kong", note: "Pickup Games HQ", lon: 114.17, lat: 22.32 },
      { name: "London", note: "Westminster School", lon: -0.13, lat: 51.51 },
      { name: "Berkeley", note: "Haas + Data Science, 2026", lon: -122.27, lat: 37.87 },
    ] satisfies City[],
    expansion: {
      label: "Pickup Games next",
      markets: [
        { name: "U.S.", note: "", lon: -98, lat: 39 },
        { name: "Portugal", note: "", lon: -8.2, lat: 39.6 },
        { name: "Brazil", note: "", lon: -47.9, lat: -15.8 },
        { name: "Australia", note: "", lon: 151.2, lat: -33.9 },
      ] satisfies City[],
    },
  },

  projects: [
    {
      id: "pickup-games",
      start: "2025-02",
      group: "Ventures",
      index: "01",
      name: "Pickup Games",
      role: "Co-Founder & CEO",
      period: "Feb 2025 to present",
      category: "Sports marketplace",
      oneLiner: "25,000+ players on a two sided sports marketplace, 100% organic.",
      resultValue: "25,000+",
      resultLabel: "active users",
      card: {
        problem: "Pickup sports in Hong Kong ran on group chats. Players could not find games, organizers could not fill them.",
        did: "Built a two sided marketplace and grew it with 15+ creators instead of ads.",
        result: "25,000+ users, 20M+ views, sponsors including Red Bull and Li-Ning.",
      },
      expanded: {
        problem: [
          "In Hong Kong, finding a pickup game meant chasing invites across scattered group chats. Players showed up to half empty courts, and organizers spent hours filling rosters by hand.",
        ],
        did: [
          "Co-founded Pickup Games as a two sided marketplace that matches players with games and gives organizers the tools to fill them.",
          "Skipped paid acquisition entirely. Partnered with 15+ creators (2.5M+ combined followers) to reach 5M+ unique accounts, then turned that attention into recurring players.",
          "Closed sponsorships with Red Bull, Li-Ning, Kelme and Passion24.",
        ],
        result: [
          "25,000+ active users and 20M+ views at near zero CAC, 100% organic. Now expanding to the U.S., Portugal, Brazil and Australia.",
        ],
        facts: [
          { label: "Users", value: "25,000+" },
          { label: "Views", value: "20M+" },
          { label: "Unique reach", value: "5M+" },
          { label: "Paid ads", value: "0" },
        ],
      },
      tags: ["Marketplace", "Growth", "Partnerships"],
      link: { href: "https://www.pickupgames.app/", label: "pickupgames.app" },
      media: { kind: "video", src: "/projects/pickup-games.mp4", poster: "/projects/pickup-games.jpg", alt: "Pickup Games tournament on an outdoor court" },
      product: {
        tagline: "Find, join or host pickup games.",
        points: [
          "Live map of nearby games with spots left, kick off time and skill level",
          "Join in one tap, or host your own",
          "Verified player profiles with ratings and games played",
          "15+ sports, 50+ weekly games, rated 4.7 by players",
        ],
      },
      socials: [{ href: "https://www.instagram.com/pickupgames.app/", label: "@pickupgames.app" }],
      showcase: {
        channels: [
          { kind: "Instagram", href: "https://www.instagram.com/pickupgames.app/", label: "@pickupgames.app", meta: "6.9K followers · 20M+ views via creators" },
          { kind: "Website", href: "https://www.pickupgames.app/", label: "pickupgames.app", meta: "Find, join or host a game" },
          { kind: "Nonprofit", href: "/projects/pickup-for-good", label: "Pickup For Good", meta: "Youth sports, funded by every event", internal: true },
        ],
        partners: ["Red Bull", "Li-Ning", "Kelme", "Passion24"],
        events: [
          { name: "pickup × Red Bull Tournament", date: "Hong Kong", note: "One pitch, back to back games, the whole community out under the lights." },
          { name: "Pickup For Good Runathon", date: "Mar 2026", note: "Running for health, for fun and for impact." },
          { name: "Sports for a Cause", date: "Dec 2025", note: "Charity games raising money for causes across Hong Kong." },
        ],
      },
    },
    {
      id: "handsonexams",
      start: "2024-10",
      group: "Ventures",
      index: "02",
      name: "HandsOnExams",
      role: "Co-Founder",
      period: "Oct 2024 to present",
      category: "EdTech",
      oneLiner: "All in one exam prep for 2,000+ students in 5 countries.",
      resultValue: "+45%",
      resultLabel: "retention",
      card: {
        problem: "Students juggled past papers, notes and tutors across a dozen sources.",
        did: "Built one platform with past papers, notes, a tutor network and AI study tools, iterated through 100+ feedback cycles.",
        result: "2,000+ students in 5 countries, retention up 45%.",
      },
      expanded: {
        problem: [
          "Exam prep was fragmented. Past papers lived in one place, notes in another, tutors somewhere else, and nothing helped students study smarter.",
        ],
        did: [
          "Co-founded HandsOnExams, an all in one platform combining past papers, notes, a tutor network and AI study tools.",
          "Ran 100+ feedback cycles with students to decide what to build next, and secured partnerships including Millie Group.",
        ],
        result: [
          "2,000+ students across 5 countries, with retention up 45% from feedback driven iteration.",
        ],
        facts: [
          { label: "Students", value: "2,000+" },
          { label: "Countries", value: "5" },
          { label: "Feedback cycles", value: "100+" },
          { label: "Retention", value: "+45%" },
        ],
      },
      tags: ["EdTech", "AI tools", "Product iteration"],
      link: { href: "https://www.handsonexams.com/", label: "handsonexams.com" },
      media: { kind: "image", src: "/projects/handsonexams.jpg", alt: "HandsOnExams homepage" },
      product: {
        tagline: "AI revision tools and resources, all in one place.",
        points: [
          "Past papers, curated notes and a tutor network",
          "AI Quizzer, Summariser, Flashcards and Essay Grader built from your own material",
          "IGCSE, A Level and IB across Maths, Sciences and Economics",
        ],
      },
    },
    {
      id: "tourvista",
      start: "2023-04",
      end: "2024-06",
      group: "Ventures",
      index: "03",
      name: "Tourvista",
      role: "Founder",
      period: "Apr 2023 to Jun 2024",
      category: "Applied AI",
      oneLiner: "Multimodal AI travel recommender. Gold Medal in Geneva.",
      resultValue: "+75%",
      resultLabel: "accuracy vs baseline",
      card: {
        problem: "Travel recommendations felt generic and ignored what travelers actually liked.",
        did: "Built a multimodal recommender on the SOLAR model with a custom reinforcement learning module.",
        result: "+75% accuracy vs baseline, 78% of pilot users rated recs relevant, OFEED Gold Medal.",
      },
      expanded: {
        problem: [
          "Most travel recommenders lean on popularity, so everyone gets the same list. Travelers wanted suggestions that reflected their own taste.",
        ],
        did: [
          "Founded Tourvista and built a multimodal AI travel recommender on the SOLAR model.",
          "Designed a custom reinforcement learning module that improves recommendations from user feedback.",
        ],
        result: [
          "+75% accuracy against baseline, and 78% of pilot users rated recommendations relevant.",
          "Won the OFEED Gold Medal for European Innovation at the Geneva International Exhibition of Inventions, top 10 of 800+.",
        ],
        facts: [
          { label: "Accuracy", value: "+75%" },
          { label: "Rated relevant", value: "78%" },
          { label: "Award", value: "Gold, Geneva" },
          { label: "Ranking", value: "Top 10 / 800+" },
        ],
      },
      tags: ["Reinforcement Learning", "Multimodal AI", "Research"],
    },
    {
      id: "fine-and-rare",
      start: "2024-05",
      end: "2024-08",
      group: "Consulting",
      index: "04",
      name: "Fine and Rare",
      role: "Strategy & Product Consultant",
      period: "May to Aug 2024",
      category: "Consulting",
      oneLiner: "Diagnosed funnel drop off for a luxury wine and spirits retailer.",
      resultValue: "+20%",
      resultLabel: "projected online conversion",
      card: {
        problem: "A luxury wine and spirits retailer was losing buyers inside its online funnel.",
        did: "Diagnosed the drop off and led a 6 person team to prototype an AI conversational assistant.",
        result: "Projected +20% online conversion, presented to senior leadership.",
      },
      expanded: {
        problem: [
          "Fine and Rare, a luxury wine and spirits retailer, saw strong interest online but too many buyers dropped out before purchase.",
        ],
        did: [
          "Diagnosed where and why the funnel was leaking.",
          "Led a 6 person team to prototype an AI conversational assistant that guides buyers to the right bottle.",
        ],
        result: [
          "Projected a 20% lift in online conversion and presented the strategy and prototype to senior leadership.",
        ],
        facts: [
          { label: "Team", value: "6" },
          { label: "Conversion", value: "+20% projected" },
          { label: "Audience", value: "Senior leadership" },
        ],
      },
      tags: ["Strategy", "Funnel analysis", "Conversational AI"],
    },
    {
      id: "pickup-for-good",
      start: "2025-03",
      group: "Community",
      index: "05",
      name: "Pickup For Good",
      role: "Founder",
      period: "Mar 2025 to present",
      category: "Community",
      oneLiner: "Youth sports clinics for underserved kids across 5 cities.",
      resultValue: "$9,500+",
      resultLabel: "raised for youth sports",
      card: {
        problem: "Underserved kids in Hong Kong and across Asia lacked access to organized sport.",
        did: "Founded a nonprofit arm running recurring clinics, partnered with Save the Children HK.",
        result: "$9,500+ raised, 500+ students, 10+ clinics in 5 cities.",
      },
      expanded: {
        problem: [
          "Organized sport is expensive, and the kids who would benefit most are often the ones locked out.",
        ],
        did: [
          "Founded Pickup For Good to bring the Pickup Games community to underserved youth.",
          "Built 10+ recurring clinics across 5 cities in Hong Kong, Mainland China and Thailand, in partnership with Save the Children HK.",
        ],
        result: [
          "$9,500+ raised and 500+ students reached so far.",
        ],
        facts: [
          { label: "Raised", value: "$9,500+" },
          { label: "Students", value: "500+" },
          { label: "Clinics", value: "10+" },
          { label: "Cities", value: "5" },
        ],
      },
      tags: ["Nonprofit", "Community", "Partnerships"],
      link: { href: "https://www.pickupgames.app/pickup-for-good", label: "pickupgames.app/pickup-for-good" },
      media: { kind: "image", src: "/projects/pickup-for-good.jpg", alt: "Pickup For Good youth clinics" },
      product: {
        tagline: "Every child deserves the joy of sports.",
        points: [
          "Equipment, coaching and safe spaces for underprivileged youth",
          "Monthly runathons, charity games and clinics",
          "A share of every Pickup Games event funds the program",
        ],
      },
    },
  ] satisfies Project[],

  /** Intro line under each page title. */
  pages: {
    projects: "Five things I built or shipped. Each one started with a real problem and ended with a number I can point to.",
    life: "Live, laugh, love.",
  },

  /** Homepage index. Each row previews its page as a particle shape on hover. */
  categories: [
    {
      key: "projects",
      href: "/projects",
      label: "Projects",
      teaser: "5 things I built, 25,000+ people who use them",
      caption: "25,000+ users on Pickup Games. Zero ad spend.",
    },
    {
      key: "about",
      href: "/about",
      label: "About",
      teaser: "4 cities, 5 languages, Haas + Data Science",
      caption: "Shanghai → Hong Kong → London → Berkeley",
    },
    {
      key: "life",
      href: "/life",
      label: "Life",
      teaser: "Soccer, Muay Thai, surfing, hiking",
      caption: "What keeps me sharp off the clock.",
    },
  ],

  scale: {
    count: 25000,
    caption: "Each *dot* is a Pickup Games player.",
    sub: "Every one of them found us without an ad.",
  },

  skills: ["Python", "SQL", "React", "Excel", "PowerPoint", "RAG", "Reinforcement Learning"],

  life: {
    reelTitle: "Where I go to",
    reelTail: "reset.",
    // Drop photos in public/life/ and set src, e.g. "/life/soccer.jpg".
    // shape: "portrait" | "landscape" | "square". No src shows a placeholder.
    frames: [
      { src: "/life/dawn-patrol.jpg", alt: "Eason at a night summit above Victoria Harbour", caption: "Dawn patrol", place: "Hong Kong", interest: "Hiking", coords: "22.27°N 114.15°E", shape: "portrait", position: "center" },
      { src: "/life/inter-milan.jpg", alt: "Inter Milan Academy players at the Suning Youth Development Centre", caption: "Inter Milan Academy", place: "Milan", interest: "Soccer", coords: "45.48°N 9.12°E", shape: "landscape", position: "center" },
      { src: "/life/surfing.jpg", alt: "Picking a board before a surf session", caption: "Choosing a board", place: "Surfing", interest: "Surfing", coords: "22.24°N 114.26°E", shape: "portrait", position: "center 40%" },
      { src: "/life/pickup-community.jpg", alt: "Pickup Games community session on a Hong Kong pitch", caption: "Pickup, game day", place: "Hong Kong", interest: "Soccer", coords: "22.27°N 114.18°E", shape: "square", position: "center 70%" },
      { src: "/life/westminster-abbey.jpg", alt: "Eason with friends outside Westminster Abbey", caption: "Westminster Abbey", place: "London", interest: "Hiking", coords: "51.50°N 0.13°W", shape: "portrait", position: "center 60%" },
    ],
  },

  interests: [
    { name: "Soccer", note: "Inter Milan Academy" },
    { name: "Muay Thai", note: "" },
    { name: "Surfing", note: "" },
    { name: "Hiking", note: "Dragon's Back, Lion Rock" },
  ],

  contact: {
    heading: "Let's *talk.*",
    intro: "Building something people should show up for? I would love to hear about it.",
    email: "eason.gan@berkeley.edu",
    linkedin: "https://www.linkedin.com/in/eason-gan",
    linkedinLabel: "linkedin.com/in/eason-gan",
    resume: "/resume.pdf",
  },

  timezone: { city: "Berkeley", tz: "America/Los_Angeles" },
} as const;

export type Site = typeof site;
