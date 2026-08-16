import { client } from "./client";
import { caseStudiesQuery, archiveItemsQuery, timelineItemsQuery, resumesQuery, contactSectionQuery, heroSectionQuery } from "./queries";
import { projectId, dataset } from "@/sanity/env";
import type { CaseStudy, CaseStudySection } from "@/lib/cms";
import type { ArchiveItem, TimelineItem, Resume, ContactSection, HeroSection } from "@/lib/data";

export async function uploadImage(file: File): Promise<{ url: string; _ref: string }> {
  const asset = await client.assets.upload("image", file);
  return { url: asset.url, _ref: asset._id };
}

export async function uploadFile(file: File): Promise<{ url: string; _ref: string }> {
  const asset = await client.assets.upload("file", file, { filename: file.name });
  return { url: asset.url, _ref: asset._id };
}

function sanitizeId(str: string): string {
  return (
    str
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "untitled"
  );
}

const SANITY_CDN_RE = new RegExp(
  `https://cdn\\.sanity\\.io/images/${projectId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/${dataset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/([^?\\s]+)`,
);

function urlToAssetRef(url: string): { _type: "image"; asset: { _ref: string } } | undefined {
  const m = SANITY_CDN_RE.exec(url);
  if (!m) return undefined;
  const filename = m[1];
  const parts = filename.split("-");
  if (parts.length < 2) return undefined;
  const rest = parts.slice(0, -1).join("-");
  const dimsExt = parts[parts.length - 1];
  const dimMatch = dimsExt.match(/^(\d+x\d+)\./);
  const ref = dimMatch ? `image-${rest}-${dimMatch[1]}` : `image-${rest}`;
  return { _type: "image", asset: { _ref: ref } };
}

function resolveImage(
  value: string | { url: string; _ref?: string } | undefined,
  existing: any,
): any {
  if (!value) return existing || undefined;
  if (typeof value === "object" && value._ref) {
    return { _type: "image", asset: { _ref: value._ref } };
  }
  const url = typeof value === "string" ? value : value.url;
  if (!url) return existing || undefined;
  const ref = urlToAssetRef(url);
  if (ref) return ref;
  return existing || undefined;
}

function resolveFile(
  value: string | { url: string; _ref?: string } | undefined,
  existing: any,
): any {
  if (!value) return existing || undefined;
  if (typeof value === "object" && value._ref) {
    return { _type: "file", asset: { _ref: value._ref } };
  }
  return existing || undefined;
}

