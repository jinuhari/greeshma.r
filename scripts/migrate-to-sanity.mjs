import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "x5ya31xa",
  dataset: "production",
  apiVersion: "2026-07-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const caseStudies = [
  {
    _id: "caseStudy-udaan",
    _type: "caseStudy",
    title: "Udaan",
    slug: { _type: "slug", current: "udaan" },
    number: 1,
    year: "2024",
    kicker: "Product · Visual System · Campaigns",
    role: "Associate Manager, Visual Designer — UI",
    summary: "Reshaping India's largest B2B commerce app: a mobile experience, brand campaigns and a scalable visual system used across product surfaces.",
    outcomes: [
      { label: "Retail partners", value: "3M+" },
      { label: "Design system tokens", value: "240+" },
      { label: "Campaigns shipped", value: "18" },
    ],
    tone: "terracotta",
    client: "Udaan (B2B Commerce)",
    timeline: "8 months",
    tools: ["Figma", "After Effects", "Lottie", "Rive", "Illustrator"],
    orderRank: 1,
    sections: [
      { _type: "textSection", title: "The Challenge", content: "Udaan's existing visual language had grown organically across surfaces, resulting in inconsistency between the mobile app, web dashboard, and marketing campaigns. As India's largest B2B commerce platform serving millions of retail partners, even small UI friction cascades into real business impact. The challenge was to create a unified design system that could scale across product surfaces while maintaining a distinct visual identity for brand campaigns." },
      { _type: "textSection", title: "The Approach", content: "We started with an audit of every surface — mobile app, web dashboard, email, and marketing — documenting every component, colour, and typographic usage. From there we distilled a token-based design system with 240+ design tokens covering colour, spacing, typography, and motion. The system was built iteratively: each component was redesigned, documented, and validated through usability testing with retail partners before being rolled out at scale." },
      { _type: "imageTextSection", title: "Campaign System", content: "Beyond the product interface, I designed a campaign visual system that could flex across seasonal promotions, regional festivals, and partner onboarding drives. Each campaign used a modular kit of components — hero blocks, product cards, offer strips — that could be assembled in different configurations while staying visually coherent with the broader brand. The system shipped 18 campaigns in its first quarter.", imagePosition: "right" },
      { _type: "textSection", title: "Impact", content: "The unified design system reduced design-to-dev handoff time by 40% and eliminated visual inconsistencies that had previously required manual QA. The campaign system enabled the marketing team to produce high-quality campaign assets independently, reducing dependency on the design team by 60% for recurring campaign formats. Most importantly, retail partners reported a noticeably smoother experience — task completion rates improved across key flows." },
    ],
  },
  {
    _id: "caseStudy-tomodachi",
    _type: "caseStudy",
    title: "Tomodachi",
    slug: { _type: "slug", current: "tomodachi" },
    number: 2,
    year: "2023",
    kicker: "Android · Interaction · Research",
    role: "Lead Interaction Designer",
    summary: "A companion app that teaches Japanese through daily rituals — grounded in ethnographic interviews and a soft, warm visual language.",
    outcomes: [
      { label: "Study cohort", value: "42 learners" },
      { label: "Retention lift", value: "+38%" },
      { label: "Sessions", value: "12 rounds" },
    ],
    tone: "coral",
    client: "Independent research project",
    timeline: "6 months",
    tools: ["Figma", "Principle", "Android Studio", "Maze"],
    orderRank: 2,
    sections: [
      { _type: "textSection", title: "The Challenge", content: "Language learning apps often treat users as passive recipients of information — flashcards, repetition drills, gamified quizzes. Tomodachi started from a different premise: what if learning a language felt less like study and more like a daily ritual? The challenge was to design an Android companion app that taught Japanese through gentle, habitual interactions rather than traditional pedagogy." },
      { _type: "textSection", title: "Research", content: "I conducted 18 ethnographic interviews with Japanese language learners across Bangalore, ranging from absolute beginners to advanced speakers preparing for the JLPT N2. The key insight was that successful learners had built small daily rituals — a morning vocab review with coffee, listening to Japanese podcasts during commutes, writing a single sentence before bed. The app needed to fit into these existing rituals, not replace them." },
      { _type: "imageTextSection", title: "Design Response", content: "Tomodachi uses a soft, warm visual language — coral tones, rounded cards, handwritten-style typography — to create a feeling of a friendly companion rather than a teacher. Each lesson is framed as a 'daily ritual' with a consistent structure: a warm-up, a new concept, a practice session, and a reflection. The interaction design emphasises micro-feedback — subtle haptics, gentle animations, and encouraging copy — to create an emotionally safe learning environment.", imagePosition: "right" },
      { _type: "textSection", title: "Outcomes", content: "Over 12 rounds of usability testing with 42 learners, Tomodachi achieved a 38% improvement in 30-day retention compared to baseline language apps. The qualitative feedback was even more telling: learners described the app as 'comforting' and 'something I actually look forward to opening'. The research findings were presented at the Interaction Design conference and informed a set of design principles for emotionally sustainable learning tools." },
    ],
  },
  {
    _id: "caseStudy-qualin",
    _type: "caseStudy",
    title: "Qualin",
    slug: { _type: "slug", current: "qualin" },
    number: 3,
    year: "2023",
    kicker: "Brand · Identity · Typography",
    role: "Brand & Visual Designer",
    summary: "A quiet, considered identity for a wellness house — from wordmark to editorial guidelines to a full typographic system.",
    outcomes: [
      { label: "Wordmarks explored", value: "27" },
      { label: "Type pairings", value: "9" },
      { label: "Guideline pages", value: "64" },
    ],
    tone: "forest",
    client: "Qualin Wellness",
    timeline: "4 months",
    tools: ["Illustrator", "InDesign", "Figma", "Glyphs"],
    orderRank: 3,
    sections: [
      { _type: "textSection", title: "The Brief", content: "Qualin is a wellness house rooted in traditional Indian wellness practices — Ayurveda, yoga, and meditation — reimagined for a contemporary audience. The founders wanted an identity that felt neither clinical nor overly spiritual, but instead 'quietly considered'. Every touchpoint — from the wordmark to the packaging to the editorial content — needed to communicate trust, craft, and a deep respect for tradition." },
      { _type: "textSection", title: "Exploration", content: "The wordmark went through 27 iterations, each exploring different weights, proportions, and relationships between the letterforms. The final mark draws from the proportions of classical Indian manuscript typography while using a contemporary geometric structure. The typographic system pairs a refined serif for editorial content with a humanist sans-serif for interfaces, creating a dialogue between tradition and modernity." },
      { _type: "imageTextSection", title: "The System", content: "Beyond the logo, I built a comprehensive brand system covering colour (a muted palette drawn from natural pigments), texture (a custom pattern system based on traditional textile motifs), photography direction (soft, natural light with an emphasis on materiality), and editorial layout principles. The 64-page brand guideline document became the operational backbone for all brand communications.", imagePosition: "left" },
      { _type: "textSection", title: "In Practice", content: "The identity has been applied across product packaging, a website, social media templates, and studio collateral. The design has been praised for its restraint — in a category that often defaults to loud, aspirational visuals, Qualin's quiet confidence stands apart. The founders reported that the brand guidelines have made it significantly easier to onboard new collaborators while maintaining visual consistency." },
    ],
  },
  {
    _id: "caseStudy-weaving-voices",
    _type: "caseStudy",
    title: "Weaving Voices",
    slug: { _type: "slug", current: "weaving-voices" },
    number: 4,
    year: "2022",
    kicker: "UX Research · Participatory Design",
    role: "Design Researcher, IISc NDIN",
    summary: "A participatory study with weaving communities in rural Karnataka — documenting practice, ritual and the everyday tools of a craft in transition.",
    outcomes: [
      { label: "Field visits", value: "6 villages" },
      { label: "Interviews", value: "31" },
      { label: "Artefacts", value: "120+" },
    ],
    tone: "indigo",
    client: "IISc National Design Innovation Network",
    timeline: "10 months",
    tools: ["Ethnography", "Participatory workshops", "Photography", "Artefact analysis"],
    orderRank: 4,
    sections: [
      { _type: "textSection", title: "Context", content: "The handloom weaving communities of rural Karnataka represent centuries of craft knowledge passed down through generations. Yet this knowledge exists almost entirely as oral tradition — undocumented, unarchived, and increasingly at risk as younger generations move away from the craft. The brief was to document not just the technical process of weaving, but the rituals, tools, and tacit knowledge that constitute the weaver's world." },
      { _type: "textSection", title: "Methodology", content: "Over 10 months, I conducted 31 semi-structured interviews across 6 villages in Karnataka, accompanied by photographic documentation of tools, workspaces, and finished textiles. The research used participatory design methods — weavers were invited to map their own workflows, annotate photographs of their looms, and share stories about specific tools and their origins. This approach yielded rich, textured data that a traditional interview protocol would have missed." },
      { _type: "imageTextSection", title: "Key Findings", content: "The research revealed that weaving knowledge is encoded not just in technical skill but in embodied practice — the rhythm of the shuttle, the tension of the warp, the muscle memory of the weaver's hands. Tools are not just instruments but repositories of personal and family history. The study documented 120+ artefacts, including looms, shuttles, bobbins, and dyeing equipment, each with its own story and significance.", imagePosition: "right" },
      { _type: "textSection", title: "Impact", content: "The research output included a visual archive, a set of design recommendations for interventions that could support weaving communities, and a methodology paper presented at a design research conference. The participatory approach has since been adopted by other researchers at the NDIN for similar craft documentation projects. The archive remains accessible to the weaving communities themselves, serving as a record of their own practice." },
    ],
  },
];

