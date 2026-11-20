/**
 * Satu sumber kebenaran untuk seluruh situs.
 *
 * Aturan dari wireframe: setiap angka (tahun pengalaman, waktu respons, kapasitas)
 * hanya ditulis DI SINI, lalu dipanggil ke halaman. Ini mencegah masalah yang
 * terlihat di situs referensi: "5+ tahun" di satu halaman, "6+ tahun" di halaman lain.
 */

export const site = {
  name: "Hilman Ibnu Assiddiq",
  domain: "ibnhilman.dev",
  url: "https://ibnhilman.dev",
  email: "hello@ibnhilman.dev",
  role: "Software Engineer",
  timezone: "GMT+7",
  location: "Indonesia",

  // Positioning — satu kalimat, dipakai di hero, meta description, dan OG.
  positioning:
    "I help B2B companies build internal systems and SaaS with Django & React — from scoping to go-live, with documentation your team can actually audit.",

  // Angka: ubah di sini saja.
  stats: {
    yearsInDelivery: 10,
    responseHours: 24,
    projectsPerQuarter: 2,
  },

  // Ketersediaan. Kelangkaan yang jujur lebih meyakinkan daripada
  // "open for projects" yang tidak pernah berubah.
  availability: {
    open: true,
    label: "Taking 2 new projects for Q1 2027",
  },

  booking: {
    // Ganti dengan tautan Cal.com Anda, mis. "https://cal.com/namaanda/discovery"
    url: "https://cal.com/your-handle/discovery",
    durationMinutes: 30,
  },

  newsletter: {
    // Tempel tautan beehiiv / Substack Anda. Kosongkan kalau belum ada.
    embedUrl: "",
  },

  social: {
    github: "https://github.com/your-handle",
    linkedin: "https://linkedin.com/in/your-handle",
    youtube: "https://youtube.com/@your-handle",
    x: "",
  },

  nav: [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ],
} as const;

/** Kategori blog. Harus sama persis dengan enum di content.config.ts. */
export const blogCategories = [
  "Building",
  "Delivery",
  "Build in Public",
] as const;

/** Masalah yang dikenali calon klien — blok "Sound familiar?" di beranda. */
export const problems = [
  {
    title: "The project doubled in cost because nobody wrote down the scope.",
    body: "Every change felt small on its own. Nobody tracked what they added up to.",
  },
  {
    title: "The last vendor left — and took all the knowledge with them.",
    body: "No diagrams, no runbook, and nobody left who knows why it was built that way.",
  },
  {
    title: "Your core operations still run on spreadsheets and WhatsApp.",
    body: "It works until one person is on leave, or until an auditor asks for the trail.",
  },
] as const;

/** Cara kerja — 4 langkah, pembeda utama Anda. */
export const process = [
  { step: "Discovery", body: "Scope, architecture, and a written estimate before any code." },
  { step: "Build", body: "Weekly demos, a shared board, no surprises." },
  { step: "UAT", body: "Your users test against acceptance criteria you agreed on." },
  { step: "Handover", body: "Docs, source code, and a clean deployment you own." },
] as const;

export const faq = [
  {
    q: "How do you price projects?",
    a: "Fixed-scope packages. Anything unclear starts with a Discovery, and that fee is credited toward the build if you continue.",
  },
  {
    q: "Do I own the code?",
    a: "Yes. Full ownership of source, configuration, and documentation after final payment.",
  },
  {
    q: "What if the scope changes?",
    a: "A written change request with cost and schedule impact, approved before any work starts.",
  },
  {
    q: "Which time zones do you work with?",
    a: "GMT+7. That overlaps with Asia, Australia, and European mornings.",
  },
  {
    q: "Can you work with my existing team?",
    a: "Yes — as lead developer, as a reviewer, or alongside your in-house engineers.",
  },
  {
    q: "What happens after launch?",
    a: "Thirty days of support is included, then an optional retainer.",
  },
] as const;
