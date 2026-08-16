import workUdaan from "@/assets/work-udaan.jpg";
import workTomodachi from "@/assets/work-tomodachi.jpg";
import workQualin from "@/assets/work-qualin.jpg";
import workResearch from "@/assets/work-research.jpg";

export interface Outcome {
  k: string;
  v: string;
}

export interface MediaItem {
  src: string;
  caption?: string;
  _ref?: string;
}

export interface VideoMedia {
  src: string;
  _ref?: string;
  autoplay: boolean;
  loop: boolean;
}

export type SectionType = "text" | "image" | "image-text" | "full-bleed";

export interface CaseStudySection {
  type: SectionType;
  title?: string;
  content?: string;
  images?: MediaItem[];
  video?: VideoMedia;
  imagePosition?: "left" | "right";
}

export interface CaseStudy {
  slug: string;
  n: string;
  year: string;
  title: string;
  kicker: string;
  img: string;
  imgRef?: string;
  role: string;
  summary: string;
  /** Flexible taxonomy used to group work on the home page and in Sanity. */
  categories: string[];
  outcomes: Outcome[];
  tone: string;
  sections: CaseStudySection[];
  client?: string;
  timeline?: string;
  tools?: string[];
  liveUrl?: string;
}

export const works: CaseStudy[] = [
  {
    slug: "udaan",
    n: "01",
    year: "2024",
    title: "Udaan",
    kicker: "Product · Visual System · Campaigns",
    img: workUdaan,
    role: "Associate Manager, Visual Designer — UI",
    summary:
      "Reshaping India's largest B2B commerce app: a mobile experience, brand campaigns and a scalable visual system used across product surfaces.",
    categories: ["UI/UX", "Visual Design"],
    outcomes: [
      { k: "Retail partners", v: "3M+" },
      { k: "Design system tokens", v: "240+" },
      { k: "Campaigns shipped", v: "18" },
    ],
    tone: "terracotta",
    client: "Udaan (B2B Commerce)",
    timeline: "8 months",
    tools: ["Figma", "After Effects", "Lottie", "Rive", "Illustrator"],
    sections: [
      {
        type: "text",
        title: "The Challenge",
        content:
          "Udaan's existing visual language had grown organically across surfaces, resulting in inconsistency between the mobile app, web dashboard, and marketing campaigns. As India's largest B2B commerce platform serving millions of retail partners, even small UI friction cascades into real business impact. The challenge was to create a unified design system that could scale across product surfaces while maintaining a distinct visual identity for brand campaigns.",
      },
      {
        type: "full-bleed",
        images: [{ src: workUdaan, caption: "Udaan mobile app — redesigned partner dashboard" }],
      },
      {
        type: "text",
        title: "The Approach",
        content:
          "We started with an audit of every surface — mobile app, web dashboard, email, and marketing — documenting every component, colour, and typographic usage. From there we distilled a token-based design system with 240+ design tokens covering colour, spacing, typography, and motion. The system was built iteratively: each component was redesigned, documented, and validated through usability testing with retail partners before being rolled out at scale.",
      },
      {
        type: "image-text",
        title: "Campaign System",
        content:
          "Beyond the product interface, I designed a campaign visual system that could flex across seasonal promotions, regional festivals, and partner onboarding drives. Each campaign used a modular kit of components — hero blocks, product cards, offer strips — that could be assembled in different configurations while staying visually coherent with the broader brand. The system shipped 18 campaigns in its first quarter.",
        images: [{ src: workUdaan }],
        imagePosition: "right",
      },
      {
        type: "text",
        title: "Impact",
        content:
          "The unified design system reduced design-to-dev handoff time by 40% and eliminated visual inconsistencies that had previously required manual QA. The campaign system enabled the marketing team to produce high-quality campaign assets independently, reducing dependency on the design team by 60% for recurring campaign formats. Most importantly, retail partners reported a noticeably smoother experience — task completion rates improved across key flows.",
      },
    ],
  },
  {
    slug: "tomodachi",
    n: "02",
    year: "2023",
    title: "Tomodachi",
    kicker: "Android · Interaction · Research",
    img: workTomodachi,
    role: "Lead Interaction Designer",
    summary:
      "A companion app that teaches Japanese through daily rituals — grounded in ethnographic interviews and a soft, warm visual language.",
    categories: ["UI/UX", "UX Research"],
    outcomes: [
      { k: "Study cohort", v: "42 learners" },
      { k: "Retention lift", v: "+38%" },
      { k: "Sessions", v: "12 rounds" },
    ],
    tone: "coral",
    client: "Independent research project",
    timeline: "6 months",
    tools: ["Figma", "Principle", "Android Studio", "Maze"],
    sections: [
      {
        type: "text",
        title: "The Challenge",
        content:
          "Language learning apps often treat users as passive recipients of information — flashcards, repetition drills, gamified quizzes. Tomodachi started from a different premise: what if learning a language felt less like study and more like a daily ritual? The challenge was to design an Android companion app that taught Japanese through gentle, habitual interactions rather than traditional pedagogy.",
      },
      {
        type: "image",
        images: [{ src: workTomodachi, caption: "Tomodachi — daily ritual interface" }],
      },
      {
        type: "text",
        title: "Research",
        content:
          "I conducted 18 ethnographic interviews with Japanese language learners across Bangalore, ranging from absolute beginners to advanced speakers preparing for the JLPT N2. The key insight was that successful learners had built small daily rituals — a morning vocab review with coffee, listening to Japanese podcasts during commutes, writing a single sentence before bed. The app needed to fit into these existing rituals, not replace them.",
      },
      {
        type: "image-text",
        title: "Design Response",
        content:
          "Tomodachi uses a soft, warm visual language — coral tones, rounded cards, handwritten-style typography — to create a feeling of a friendly companion rather than a teacher. Each lesson is framed as a 'daily ritual' with a consistent structure: a warm-up, a new concept, a practice session, and a reflection. The interaction design emphasises micro-feedback — subtle haptics, gentle animations, and encouraging copy — to create an emotionally safe learning environment.",
        images: [{ src: workTomodachi }],
        imagePosition: "right",
      },
      {
        type: "text",
        title: "Outcomes",
        content:
          "Over 12 rounds of usability testing with 42 learners, Tomodachi achieved a 38% improvement in 30-day retention compared to baseline language apps. The qualitative feedback was even more telling: learners described the app as 'comforting' and 'something I actually look forward to opening'. The research findings were presented at the Interaction Design conference and informed a set of design principles for emotionally sustainable learning tools.",
      },
    ],
  },
  {
    slug: "qualin",
    n: "03",
    year: "2023",
    title: "Qualin",
    kicker: "Brand · Identity · Typography",
    img: workQualin,
    role: "Brand & Visual Designer",
    summary:
      "A quiet, considered identity for a wellness house — from wordmark to editorial guidelines to a full typographic system.",
    categories: ["Graphic Design", "Visual Design", "Branding"],
    outcomes: [
      { k: "Wordmarks explored", v: "27" },
      { k: "Type pairings", v: "9" },
      { k: "Guideline pages", v: "64" },
    ],
    tone: "forest",
    client: "Qualin Wellness",
    timeline: "4 months",
    tools: ["Illustrator", "InDesign", "Figma", "Glyphs"],
    sections: [
      {
        type: "text",
        title: "The Brief",
        content:
          "Qualin is a wellness house rooted in traditional Indian wellness practices — Ayurveda, yoga, and meditation — reimagined for a contemporary audience. The founders wanted an identity that felt neither clinical nor overly spiritual, but instead 'quietly considered'. Every touchpoint — from the wordmark to the packaging to the editorial content — needed to communicate trust, craft, and a deep respect for tradition.",
      },
      {
        type: "full-bleed",
        images: [{ src: workQualin, caption: "Qualin brand identity — wordmark exploration" }],
      },
      {
        type: "text",
        title: "Exploration",
        content:
          "The wordmark went through 27 iterations, each exploring different weights, proportions, and relationships between the letterforms. The final mark draws from the proportions of classical Indian manuscript typography while using a contemporary geometric structure. The typographic system pairs a refined serif for editorial content with a humanist sans-serif for interfaces, creating a dialogue between tradition and modernity.",
      },
      {
        type: "image-text",
        title: "The System",
        content:
          "Beyond the logo, I built a comprehensive brand system covering colour (a muted palette drawn from natural pigments), texture (a custom pattern system based on traditional textile motifs), photography direction (soft, natural light with an emphasis on materiality), and editorial layout principles. The 64-page brand guideline document became the operational backbone for all brand communications.",
        images: [{ src: workQualin }],
        imagePosition: "left",
      },
      {
        type: "text",
        title: "In Practice",
        content:
          "The identity has been applied across product packaging, a website, social media templates, and studio collateral. The design has been praised for its restraint — in a category that often defaults to loud, aspirational visuals, Qualin's quiet confidence stands apart. The founders reported that the brand guidelines have made it significantly easier to onboard new collaborators while maintaining visual consistency.",
      },
    ],
  },
  {
    slug: "weaving-voices",
    n: "04",
    year: "2022",
    title: "Weaving Voices",
    kicker: "UX Research · Participatory Design",
    img: workResearch,
    role: "Design Researcher, IISc NDIN",
    summary:
      "A participatory study with weaving communities in rural Karnataka — documenting practice, ritual and the everyday tools of a craft in transition.",
    categories: ["UX Research", "Visual Design"],
    outcomes: [
      { k: "Field visits", v: "6 villages" },
      { k: "Interviews", v: "31" },
      { k: "Artefacts", v: "120+" },
    ],
    tone: "indigo",
    client: "IISc National Design Innovation Network",
    timeline: "10 months",
    tools: ["Ethnography", "Participatory workshops", "Photography", "Artefact analysis"],
    sections: [
      {
        type: "text",
        title: "Context",
        content:
          "The handloom weaving communities of rural Karnataka represent centuries of craft knowledge passed down through generations. Yet this knowledge exists almost entirely as oral tradition — undocumented, unarchived, and increasingly at risk as younger generations move away from the craft. The brief was to document not just the technical process of weaving, but the rituals, tools, and tacit knowledge that constitute the weaver's world.",
      },
      {
        type: "full-bleed",
        images: [
          { src: workResearch, caption: "Field documentation — Karnataka weaving communities" },
        ],
      },
      {
        type: "image-text",
        title: "Methodology",
        content:
          "Over 10 months, I conducted 31 semi-structured interviews across 6 villages in Karnataka, accompanied by photographic documentation of tools, workspaces, and finished textiles. The research used participatory design methods — weavers were invited to map their own workflows, annotate photographs of their looms, and share stories about specific tools and their origins. This approach yielded rich, textured data that a traditional interview protocol would have missed.",
        images: [{ src: workResearch }],
        imagePosition: "right",
      },
      {
        type: "text",
        title: "Key Findings",
        content:
          "The research revealed that weaving knowledge is encoded not just in technical skill but in embodied practice — the rhythm of the shuttle, the tension of the warp, the muscle memory of the weaver's hands. Tools are not just instruments but repositories of personal and family history. The study documented 120+ artefacts, including looms, shuttles, bobbins, and dyeing equipment, each with its own story and significance.",
      },
      {
        type: "text",
        title: "Impact",
        content:
          "The research output included a visual archive, a set of design recommendations for interventions that could support weaving communities, and a methodology paper presented at a design research conference. The participatory approach has since been adopted by other researchers at the NDIN for similar craft documentation projects. The archive remains accessible to the weaving communities themselves, serving as a record of their own practice.",
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return works.find((w) => w.slug === slug);
}

export function getCaseStudyByTitle(title: string): CaseStudy | undefined {
  return works.find((w) => w.title.toLowerCase() === title.toLowerCase());
}
