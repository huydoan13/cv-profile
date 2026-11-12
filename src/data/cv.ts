export const profile = {
  firstName: "Quoc Huy",
  lastName: "Doan Nguyen",
  fullName: "Doan Nguyen Quoc Huy",
  role: "Software Engineer",
  focus: "Frontend — React / Next.js",
  location: "Go Vap, Ho Chi Minh City",
  timezone: "Asia/Ho_Chi_Minh",
  email: "doannguyenquochuy13@gmail.com",
  linkedin: "https://www.linkedin.com/in/huy-doan13",
  linkedinLabel: "linkedin.com/in/huy-doan13",
  cvUrl: "/Doan-Nguyen-Quoc-Huy-CV.pdf",
  summary:
    "Frontend-focused engineer with three years of production React, Next.js and TypeScript. I turn messy business rules into interfaces that feel simple, ship features end to end, and use AI tools daily to move faster across the stack.",
};

export const impact = [
  { value: 116, prefix: "HK$", suffix: "K+", label: "in sales for Nice Care HK in the first three months after launch" },
  { value: 40, prefix: "", suffix: "+", label: "provider storefronts live on Pebbles' launch day" },
  { value: 12, prefix: "~", suffix: "mo", label: "from first commit to production launch as a founding developer" },
  { value: 4, prefix: "", suffix: "", label: "codebases owned end to end: API, user app, provider portal, admin" },
];

export type DemoKind = "booking" | "chat" | "voice" | "sections";

export type Project = {
  id: string;
  index: string;
  name: string;
  tagline: string;
  context: string;
  period: string;
  role: string;
  link?: { href: string; label: string };
  stack: string[];
  points: { title: string; body: string }[];
  demo: DemoKind;
  demoLabel: string;
};

export const projects: Project[] = [
  {
    id: "pebbles",
    index: "01",
    name: "Pebbles",
    tagline: "Early childhood & family services platform",
    context:
      "Singapore-held platform, launched first in Ho Chi Minh City. Parents book trusted child and family services and track their child's development.",
    period: "10/2025 — Present",
    role: "Founding developer",
    link: { href: "https://app.pebbles.vn", label: "app.pebbles.vn" },
    stack: ["Next.js", "React", "TypeScript", "TanStack Query", "Zustand", "Socket.io", "NestJS", "PostgreSQL", "Redis"],
    points: [
      { title: "Concept to launch in ~12 months", body: "One of two developers from the first commit to a launch with 40+ storefronts live on day one." },
      { title: "One reliable booking flow", body: "Opening hours, notice periods, capacity, packages, walk-ins and cancellations, online and offline in one system." },
      { title: "Growth levers at launch", body: "Sign-up-free Explore, campaign deeplinks, trial mode, milestone tracking, daily missions, GA4 funnels." },
    ],
    demo: "booking",
    demoLabel: "Try the booking rules",
  },
  {
    id: "pebbles-chat",
    index: "02",
    name: "Pebbles Chat",
    tagline: "Real-time chat that protects platform revenue",
    context:
      "Parents and providers talk in real time with live booking status in the thread, and the chat warns users who try to take the deal off-platform.",
    period: "10/2025 — Present",
    role: "Founding developer",
    stack: ["Socket.io", "React", "TanStack Query", "NestJS", "Redis"],
    points: [
      { title: "Live booking status", body: "Every conversation shows where the booking stands, so nobody has to ask." },
      { title: "Contact-sharing guard", body: "Phone numbers, emails and social handles trigger a gentle warning that keeps deals on Pebbles." },
    ],
    demo: "chat",
    demoLabel: "Try sharing a phone number",
  },
  {
    id: "cxgenie",
    index: "03",
    name: "CXGenie",
    tagline: "AI customer support platform (SaaS)",
    context:
      "Omnichannel inbox where businesses run AI chatbots and human agents. Scrum team of 25, monthly releases.",
    period: "10/2024 — 09/2025",
    role: "Frontend developer",
    stack: ["Next.js", "React", "TypeScript", "Vite", "TanStack Query", "Recoil", "Zustand", "Socket.io", "LaunchDarkly"],
    points: [
      { title: "Voice as a support channel", body: "Recording UI, playback and sending, end to end in the widget and web chat, including iOS Safari." },
      { title: "Support Center from scratch", body: "A self-service help center that lets clients deflect repetitive tickets." },
      { title: "Telegram in the inbox", body: "Agents handle Telegram group conversations in the same real-time inbox." },
    ],
    demo: "voice",
    demoLabel: "Record a voice note",
  },
  {
    id: "shopify",
    index: "04",
    name: "Shopify ×3",
    tagline: "Nice Care · Insane Clo · Cedora",
    context:
      "Custom storefronts for three brands in Hong Kong, Vietnam and Australia. Lead developer on all three, sole developer on two, and pre-sales consultant.",
    period: "04/2025 — 10/2026",
    role: "Lead developer & pre-sales",
    stack: ["Shopify Liquid", "JavaScript", "CSS", "Metafields", "Horizon theme"],
    points: [
      { title: "Nice Care HK", body: "HK$116K+ in sales, 168 orders and a 30% returning-customer rate in the first three months." },
      { title: "Insane Clo VN", body: "Helped win the contract, then led the build on Shopify's Horizon theme." },
      { title: "Cedora AU", body: "Sole developer for ten months, so the team ran promotions without an in-house developer." },
    ],
    demo: "sections",
    demoLabel: "Edit the section yourself",
  },
];