export async function syncAllToSanity(
  works: CaseStudy[],
  archive: ArchiveItem[],
  timeline: TimelineItem[],
  resumes?: Resume[],
  contact?: ContactSection,
  hero?: HeroSection,
) {
  const [existingCaseStudies, existingArchive, existingTimeline, existingResumes, existingContact, existingHero] =
    await Promise.all([
      client.fetch(caseStudiesQuery).catch(() => []),
      client.fetch(archiveItemsQuery).catch(() => []),
      client.fetch(timelineItemsQuery).catch(() => []),
      resumes ? client.fetch(resumesQuery).catch(() => []) : [],
      contact ? client.fetch(contactSectionQuery).catch(() => null) : null,
      hero ? client.fetch(heroSectionQuery).catch(() => null) : null,
    ]);

  const csMap = new Map<string, any>((existingCaseStudies || []).map((c: any) => [c._id, c]));
  const archMap = new Map<string, any>((existingArchive || []).map((a: any) => [a._id, a]));
  const tlMap = new Map<string, any>((existingTimeline || []).map((t: any) => [t._id, t]));

  const tx = client.transaction();

  const savedCsIds = new Set<string>();
  for (const work of works) {
    const id = `caseStudy-${sanitizeId(work.slug)}`;
    savedCsIds.add(id);
    const existing = csMap.get(id);
    const existingSections = existing?.sections || [];

    const sections = work.sections.map((s: CaseStudySection, i: number) => {
      if (s.type === "text") {
        return {
          _type: "textSection",
          title: s.title,
          content: s.content,
          _key: existingSections[i]?._key,
        };
      }
      if (s.type === "image" || s.type === "full-bleed") {
        const imgItem = s.images?.[0];
        return {
          _type: "imageSection",
          image: resolveImage(
            imgItem?._ref ? { url: imgItem.src, _ref: imgItem._ref } : imgItem?.src,
            existingSections[i]?.image,
          ),
          video: resolveFile(
            s.video?._ref ? { url: s.video.src, _ref: s.video._ref } : s.video?.src,
            existingSections[i]?.video,
          ),
          videoAutoplay: !!s.video?.autoplay,
          videoLoop: s.video ? !!s.video.loop : false,
          caption: imgItem?.caption,
          fullBleed: s.type === "full-bleed",
          _key: existingSections[i]?._key,
        };
      }
      if (s.type === "image-text") {
        const imgItem = s.images?.[0];
        return {
          _type: "imageTextSection",
          title: s.title,
          content: s.content,
          image: resolveImage(
            imgItem?._ref ? { url: imgItem.src, _ref: imgItem._ref } : imgItem?.src,
            existingSections[i]?.image,
          ),
          video: resolveFile(
            s.video?._ref ? { url: s.video.src, _ref: s.video._ref } : s.video?.src,
            existingSections[i]?.video,
          ),
          videoAutoplay: !!s.video?.autoplay,
          videoLoop: s.video ? !!s.video.loop : false,
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
      coverImage: resolveImage(
        work.imgRef ? { url: work.img, _ref: work.imgRef } : work.img,
        existing?.coverImage,
      ),
      role: work.role,
      summary: work.summary,
      categories: work.categories,
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

  const savedArchIds = new Set<string>();
  for (let i = 0; i < archive.length; i++) {
    const item = archive[i];
    const id = `archiveItem-${sanitizeId(item.label)}`;
    savedArchIds.add(id);
    const existing = archMap.get(id);
    tx.createOrReplace({
      _id: id,
      _type: "archiveItem",
      label: item.label,
      category: item.cat,
      year: item.year,
      medium: item.medium,
      aspectRatio: item.ratio,
      image: resolveImage(
        item.imageRef ? { url: item.src, _ref: item.imageRef } : item.src,
        existing?.image,
      ),
      video: resolveFile(
        item.videoRef && item.video ? { url: item.video, _ref: item.videoRef } : item.video,
        existing?.video,
      ),
      videoAutoplay: !!item.videoAutoplay,
      videoLoop: item.video ? !!item.videoLoop : false,
      orderRank: i,
    });
  }

  const savedTlIds = new Set<string>();
  for (let i = 0; i < timeline.length; i++) {
    const item = timeline[i];
    const id = `timelineItem-${sanitizeId(item.year)}-${sanitizeId(item.title)}`;
    savedTlIds.add(id);
    tx.createOrReplace({
      _id: id,
      _type: "timelineItem",
      year: item.year,
      title: item.title,
      where: item.where,
      orderRank: i,
    });
  }

  const savedResumeIds = new Set<string>();
  if (resumes) {
    const resumeMap = new Map<string, any>((existingResumes || []).map((r: any) => [r._id, r]));
    for (let i = 0; i < resumes.length; i++) {
      const r = resumes[i];
      const id = `resume-${sanitizeId(r.role)}`;
      savedResumeIds.add(id);
      tx.createOrReplace({
        _id: id,
        _type: "resume",
        role: r.role,
        json: r.json || "",
        pdf: resolveFile(
          r.pdfRef ? { url: r.pdfUrl || "", _ref: r.pdfRef } : r.pdfUrl,
          resumeMap.get(id)?.pdf,
        ),
        global: r.global || false,
        orderRank: i,
      });
    }
    for (const [id] of resumeMap) {
      if (!savedResumeIds.has(id)) tx.delete(id);
    }
  }

  if (contact) {
    tx.createOrReplace({
      _id: existingContact?._id || "contactSection",
      _type: "contactSection",
      heading: contact.heading,
      items: contact.items.map((item, index) => ({
        _key: existingContact?.items?.[index]?._key,
        label: item.label,
        value: item.value,
        url: item.url,
        type: item.type,
      })),
    });
  }

  if (hero) {
    tx.createOrReplace({
      _id: existingHero?._id || "heroSection",
      _type: "heroSection",
      eyebrow: hero.eyebrow,
      heading: hero.heading,
      description: hero.description,
      ctaLabel: hero.ctaLabel,
      ctaHref: hero.ctaHref,
      backgroundImage: resolveImage(
        hero.backgroundImageRef
          ? { url: hero.backgroundImageUrl, _ref: hero.backgroundImageRef }
          : hero.backgroundImageUrl,
        existingHero?.backgroundImage,
      ),
      portraitImage: resolveImage(
        hero.portraitImageRef
          ? { url: hero.portraitImageUrl, _ref: hero.portraitImageRef }
          : hero.portraitImageUrl,
        existingHero?.portraitImage,
      ),
    });
  }

  // Delete items that were removed from the lists
  for (const [id] of csMap) {
    if (!savedCsIds.has(id)) tx.delete(id);
  }
  for (const [id] of archMap) {
    if (!savedArchIds.has(id)) tx.delete(id);
  }
  for (const [id] of tlMap) {
    if (!savedTlIds.has(id)) tx.delete(id);
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
