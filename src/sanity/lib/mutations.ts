import { client } from "./client";
import type { CaseStudy, CaseStudySection } from "@/lib/cms";
import type { ArchiveItem, TimelineItem } from "@/lib/data";

async function getExistingDoc(id: string): Promise<Record<string, any> | null> {
  try {
    return await client.getDocument(id);
  } catch {
    return null;
  }
}

export async function syncCaseStudyToSanity(work: CaseStudy) {
  const id = `caseStudy-${work.slug}`;
  const existing = await getExistingDoc(id);

  const existingCover = existing?.coverImage;
  const existingSections = existing?.sections || [];

  const sections = work.sections.map((s: CaseStudySection, i: number) => {
    if (s.type === "text") {
      return { _type: "textSection", title: s.title, content: s.content, _key: existingSections[i]?._key };
    }
    if (s.type === "image" || s.type === "full-bleed") {
      return {
        _type: "imageSection",
        image: existingSections[i]?.image || undefined,
        caption: s.images?.[0]?.caption,
        fullBleed: s.type === "full-bleed",
        _key: existingSections[i]?._key,
      };
    }
    if (s.type === "image-text") {
      return {
        _type: "imageTextSection",
        title: s.title,
        content: s.content,
        image: existingSections[i]?.image || undefined,
        imagePosition: s.imagePosition || "left",
        _key: existingSections[i]?._key,
      };
    }
    return { _type: "textSection", content: "" };
  });

  const doc = {
    _id: id,
    _type: "caseStudy",
    title: work.title,
    slug: { _type: "slug", current: work.slug },
    number: parseInt(work.n) || 0,
    year: work.year,
    kicker: work.kicker,
    coverImage: existingCover || undefined,
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
  const id = `archiveItem-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
  const existing = await getExistingDoc(id);

  const doc = {
    _id: id,
    _type: "archiveItem",
    label: item.label,
    category: item.cat,
    year: item.year,
    medium: item.medium,
    aspectRatio: item.ratio,
    image: existing?.image || undefined,
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
    try {
      await syncCaseStudyToSanity(work);
    } catch (e) {
      console.error("Failed to sync case study:", work.slug, e);
    }
  }
  for (let i = 0; i < archive.length; i++) {
    try {
      await syncArchiveItemToSanity(archive[i], i);
    } catch (e) {
      console.error("Failed to sync archive item:", archive[i].label, e);
    }
  }
  for (let i = 0; i < timeline.length; i++) {
    try {
      await syncTimelineItemToSanity(timeline[i], i);
    } catch (e) {
      console.error("Failed to sync timeline item:", timeline[i].title, e);
    }
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
