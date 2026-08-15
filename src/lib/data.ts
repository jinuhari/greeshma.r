import { works as defaultWorks, type CaseStudy } from "./cms";
import archive1 from "@/assets/archive-1.jpg";
import archive2 from "@/assets/archive-2.jpg";
import archive3 from "@/assets/archive-3.jpg";
import archive4 from "@/assets/archive-4.jpg";
import archive5 from "@/assets/archive-5.jpg";
import archive6 from "@/assets/archive-6.jpg";
import heroArtwork from "@/assets/hero-artwork.jpg";
import portraitImage from "@/assets/greeshma bgremoved.png";
import { client } from "@/sanity/lib/client";
import {
  caseStudiesQuery,
  archiveItemsQuery,
  timelineItemsQuery,
  caseStudyBySlugQuery,
  resumesQuery,
  contactSectionQuery,
  heroSectionQuery,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export interface ArchiveItem {
  src: string;
  label: string;
  cat: string;
  year: string;
  medium: string;
  ratio: string;
  imageRef?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  where: string;
}

export interface Resume {
  role: string;
  json?: string;
  global?: boolean;
  pdfUrl?: string;
  pdfRef?: string;
}

export type ContactItemType = "email" | "linkedin" | "behance" | "social" | "resume";

export interface ContactItem {
  label: string;
  value: string;
  url: string;
  type: ContactItemType;
}

export interface ContactSection {
  heading: string;
  items: ContactItem[];
}

export interface HeroSection {
  eyebrow: string;
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImageUrl: string;
  backgroundImageRef?: string;
  portraitImageUrl: string;
  portraitImageRef?: string;
}

export const defaultHero: HeroSection = {
  eyebrow: "Design practice 2013 - present",
  heading: "Product interfaces shaped with an illustrator's eye and a research-led process.",
  description:
    "Greeshma R. designs digital products, visual systems, and brand-sensitive surfaces with a focus on clarity, rhythm, and finish.",
  ctaLabel: "View selected work",
  ctaHref: "#work",
  backgroundImageUrl: heroArtwork,
  portraitImageUrl: portraitImage,
};

export const defaultContact: ContactSection = {
  heading: "Email / Social / Resume",
  items: [
    {
      label: "Email",
      value: "hello@greeshma.design",
      url: "mailto:hello@greeshma.design",
      type: "email",
    },
    { label: "LinkedIn", value: "LinkedIn", url: "", type: "linkedin" },
    { label: "Behance", value: "Behance", url: "", type: "behance" },
  ],
};

export function defaultResumes(): Resume[] {
  return [
    {
      role: "Visual Design",
      global: true,
      json: JSON.stringify(
        {
          name: "Greeshma R",
          title: "Visual Designer",
          summary:
            "Multidisciplinary visual designer with 11+ years of experience across editorial, brand, illustration, and digital product surfaces.",
          experience: [
            {
              company: "Udaan",
              role: "Associate Manager, Visual Designer — UI",
              period: "2023 — Present",
              highlights: ["Brand campaigns", "Visual system design", "Design operations"],
            },
            {
              company: "Suzuki Innovation Centre",
              role: "Design Consultant",
              period: "2021 — 2022",
              highlights: ["Mobility interfaces", "User research", "Prototyping"],
            },
          ],
          education: [
            { degree: "M.Des Interaction Design", school: "IIT Hyderabad", year: "2020" },
            { degree: "BFA Applied Arts", school: "Bangalore University", year: "2016" },
          ],
          skills: [
            "Typography",
            "Layout",
            "Color Theory",
            "Iconography",
            "Illustration",
            "Brand Identity",
            "Editorial Design",
            "Motion Design",
          ],
        },
        null,
        2,
      ),
    },
    {
      role: "UI Design",
      json: JSON.stringify(
        {
          name: "Greeshma R",
          title: "UI / Product Designer",
          summary:
            "Product designer focused on mobile and web interfaces with a strong foundation in interaction design, design systems, and user research.",
          experience: [
            {
              company: "Udaan",
              role: "Associate Manager, Visual Designer — UI",
              period: "2023 — Present",
              highlights: ["Mobile app design", "Design system (240+ tokens)", "Campaign systems"],
            },
            {
              company: "Tomodachi",
              role: "Lead Interaction Designer",
              period: "2023",
              highlights: ["Android app", "UX research", "Usability testing"],
            },
          ],
          education: [
            { degree: "M.Des Interaction Design", school: "IIT Hyderabad", year: "2020" },
          ],
          skills: [
            "UI Design",
            "Interaction Design",
            "Prototyping",
            "Design Systems",
            "Accessibility",
            "Figma",
            "Principle",
            "Framer",
          ],
        },
        null,
        2,
      ),
    },
    {
      role: "Product Design",
      json: JSON.stringify(
        {
          name: "Greeshma R",
          title: "Product Designer",
          summary:
            "End-to-end product designer with experience across B2B commerce, mobile applications, and design systems at scale.",
          experience: [
            {
              company: "Udaan",
              role: "Associate Manager, Visual Designer — UI",
              period: "2023 — Present",
              highlights: [
                "B2B commerce platform",
                "Design system governance",
                "Cross-functional collaboration",
              ],
            },
            {
              company: "IISc NDIN",
              role: "Design Researcher",
              period: "2022",
              highlights: ["Field research", "Participatory design", "Artefact documentation"],
            },
          ],
          education: [
            { degree: "M.Des Interaction Design", school: "IIT Hyderabad", year: "2020" },
          ],
          skills: [
            "Product Strategy",
            "UX Research",
            "Interaction Design",
            "Design Systems",
            "Prototyping",
            "Visual Design",
            "Stakeholder Management",
          ],
        },
        null,
        2,
      ),
    },
    {
      role: "Creative Associate / Design",
      json: JSON.stringify(
        {
          name: "Greeshma R",
          title: "Creative Associate",
          summary:
            "Creative professional bridging design, research, and production — experienced in campaign execution, brand building, and cross-disciplinary collaboration.",
          experience: [
            {
              company: "Udaan",
              role: "Associate Manager, Visual Designer — UI",
              period: "2023 — Present",
              highlights: [
                "Campaign design & production",
                "Brand collateral",
                "Cross-team collaboration",
              ],
            },
            {
              company: "Qualin Wellness",
              role: "Brand & Visual Designer",
              period: "2023",
              highlights: ["Brand identity", "Guidelines (64 pages)", "Packaging design"],
            },
          ],
          education: [
            { degree: "M.Des Interaction Design", school: "IIT Hyderabad", year: "2020" },
            { degree: "BFA Applied Arts", school: "Bangalore University", year: "2016" },
          ],
          skills: [
            "Brand Identity",
            "Campaign Design",
            "Art Direction",
            "Illustration",
            "Typography",
            "Packaging",
            "Motion Design",
            "Team Collaboration",
          ],
        },
        null,
        2,
      ),
    },
  ];
}

export const defaultArchive: ArchiveItem[] = [
  {
    src: archive1,
    label: "Kalighat, revisited",
    cat: "Illustration",
    year: "2024",
    medium: "Digital gouache",
    ratio: "aspect-[3/4]",
  },
  {
    src: archive2,
    label: "AN/AW",
    cat: "Typography",
    year: "2023",
    medium: "Poster series",
    ratio: "aspect-[3/4]",
  },
  {
    src: archive3,
    label: "Rosa damascena",
    cat: "Fine Art",
    year: "2024",
    medium: "Watercolour on paper",
    ratio: "aspect-[3/4]",
  },
  {
    src: archive4,
    label: "Artisan Tea",
    cat: "Packaging",
    year: "2023",
    medium: "Kraft & foil print",
    ratio: "aspect-[1/1]",
  },
  {
    src: archive5,
    label: "Bengaluru, 07:14",
    cat: "Photography",
    year: "2023",
    medium: "35mm film",
    ratio: "aspect-[3/4]",
  },
  {
    src: archive6,
    label: "Kalamkari matrix",
    cat: "Pattern",
    year: "2022",
    medium: "Repeat print",
    ratio: "aspect-[1/1]",
  },
];

export const defaultTimeline: TimelineItem[] = [
  { year: "2013", title: "Fine Arts", where: "Where it began — canvas, pigment, patience." },
  {
    year: "2016",
    title: "Graphic Design",
    where: "Learning to speak in systems, grids and voice.",
  },
  { year: "2018", title: "Film Production", where: "Directing frame, light and story." },
  {
    year: "2020",
    title: "M.Des Interaction Design",
    where: "IIT Hyderabad — from artefact to interface.",
  },
  {
    year: "2021",
    title: "Suzuki Innovation Centre",
    where: "Designing mobility for the road ahead.",
  },
  {
    year: "2022",
    title: "IISc — National Design Innovation Network",
    where: "Field research with weaving communities.",
  },
  { year: "2023", title: "Udaan", where: "Associate Manager, Visual Designer — UI." },
];

function adaptSanityCaseStudy(s: any): CaseStudy {
  const coverRef = s.coverImage?.asset?._ref;
  return {
    slug: s.slug?.current || "",
    n: String(s.number || "").padStart(2, "0"),
    year: s.year || "",
    title: s.title || "",
    kicker: s.kicker || "",
    img: s.coverImage ? urlFor(s.coverImage).url() : "",
    imgRef: coverRef || undefined,
    role: s.role || "",
    summary: s.summary || "",
    categories: s.categories || [],
    outcomes: (s.outcomes || []).map((o: any) => ({ k: o.label || "", v: o.value || "" })),
    tone: s.tone || "terracotta",
    client: s.client || "",
    timeline: s.timeline || "",
    tools: s.tools || [],
    liveUrl: s.liveUrl || "",
    sections: (s.sections || []).map((sec: any) => {
      if (sec._type === "textSection")
        return { type: "text" as const, title: sec.title, content: sec.content };
      if (sec._type === "imageSection")
        return {
          type: (sec.fullBleed ? "full-bleed" : "image") as any,
          images: [
            {
              src: sec.image ? urlFor(sec.image).url() : "",
              caption: sec.caption || "",
              _ref: sec.image?.asset?._ref || undefined,
            },
          ],
        };
      if (sec._type === "imageTextSection")
        return {
          type: "image-text" as const,
          title: sec.title,
          content: sec.content,
          images: [
            {
              src: sec.image ? urlFor(sec.image).url() : "",
              _ref: sec.image?.asset?._ref || undefined,
            },
          ],
          imagePosition: sec.imagePosition || "left",
        };
      return { type: "text" as const, content: "" };
    }),
  };
}

async function fetchFromSanity<T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T | null> {
  try {
    const result: T = await client.fetch(query, params || {});
    return result ?? null;
  } catch (err) {
    console.error("[Sanity] Fetch error:", err);
    return null;
  }
}

export async function loadWorksFromSanity(): Promise<CaseStudy[]> {
  try {
    const result = await fetchFromSanity<any[]>(caseStudiesQuery);
    if (!result || result.length === 0) {
      console.warn("[Sanity] No case studies found, using static defaults");
      return loadWorks();
    }
    const adapted = result.map(adaptSanityCaseStudy).filter((c: any) => c.slug);
    if (adapted.length === 0) {
      console.warn("[Sanity] All case studies filtered out, using static defaults");
      return loadWorks();
    }
    const defaultsBySlug = new Map(defaultWorks.map((w) => [w.slug, w]));
    return adapted.map((s: CaseStudy) => {
      const fallback = defaultsBySlug.get(s.slug);
      if (!fallback) return s;
      return { ...s, img: s.img || fallback.img };
    });
  } catch (err) {
    console.error("[Sanity] Failed to load case studies:", err);
    return loadWorks();
  }
}

export async function loadCaseStudyFromSanity(slug: string): Promise<CaseStudy | undefined> {
  try {
    const result = await fetchFromSanity<any>(caseStudyBySlugQuery, { slug });
    if (!result) return loadWorks().find((w) => w.slug === slug);
    const adapted = adaptSanityCaseStudy(result);
    const fallback = defaultWorks.find((w) => w.slug === slug);
    if (!fallback) return adapted;
    return { ...adapted, img: adapted.img || fallback.img };
  } catch (err) {
    console.error("[Sanity] Failed to load case study:", err);
    return loadWorks().find((w) => w.slug === slug);
  }
}

export async function loadArchiveFromSanity(): Promise<ArchiveItem[]> {
  try {
    const result = await fetchFromSanity<any[]>(archiveItemsQuery);
    if (!result || result.length === 0) {
      console.warn("[Sanity] No archive items found, using static defaults");
      return loadArchive();
    }
    const adapted = result
      .map((item: any) => ({
        src: item.image ? urlFor(item.image).url() : "",
        label: item.label || "",
        cat: item.category || "",
        year: item.year || "",
        medium: item.medium || "",
        ratio: item.aspectRatio || "aspect-[3/4]",
        imageRef: item.image?.asset?._ref || undefined,
      }))
      .filter((i: ArchiveItem) => i.label);
    if (adapted.length === 0) {
      console.warn("[Sanity] All archive items filtered out, using static defaults");
      return loadArchive();
    }
    const defaultsByLabel = new Map(defaultArchive.map((a) => [a.label, a]));
    return adapted.map((a: ArchiveItem) => {
      const fallback = defaultsByLabel.get(a.label);
      if (!fallback) return a;
      return { ...a, src: a.src || fallback.src };
    });
  } catch (err) {
    console.error("[Sanity] Failed to load archive:", err);
    return loadArchive();
  }
}

export async function loadTimelineFromSanity(): Promise<TimelineItem[]> {
  try {
    const result = await fetchFromSanity<any[]>(timelineItemsQuery);
    if (!result || result.length === 0) return loadTimeline();
    const adapted = result
      .map((item: any) => ({
        year: item.year || "",
        title: item.title || "",
        where: item.where || "",
      }))
      .filter((i: TimelineItem) => i.title);
    return adapted.length > 0 ? adapted : loadTimeline();
  } catch (err) {
    console.error("[Sanity] Failed to load timeline:", err);
    return loadTimeline();
  }
}

export async function loadResumesFromSanity(): Promise<Resume[]> {
  try {
    const result = await fetchFromSanity<any[]>(resumesQuery);
    if (!result || result.length === 0) return defaultResumes();
    const adapted = result
      .map((item: any) => ({
        role: item.role || "",
        json: item.json || "",
        global: item.global || false,
        pdfUrl: item.pdf?.asset?.url || "",
        pdfRef: item.pdf?.asset?._id || item.pdf?.asset?._ref || undefined,
      }))
      .filter((item: Resume) => item.role);
    return adapted.length > 0 ? adapted : defaultResumes();
  } catch (err) {
    console.error("[Sanity] Failed to load resumes:", err);
    return defaultResumes();
  }
}

export async function loadContactFromSanity(): Promise<ContactSection> {
  try {
    const result = await fetchFromSanity<any>(contactSectionQuery);
    if (!result) return defaultContact;
    return {
      heading: result.heading || defaultContact.heading,
      items:
        result.items?.length > 0
          ? result.items.map((item: any) => ({
              label: item.label || "",
              value: item.value || "",
              url: item.url || "",
              type: item.type || "social",
            }))
          : defaultContact.items,
    };
  } catch (err) {
    console.error("[Sanity] Failed to load contact:", err);
    return defaultContact;
  }
}

export async function loadHeroFromSanity(): Promise<HeroSection> {
  try {
    const result = await fetchFromSanity<any>(heroSectionQuery);
    if (!result) return defaultHero;
    return {
      eyebrow: result.eyebrow || defaultHero.eyebrow,
      heading: result.heading || defaultHero.heading,
      description: result.description || defaultHero.description,
      ctaLabel: result.ctaLabel || defaultHero.ctaLabel,
      ctaHref: result.ctaHref || defaultHero.ctaHref,
      backgroundImageUrl: result.backgroundImage?.asset?.url || defaultHero.backgroundImageUrl,
      backgroundImageRef:
        result.backgroundImage?.asset?._id || result.backgroundImage?.asset?._ref || undefined,
      portraitImageUrl: result.portraitImage?.asset?.url || defaultHero.portraitImageUrl,
      portraitImageRef: result.portraitImage?.asset?._id || result.portraitImage?.asset?._ref || undefined,
    };
  } catch (err) {
    console.error("[Sanity] Failed to load hero:", err);
    return defaultHero;
  }
}

export function loadWorks(): CaseStudy[] {
  return defaultWorks;
}

export function loadArchive(): ArchiveItem[] {
  return defaultArchive;
}

export function loadTimeline(): TimelineItem[] {
  return defaultTimeline;
}