const archiveItems = [
  { _id: "archiveItem-kalighat-revisited", _type: "archiveItem", label: "Kalighat, revisited", category: "Illustration", year: "2024", medium: "Digital gouache", aspectRatio: "aspect-[3/4]", orderRank: 0 },
  { _id: "archiveItem-an-aw", _type: "archiveItem", label: "AN/AW", category: "Typography", year: "2023", medium: "Poster series", aspectRatio: "aspect-[3/4]", orderRank: 1 },
  { _id: "archiveItem-rosa-damascena", _type: "archiveItem", label: "Rosa damascena", category: "Fine Art", year: "2024", medium: "Watercolour on paper", aspectRatio: "aspect-[3/4]", orderRank: 2 },
  { _id: "archiveItem-artisan-tea", _type: "archiveItem", label: "Artisan Tea", category: "Packaging", year: "2023", medium: "Kraft & foil print", aspectRatio: "aspect-[1/1]", orderRank: 3 },
  { _id: "archiveItem-bengaluru-0714", _type: "archiveItem", label: "Bengaluru, 07:14", category: "Photography", year: "2023", medium: "35mm film", aspectRatio: "aspect-[3/4]", orderRank: 4 },
  { _id: "archiveItem-kalamkari-matrix", _type: "archiveItem", label: "Kalamkari matrix", category: "Pattern", year: "2022", medium: "Repeat print", aspectRatio: "aspect-[1/1]", orderRank: 5 },
];