export type Scenery = "stream" | "river" | "current" | "reef" | "school" | "seas" | "build";

export type Chapter = {
  depth: number; // metres, drives the depth meter and water colour
  zone: string; // the ocean metaphor for this stage
  scenery: Scenery;
  title: string;
  accent: string;
  period: string;
  place: string;
  kicker: string;
  body: string;
  tags: string[];
};

/** The dive, oldest first. Each stage of the career is a layer of the ocean. */
export const journey: Chapter[] = [
  {
    depth: 30,
    zone: "Leaving the stream",
    scenery: "stream",
    title: "A small fish",
    accent: "leaves home.",
    period: "02/2020 — 03/2020",
    place: "Kuala Lumpur, Malaysia",
    kicker: "UOW Malaysia KDU",
    body: "An English Enhancement Programme abroad. GPA 7.4, IELTS 6.5 equivalent, and the confidence to work in English every day.",
    tags: ["English", "First time abroad"],
  },
  {
    depth: 80,
    zone: "The river",
    scenery: "river",
    title: "Learning",
    accent: "to swim.",
    period: "05/2020 — 11/2023",
    place: "FPT University, Ho Chi Minh City",
    kicker: "Bachelor of IT, Software Engineering",
    body: "Software engineering fundamentals, plus courses in UX research and design, web design and the software development lifecycle.",
    tags: ["Software Engineering", "UX", "SDLC"],
  },
  {
    depth: 160,
    zone: "First current",
    scenery: "current",
    title: "Feeling the",
    accent: "first real current.",
    period: "01/2022 — 05/2022",
    place: "FPT Software",
    kicker: "Front-End Developer Intern",
    body: "Fixing bugs and polishing UI with React on company projects. Learning that shipping is a team sport.",
    tags: ["React", "Bug fixing"],
  },
  {
    depth: 320,
    zone: "The reef",
    scenery: "reef",
    title: "Finding a reef",
    accent: "to grow on.",
    period: "01/2024 — 08/2024",
    place: "EbizWorld Software",
    kicker: "Front-End Developer",
    body: "Responsive React and TypeScript interfaces built from Figma, reusable component kits, REST integrations and Redux Toolkit state.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Redux Toolkit"],
  },
  {
    depth: 700,
    zone: "Open water",
    scenery: "school",
    title: "Swimming with",
    accent: "a school of 25.",
    period: "10/2024 — 09/2025",
    place: "Eastplayers · CXGenie",
    kicker: "Frontend Developer, AI support SaaS",
    body: "A scrum team of 25 and monthly releases. I added voice messages, built the Support Center from scratch and opened Telegram as a channel.",
    tags: ["Next.js", "Socket.io", "LaunchDarkly"],
  },
  {
    depth: 1300,
    zone: "Three seas",
    scenery: "seas",
    title: "Crossing",
    accent: "three seas.",
    period: "04/2025 — 10/2026",
    place: "Hong Kong · Vietnam · Australia",
    kicker: "Shopify lead developer & pre-sales",
    body: "Nice Care made HK$116K+ in its first three months. I helped win the Insane Clo contract and ran Cedora's storefront solo for ten months.",
    tags: ["Shopify Liquid", "Metafields", "Pre-sales"],
  },
  {
    depth: 2200,
    zone: "Building a reef",
    scenery: "build",
    title: "Building a reef",
    accent: "from zero.",
    period: "10/2025 — Present",
    place: "Pebbles · Ho Chi Minh City",
    kicker: "Founding developer",
    body: "One of two developers from the first commit to launch in about 12 months, with 40+ provider storefronts live on day one. Still shipping.",
    tags: ["Next.js", "NestJS", "PostgreSQL", "Redis"],
  },
];

export const skills = [
  { group: "Frontend", items: ["TypeScript", "JavaScript", "React", "Next.js", "Tailwind CSS", "SCSS", "MUI", "Ant Design"] },
  { group: "State & Data", items: ["TanStack Query", "Zustand", "Recoil", "Redux Toolkit", "REST", "Socket.io"] },
  { group: "Backend", items: ["NestJS", "PostgreSQL", "Sequelize", "Redis"] },
  { group: "E-commerce", items: ["Shopify Liquid", "Shopify CLI", "Theme sections", "Metafields"] },
  { group: "Tools", items: ["Git", "Figma", "GA4", "LaunchDarkly", "OneSignal", "i18next", "Mapbox", "Cursor", "Claude Code"] },
];

export const education = [
  { school: "FPT University", detail: "Bachelor of IT, Software Engineering", period: "05/2020 — 11/2023" },
  { school: "UOW Malaysia KDU University College", detail: "English Enhancement Programme · GPA 7.4", period: "02/2020 — 03/2020" },
];

export const certifications = [
  { name: "Google Project Management", issuer: "Google · Coursera" },
  { name: "Software Development Lifecycle", issuer: "Coursera" },
  { name: "User Experience Research and Design", issuer: "Coursera" },
  { name: "Web Design for Everybody", issuer: "Coursera" },
];

export const languages = ["Vietnamese — native", "English — IELTS 6.5 equivalent"];
