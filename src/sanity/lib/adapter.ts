import { client } from "./client";
import {
  caseStudiesQuery,
  caseStudyBySlugQuery,
  archiveItemsQuery,
  timelineItemsQuery,
  heroSectionQuery,
  marqueeSectionQuery,
  skillsSectionQuery,
  aboutSectionQuery,
  contactSectionQuery,
} from "./queries";
import { urlFor } from "./image";
import { works as defaultWorks, type CaseStudy, type CaseStudySection } from "@/lib/cms";
import { defaultArchive, type ArchiveItem } from "@/lib/data";
import { defaultTimeline, type TimelineItem } from "@/lib/data";

function adaptSanityCaseStudy(sanityCaseStudy: any): CaseStudy | null {
  if (!sanityCaseStudy?.slug?.current) return null;
  return {
    slug: sanityCaseStudy.slug.current,
    n: String(sanityCaseStudy.number || "").padStart(2, "0"),
    year: sanityCaseStudy.year || "",
    title: sanityCaseStudy.title || "",
    kicker: sanityCaseStudy.kicker || "",
    img: sanityCaseStudy.coverImage
      ? urlFor(sanityCaseStudy.coverImage).width(1200).url()
      : "",
    role: sanityCaseStudy.role || "",
    summary: sanityCaseStudy.summary || "",
    outcomes: (sanityCaseStudy.outcomes || []).map((o: any) => ({
      k: o.label || "",
      v: o.value || "",
    })),
    tone: sanityCaseStudy.tone || "terracotta",
    client: sanityCaseStudy.client || "",
    timeline: sanityCaseStudy.timeline || "",
    tools: sanityCaseStudy.tools || [],
    liveUrl: sanityCaseStudy.liveUrl || "",
    sections: (sanityCaseStudy.sections || []).map((s: any): CaseStudySection => {
      if (s._type === "textSection") {
        return { type: "text", title: s.title || "", content: s.content || "" };
      }
      if (s._type === "imageSection") {
        return {
          type: s.fullBleed ? "full-bleed" : "image",
          images: [
            {
              src: s.image ? urlFor(s.image).width(1200).url() : "",
              caption: s.caption || "",
            },
          ],
        };
      }
      if (s._type === "imageTextSection") {
        return {
          type: "image-text",
          title: s.title || "",
          content: s.content || "",
          images: [{ src: s.image ? urlFor(s.image).width(800).url() : "" }],
          imagePosition: s.imagePosition || "left",
        };
      }
      return { type: "text", content: "" };
    }),
  };
}

function adaptSanityArchiveItem(item: any): ArchiveItem | null {
  if (!item) return null;
  return {
    src: item.image ? urlFor(item.image).width(600).url() : "",
    label: item.label || "",
    cat: item.category || "",
    year: item.year || "",
    medium: item.medium || "",
    ratio: item.aspectRatio || "aspect-[3/4]",
  };
}

function adaptSanityTimelineItem(item: any): TimelineItem | null {
  if (!item) return null;
  return {
    year: item.year || "",
    title: item.title || "",
    where: item.where || "",
  };
}

export async function fetchCaseStudiesFromSanity(): Promise<CaseStudy[]> {
  try {
    const result = await client.fetch(caseStudiesQuery);
    if (!result || !Array.isArray(result) || result.length === 0) return [];
    const adapted = result.map(adaptSanityCaseStudy).filter(Boolean) as CaseStudy[];
    return adapted.length > 0 ? adapted : [];
  } catch {
    return [];
  }
}

export async function fetchCaseStudyBySlugFromSanity(slug: string): Promise<CaseStudy | null> {
  try {
    const result = await client.fetch(caseStudyBySlugQuery, { slug });
    if (!result) return null;
    return adaptSanityCaseStudy(result);
  } catch {
    return null;
  }
}

export async function fetchArchiveFromSanity(): Promise<ArchiveItem[]> {
  try {
    const result = await client.fetch(archiveItemsQuery);
    if (!result || !Array.isArray(result) || result.length === 0) return [];
    const adapted = result.map(adaptSanityArchiveItem).filter(Boolean) as ArchiveItem[];
    return adapted.length > 0 ? adapted : [];
  } catch {
    return [];
  }
}

export async function fetchTimelineFromSanity(): Promise<TimelineItem[]> {
  try {
    const result = await client.fetch(timelineItemsQuery);
    if (!result || !Array.isArray(result) || result.length === 0) return [];
    const adapted = result.map(adaptSanityTimelineItem).filter(Boolean) as TimelineItem[];
    return adapted.length > 0 ? adapted : [];
  } catch {
    return [];
  }
}

export async function fetchHeroData() {
  try {
    return await client.fetch(heroSectionQuery);
  } catch {
    return null;
  }
}

export async function fetchMarqueeData() {
  try {
    return await client.fetch(marqueeSectionQuery);
  } catch {
    return null;
  }
}

export async function fetchSkillsData() {
  try {
    return await client.fetch(skillsSectionQuery);
  } catch {
    return null;
  }
}

export async function fetchAboutData() {
  try {
    return await client.fetch(aboutSectionQuery);
  } catch {
    return null;
  }
}

export async function fetchContactData() {
  try {
    return await client.fetch(contactSectionQuery);
  } catch {
    return null;
  }
}

export { defaultArchive, defaultTimeline, defaultWorks };