const timelineItems = [
  { _id: "timelineItem-2013-fine-arts", _type: "timelineItem", year: "2013", title: "Fine Arts", where: "Where it began — canvas, pigment, patience.", orderRank: 0 },
  { _id: "timelineItem-2016-graphic-design", _type: "timelineItem", year: "2016", title: "Graphic Design", where: "Learning to speak in systems, grids and voice.", orderRank: 1 },
  { _id: "timelineItem-2018-film-production", _type: "timelineItem", year: "2018", title: "Film Production", where: "Directing frame, light and story.", orderRank: 2 },
  { _id: "timelineItem-2020-mdes-interaction-design", _type: "timelineItem", year: "2020", title: "M.Des Interaction Design", where: "IIT Hyderabad — from artefact to interface.", orderRank: 3 },
  { _id: "timelineItem-2021-suzuki-innovation-centre", _type: "timelineItem", year: "2021", title: "Suzuki Innovation Centre", where: "Designing mobility for the road ahead.", orderRank: 4 },
  { _id: "timelineItem-2022-iisc-ndin", _type: "timelineItem", year: "2022", title: "IISc — National Design Innovation Network", where: "Field research with weaving communities.", orderRank: 5 },
  { _id: "timelineItem-2023-udaan", _type: "timelineItem", year: "2023", title: "Udaan", where: "Associate Manager, Visual Designer — UI.", orderRank: 6 },
];

