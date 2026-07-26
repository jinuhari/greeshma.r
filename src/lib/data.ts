import { works as defaultWorks, type CaseStudy } from "./cms";
import archive1 from "@/assets/archive-1.jpg";
import archive2 from "@/assets/archive-2.jpg";
import archive3 from "@/assets/archive-3.jpg";
import archive4 from "@/assets/archive-4.jpg";
import archive5 from "@/assets/archive-5.jpg";
import archive6 from "@/assets/archive-6.jpg";
import { client } from "@/sanity/lib/client";
import { caseStudiesQuery, archiveItemsQuery, timelineItemsQuery, caseStudyBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export interface ArchiveItem {
  src: string;
  label: string;
  cat: string;
  year: string;
  medium: string;
  ratio: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  where: string;
}

export const defaultArchive: ArchiveItem[] = [
  { src: archive1, label: "Kalighat, revisited", cat: "Illustration", year: "2024", medium: "Digital gouache", ratio: "aspect-[3/4]" },
  { src: archive2, label: "AN/AW", cat: "Typography", year: "2023", medium: "Poster series", ratio: "aspect-[3/4]" },
  { src: archive3, label: "Rosa damascena", cat: "Fine Art", year: "2024", medium: "Watercolour on paper", ratio: "aspect-[3/4]" },
  { src: archive4, label: "Artisan Tea", cat: "Packaging", year: "2023", medium: "Kraft & foil print", ratio: "aspect-[1/1]" },
  { src: archive5, label: "Bengaluru, 07:14", cat: "Photography", year: "2023", medium: "35mm film", ratio: "aspect-[3/4]" },
  { src: archive6, label: "Kalamkari matrix", cat: "Pattern", year: "2022", medium: "Repeat print", ratio: "aspect-[1/1]" },
];

export const defaultTimeline: TimelineItem[] = [
  { year: "2013", title: "Fine Arts", where: "Where it began — canvas, pigment, patience." },
  { year: "2016", title: "Graphic Design", where: "Learning to speak in systems, grids and voice." },
  { year: "2018", title: "Film Production", where: "Directing frame, light and story." },
  { year: "2020", title: "M.Des Interaction Design", where: "IIT Hyderabad — from artefact to interface." },
  { year: "2021", title: "Suzuki Innovation Centre", where: "Designing mobility for the road ahead." },
  { year: "2022", title: "IISc — National Design Innovation Network", where: "Field research with weaving communities." },
  { year: "2023", title: "Udaan", where: "Associate Manager, Visual Designer — UI." },
];

function adaptSanityCaseStudy(s: any): CaseStudy {
  return {
    slug: s.slug?.current || "",
    n: String(s.number || "").padStart(2, "0"),
    year: s.year || "",
    title: s.title || "",
    kicker: s.kicker || "",
    img: s.coverImage ? urlFor(s.coverImage).width(1200).url() : "",
    role: s.role || "",
    summary: s.summary || "",
    outcomes: (s.outcomes || []).map((o: any) => ({ k: o.label || "", v: o.value || "" })),
    tone: s.tone || "terracotta",
    client: s.client || "",
    timeline: s.timeline || "",
    tools: s.tools || [],
    liveUrl: s.liveUrl || "",
    sections: (s.sections || []).map((sec: any) => {
      if (sec._type === "textSection") return { type: "text" as const, title: sec.title, content: sec.content };
      if (sec._type === "imageSection") return { type: (sec.fullBleed ? "full-bleed" : "image") as any, images: [{ src: sec.image ? urlFor(sec.image).width(1200).url() : "", caption: sec.caption || "" }] };
      if (sec._type === "imageTextSection") return { type: "image-text" as const, title: sec.title, content: sec.content, images: [{ src: sec.image ? urlFor(sec.image).width(800).url() : "" }], imagePosition: sec.imagePosition || "left" };
      return { type: "text" as const, content: "" };
    }),
  };
}

export async function loadWorksFromSanity(): Promise<CaseStudy[]> {
  try {
    const result = await client.fetch(caseStudiesQuery);
    if (!result || !Array.isArray(result) || result.length === 0) return loadWorks();
    const adapted = result.map(adaptSanityCaseStudy).filter((c: any) => c.slug);
    return adapted.length > 0 ? adapted : loadWorks();
  } catch {
    return loadWorks();
  }
}

export async function loadCaseStudyFromSanity(slug: string): Promise<CaseStudy | undefined> {
  try {
    const result = await client.fetch(caseStudyBySlugQuery, { slug });
    if (!result) return loadWorks().find((w) => w.slug === slug);
    return adaptSanityCaseStudy(result);
  } catch {
    return loadWorks().find((w) => w.slug === slug);
  }
}

export async function loadArchiveFromSanity(): Promise<ArchiveItem[]> {
  try {
    const result = await client.fetch(archiveItemsQuery);
    if (!result || !Array.isArray(result) || result.length === 0) return loadArchive();
    const adapted = result.map((item: any) => ({
      src: item.image ? urlFor(item.image).width(600).url() : "",
      label: item.label || "",
      cat: item.category || "",
      year: item.year || "",
      medium: item.medium || "",
      ratio: item.aspectRatio || "aspect-[3/4]",
    })).filter((i: ArchiveItem) => i.label);
    return adapted.length > 0 ? adapted : loadArchive();
  } catch {
    return loadArchive();
  }
}

export async function loadTimelineFromSanity(): Promise<TimelineItem[]> {
  try {
    const result = await client.fetch(timelineItemsQuery);
    if (!result || !Array.isArray(result) || result.length === 0) return loadTimeline();
    const adapted = result.map((item: any) => ({
      year: item.year || "",
      title: item.title || "",
      where: item.where || "",
    })).filter((i: TimelineItem) => i.title);
    return adapted.length > 0 ? adapted : loadTimeline();
  } catch {
    return loadTimeline();
  }
}

export function loadWorks(): CaseStudy[] {
  try {
    const saved = localStorage.getItem("cms-works");
    if (saved) {
      const parsed = JSON.parse(saved) as CaseStudy[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return defaultWorks;
}

export function saveWorks(works: CaseStudy[]) {
  localStorage.setItem("cms-works", JSON.stringify(works));
}

export function loadArchive(): ArchiveItem[] {
  try {
    const saved = localStorage.getItem("cms-archive");
    if (saved) {
      const parsed = JSON.parse(saved) as ArchiveItem[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return defaultArchive;
}

export function saveArchive(items: ArchiveItem[]) {
  localStorage.setItem("cms-archive", JSON.stringify(items));
}

export function loadTimeline(): TimelineItem[] {
  try {
    const saved = localStorage.getItem("cms-timeline");
    if (saved) {
      const parsed = JSON.parse(saved) as TimelineItem[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return defaultTimeline;
}

export function saveTimeline(items: TimelineItem[]) {
  localStorage.setItem("cms-timeline", JSON.stringify(items));
}
