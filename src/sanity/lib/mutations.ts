import { client } from "./client";
import { urlFor } from "./image";
import type { CaseStudy, CaseStudySection } from "@/lib/cms";
import type { ArchiveItem, TimelineItem } from "@/lib/data";

async function uploadImage(imageUrl: string): Promise<string | undefined> {
  if (!imageUrl || imageUrl.startsWith("http")) return undefined;
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const asset = await client.assets.upload("image", blob);
    return asset._id;
  } catch {
    return undefined;
  }
}

export async function syncCaseStudyToSanity(work: CaseStudy) {
  const sections = work.sections.map((s: CaseStudySection) => {
    if (s.type === "text") {
      return { _type: "textSection", title: s.title, content: s.content };
    }
    if (s.type === "image" || s.type === "full-bleed") {
      return {
        _type: "imageSection",
        image: s.images?.[0]?.src ? { _type: "image", asset: { _ref: s.images[0].src } } : undefined,
        caption: s.images?.[0]?.caption,
        fullBleed: s.type === "full-bleed",
      };
    }
    if (s.type === "image-text") {
      return {
        _type: "imageTextSection",
        title: s.title,
        content: s.content,
        image: s.images?.[0]?.src ? { _type: "image", asset: { _ref: s.images[0].src } } : undefined,
        imagePosition: s.imagePosition || "left",
      };
    }
    return { _type: "textSection", content: "" };
  });

  const doc = {
    _id: `caseStudy-${work.slug}`,
    _type: "caseStudy",
    title: work.title,
    slug: { _type: "slug", current: work.slug },
    number: parseInt(work.n) || 0,
    year: work.year,
    kicker: work.kicker,
    coverImage: work.img ? { _type: "image", asset: { _ref: work.img } } : undefined,
    role: work.role,
    summary: work.summary,
    outcomes: work.outcomes.map((o) => ({ label: o.k, value: o.v })),
    tone: work.tone,
    client: work.client,
    timeline: work.timeline,
    tools: work.tools,
    liveUrl: work.liveUrl,
    orderRank: parseInt(work.n) || 0,
    sections,
  };

  await client.createOrReplace(doc);
}

export async function syncArchiveItemToSanity(item: ArchiveItem, index: number) {
  const doc = {
    _id: `archiveItem-${item.label.toLowerCase().replace(/\s+/g, "-")}`,
    _type: "archiveItem",
    label: item.label,
    category: item.cat,
    year: item.year,
    medium: item.medium,
    aspectRatio: item.ratio,
    image: item.src ? { _type: "image", asset: { _ref: item.src } } : undefined,
    orderRank: index,
  };

  await client.createOrReplace(doc);
}

export async function syncTimelineItemToSanity(item: TimelineItem, index: number) {
  const doc = {
    _id: `timelineItem-${item.year}-${item.title.toLowerCase().replace(/\s+/g, "-")}`,
    _type: "timelineItem",
    year: item.year,
    title: item.title,
    where: item.where,
    orderRank: index,
  };

  await client.createOrReplace(doc);
}

export async function syncAllToSanity(works: CaseStudy[], archive: ArchiveItem[], timeline: TimelineItem[]) {
  for (const work of works) {
    await syncCaseStudyToSanity(work);
  }
  for (let i = 0; i < archive.length; i++) {
    await syncArchiveItemToSanity(archive[i], i);
  }
  for (let i = 0; i < timeline.length; i++) {
    await syncTimelineItemToSanity(timeline[i], i);
  }
}

export async function deleteCaseStudyFromSanity(slug: string) {
  await client.delete(`caseStudy-${slug}`);
}

export async function deleteArchiveItemFromSanity(label: string) {
  await client.delete(`archiveItem-${label.toLowerCase().replace(/\s+/g, "-")}`);
}

export async function deleteTimelineItemFromSanity(year: string, title: string) {
  await client.delete(`timelineItem-${year}-${title.toLowerCase().replace(/\s+/g, "-")}`);
}