async function migrate() {
  if (!process.env.SANITY_TOKEN) {
    console.error("Set SANITY_TOKEN env var first");
    process.exit(1);
  }

const singletons = [
  {
    _id: "heroSection",
    _type: "heroSection",
    eyebrow: "Design practice 2013 - present",
    heading: "Product interfaces shaped with an illustrator's eye and a research-led process.",
    description: "Greeshma R. designs digital products, visual systems, and brand-sensitive surfaces with a focus on clarity, rhythm, and finish.",
    ctaLabel: "View selected work",
    ctaHref: "#work",
    stats: [
      { value: "11", label: "years of practice" },
      { value: "40+", label: "projects shipped" },
      { value: "3", label: "research residencies" },
      { value: "1", label: "very long conversation with craft" },
    ],
  },
  {
    _id: "marqueeSection",
    _type: "marqueeSection",
    items: [
      { text: "Product Design" },
      { text: "Visual Design" },
      { text: "Illustration" },
      { text: "Interaction Design" },
      { text: "UX Research" },
      { text: "Branding" },
      { text: "Motion" },
      { text: "Typography" },
    ],
  },
  {
    _id: "skillsSection",
    _type: "skillsSection",
    heading: "Tools of the trade.",
    groups: [
      { name: "Product Design", skills: ["UI Design", "Interaction", "Prototyping", "Design Systems", "Accessibility"] },
      { name: "Visual Design", skills: ["Editorial", "Layout", "Typography", "Color", "Iconography"] },
      { name: "Research", skills: ["Ethnography", "Participatory design", "Interviews", "Synthesis", "Journey mapping"] },
      { name: "Branding", skills: ["Identity", "Guidelines", "Naming", "Voice", "Wordmarks"] },
      { name: "Illustration", skills: ["Gouache", "Watercolour", "Digital", "Folk-inspired", "Botanical"] },
      { name: "Motion", skills: ["After Effects", "Lottie", "Rive", "Micro-interactions"] },
      { name: "AI Tools", skills: ["Midjourney", "Figma AI", "ChatGPT", "Runway"] },
      { name: "Design Systems", skills: ["Tokens", "Components", "Documentation", "Governance"] },
    ],
  },
  {
    _id: "aboutSection",
    _type: "aboutSection",
    heading: "I started as an artist — then everything else followed.",
    body: [
      { _type: "block", style: "normal", children: [{ _type: "span", text: "My hands learned pigment before pixels. I trained in fine arts — drawing, painting, printmaking — before I ever opened a design tool. That foundation shapes everything I make. Colour isn't a hex code; it's a feeling. Layout isn't a grid; it's a composition. Every interface is a canvas, every interaction a gesture." }] },
      { _type: "block", style: "normal", children: [{ _type: "span", text: "Interaction design at IIT Hyderabad gave me the vocabulary to bridge that artistic instinct with systems thinking. Product design, UX research, motion — each was a new lens to understand how people relate to the things they use. At the Suzuki Innovation Centre, I designed mobility experiences for emerging markets. At IISc, I spent 10 months living with weaving communities in rural Karnataka, documenting craft knowledge through participatory methods." }] },
      { _type: "block", style: "normal", children: [{ _type: "span", text: "Today, at Udaan, I design mobile experiences for millions of retail partners across India. But I still think of myself as an artist first. The tools have changed — from gouache to Figma, from canvas to code — but the process is the same: observe, imagine, make, refine. This site is an exhibition of that journey." }] },
    ],
    imageCaption: "Studio, Bengaluru — 2024",
  },
  {
    _id: "contactSection",
    _type: "contactSection",
    heading: "Let's make something worth keeping.",
    items: [
      { label: "Email", value: "greeshma@studio.in", url: "mailto:greeshma@studio.in", type: "email" },
      { label: "LinkedIn", value: "/in/greeshma-r", url: "https://linkedin.com/in/greeshma-r", type: "social" },
      { label: "Behance", value: "/greeshma", url: "https://behance.net/greeshma", type: "social" },
      { label: "Resume", value: "Download PDF", url: "#", type: "resume" },
    ],
  },
  {
    _id: "navigation",
    _type: "navigation",
    logo: "Greeshma R.",
    tagline: "— Designer, Illustrator",
    links: [
      { label: "Work", href: "#work" },
      { label: "Archive", href: "#archive" },
      { label: "Experience", href: "#experience" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    _id: "siteSettings",
    _type: "siteSettings",
    title: "Greeshma R — Product Designer, Visual Designer & Illustrator",
    description: "A digital exhibition by Greeshma R — designing thoughtful digital products through research, visual storytelling, and craft.",
    author: "Greeshma R",
    ogTitle: "Greeshma R — A Digital Exhibition",
    ogDescription: "Product design, visual design, illustration and research by Greeshma R.",
    footerCopyright: "© 2026 Greeshma R. — All work shown with permission.",
    footerTagline: "Designed & built with care · Bengaluru",
  },
  {
    _id: "errorPage",
    _type: "errorPage",
    notFoundEyebrow: "Not found",
    notFoundHeading: "404",
    notFoundMessage: "This page has quietly stepped out of the exhibition.",
    notFoundCta: "Return to the gallery",
    errorEyebrow: "Something interrupted the exhibit",
    errorHeading: "Please try again",
    errorCta: "Reload",
  },
];

  const transaction = client.transaction();

  for (const doc of [...singletons, ...caseStudies, ...archiveItems, ...timelineItems]) {
    transaction.createOrReplace(doc);
  }

  const result = await transaction.commit();
  console.log(`Migrated ${result.results.length} documents to Sanity`);
}

migrate().catch(console.error);
