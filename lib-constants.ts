/* Shared constants for the SARUR platform. */

export const CATEGORIES = [
  {
    slug: "design-creative",
    name: "Design & Creative",
    icon: "Palette",
    description: "Logo design, branding, UI/UX, illustration and motion graphics.",
    color: "from-fuchsia-500 to-violet-500",
    count: 1280,
  },
  {
    slug: "development-it",
    name: "Development & IT",
    icon: "Code2",
    description: "Web, mobile, backend development, DevOps and cloud engineering.",
    color: "from-cyan-500 to-blue-500",
    count: 2140,
  },
  {
    slug: "marketing",
    name: "Digital Marketing",
    icon: "Megaphone",
    description: "SEO, social media, paid ads, content and email marketing.",
    color: "from-emerald-500 to-teal-500",
    count: 960,
  },
  {
    slug: "writing",
    name: "Writing & Translation",
    icon: "PenLine",
    description: "Copywriting, technical writing, proofreading and translation.",
    color: "from-amber-500 to-orange-500",
    count: 720,
  },
  {
    slug: "video-animation",
    name: "Video & Animation",
    icon: "Clapperboard",
    description: "Video editing, 2D/3D animation, motion design and voiceover.",
    color: "from-rose-500 to-pink-500",
    count: 540,
  },
  {
    slug: "ai-services",
    name: "AI & Data",
    icon: "BrainCircuit",
    description: "Machine learning, data pipelines, prompt engineering and automation.",
    color: "from-indigo-500 to-purple-500",
    count: 410,
  },
] as const;

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const INTERESTS = [
  "Hire a freelancer",
  "Find freelance work",
  "Enterprise solutions",
  "Partnership / affiliate",
  "Press inquiry",
  "Something else",
];

export const PRICING_PLANS = [
  {
    name: "Starter",
    monthly: 0,
    annual: 0,
    tagline: "For getting started",
    highlight: false,
    cta: "Start free",
    features: [
      "Browse the full marketplace",
      "Post up to 3 active projects",
      "Apply to 10 jobs per month",
      "Standard support",
      "Basic dashboard analytics",
    ],
  },
  {
    name: "Pro",
    monthly: 19,
    annual: 15,
    tagline: "For growing professionals",
    highlight: true,
    cta: "Go Pro",
    features: [
      "Unlimited active projects",
      "Unlimited job applications",
      "Priority placement in search",
      "Advanced analytics & insights",
      "Zero platform fees on first $5k",
      "Priority support 24/7",
    ],
  },
  {
    name: "Enterprise",
    monthly: 99,
    annual: 79,
    tagline: "For teams & agencies",
    highlight: false,
    cta: "Contact sales",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Team collaboration tools",
      "Custom contracts & escrow",
      "SSO & advanced security",
      "SLA-backed uptime",
    ],
  },
] as const;

export const STATS = [
  { label: "Active freelancers", value: "85k+" },
  { label: "Projects completed", value: "320k+" },
  { label: "Client satisfaction", value: "98%" },
  { label: "Paid to talent", value: "$240M+" },
] as const;

export const PLATFORM_STATS = [
  { label: "Services listed", value: "12,400+" },
  { label: "Avg. response time", value: "2 hrs" },
  { label: "Countries", value: "190+" },
  { label: "Avg. project budget", value: "$1,250" },
] as const;

export const TESTIMONIALS = [
  {
    name: "Sara Mansour",
    role: "Founder, Lumen Studio",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    quote:
      "We hired a senior brand designer through SARUR in under 48 hours. The escrow and milestone system made the whole engagement feel effortless and safe.",
    rating: 5,
  },
  {
    name: "David Okoro",
    role: "CTO, Finstack",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    quote:
      "The quality of vetted engineers on SARUR is unmatched. We've scaled our backend team with freelancers who deliver like full-time staff.",
    rating: 5,
  },
  {
    name: "Lena Fischer",
    role: "Freelance UX Designer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    quote:
      "SARUR changed my career. I went from inconsistent gigs to a steady $9k/month pipeline with clients who actually value design.",
    rating: 5,
  },
] as const;

export const STEPS = [
  {
    title: "Post or search",
    description:
      "Clients post a project in minutes. Freelancers browse curated, high-quality opportunities.",
    icon: "Search",
  },
  {
    title: "Match & connect",
    description:
      "Review proposals, compare profiles and chat in real time until you find the perfect fit.",
    icon: "Handshake",
  },
  {
    title: "Collaborate",
    description:
      "Agree on milestones, share files and track progress inside a single shared workspace.",
    icon: "Workflow",
  },
  {
    title: "Pay securely",
    description:
      "Funds are held in escrow and released on approval. Everyone gets paid on time, every time.",
    icon: "ShieldCheck",
  },
] as const;
