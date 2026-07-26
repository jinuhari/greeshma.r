import { client } from "./client";
import { caseStudiesQuery, archiveItemsQuery } from "./queries";
import type { CaseStudy, CaseStudySection } from "@/lib/cms";
import type { ArchiveItem, TimelineItem } from "@/lib/data";

function sanitizeId(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "untitled";
}

export async function syncAllToSanity(works: CaseStudy[], archive: ArchiveItem[], timeline: TimelineItem[]) {
  const [existingCaseStudies, existingArchive] = await Promise.all([
    client.fetch(caseStudiesQuery).catch(() => []),
    client.fetch(archiveItemsQuery).catch(() => []),
  ]);

  const csMap = new Map((existingCaseStudies || []).map((c: any) => [c._id, c]));
  const archMap = new Map((existingArchive || []).map((a: any) => [a._id, a]));

  const tx = client.transaction();

  for (const work of works) {
    const id = `caseStudy-${sanitizeId(work.slug)}`;
    const existing = csMap.get(id);
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

    tx.createOrReplace({
      _id: id,
      _type: "caseStudy",
      title: work.title,
      slug: { _type: "slug", current: work.slug },
      number: parseInt(work.n) || 0,
      year: work.year,
      kicker: work.kicker,
      coverImage: existing?.coverImage || undefined,
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
    });
  }

  for (let i = 0; i < archive.length; i++) {
    const item = archive[i];
    const id = `archiveItem-${sanitizeId(item.label)}`;
    const existing = archMap.get(id);
    tx.createOrReplace({
      _id: id,
      _type: "archiveItem",
      label: item.label,
      category: item.cat,
      year: item.year,
      medium: item.medium,
      aspectRatio: item.ratio,
      image: existing?.image || undefined,
      orderRank: i,
    });
  }

  for (let i = 0; i < timeline.length; i++) {
    const item = timeline[i];
    tx.createOrReplace({
      _id: `timelineItem-${sanitizeId(item.year)}-${sanitizeId(item.title)}`,
      _type: "timelineItem",
      year: item.year,
      title: item.title,
      where: item.where,
      orderRank: i,
    });
  }

  await tx.commit();
}

export async function deleteCaseStudyFromSanity(slug: string) {
  await client.delete(`caseStudy-${sanitizeId(slug)}`);
}

export async function deleteArchiveItemFromSanity(label: string) {
  await client.delete(`archiveItem-${sanitizeId(label)}`);
}

export async function deleteTimelineItemFromSanity(year: string, title: string) {
  await client.delete(`timelineItem-${sanitizeId(year)}-${sanitizeId(title)}`);
}
