import { useLiveQuery } from "@sanity/preview-kit";
import { client } from "./client";
import {
  siteSettingsQuery,
  navigationQuery,
  heroSectionQuery,
  marqueeSectionQuery,
  skillsSectionQuery,
  aboutSectionQuery,
  contactSectionQuery,
  footerSettingsQuery,
  caseStudiesQuery,
  caseStudyBySlugQuery,
  archiveItemsQuery,
  timelineItemsQuery,
} from "./queries";
import { useEffect, useState } from "react";

function useSanityData<T>(query: string, params?: Record<string, unknown>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    client.fetch<T>(query, params || {}).then((result) => {
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [query, params ? JSON.stringify(params) : undefined]);

  return { data, loading };
}

export function useSiteSettings() {
  const { data, loading } = useSanityData(siteSettingsQuery);
  const [liveData] = useLiveQuery(data, siteSettingsQuery);
  return { data: liveData ?? data, loading };
}

export function useNavigation() {
  const { data, loading } = useSanityData(navigationQuery);
  const [liveData] = useLiveQuery(data, navigationQuery);
  return { data: liveData ?? data, loading };
}

export function useHeroSection() {
  const { data, loading } = useSanityData(heroSectionQuery);
  const [liveData] = useLiveQuery(data, heroSectionQuery);
  return { data: liveData ?? data, loading };
}

export function useMarqueeSection() {
  const { data, loading } = useSanityData(marqueeSectionQuery);
  const [liveData] = useLiveQuery(data, marqueeSectionQuery);
  return { data: liveData ?? data, loading };
}

export function useSkillsSection() {
  const { data, loading } = useSanityData(skillsSectionQuery);
  const [liveData] = useLiveQuery(data, skillsSectionQuery);
  return { data: liveData ?? data, loading };
}

export function useAboutSection() {
  const { data, loading } = useSanityData(aboutSectionQuery);
  const [liveData] = useLiveQuery(data, aboutSectionQuery);
  return { data: liveData ?? data, loading };
}

export function useContactSection() {
  const { data, loading } = useSanityData(contactSectionQuery);
  const [liveData] = useLiveQuery(data, contactSectionQuery);
  return { data: liveData ?? data, loading };
}

export function useFooterSettings() {
  const { data, loading } = useSanityData(footerSettingsQuery);
  const [liveData] = useLiveQuery(data, footerSettingsQuery);
  return { data: liveData ?? data, loading };
}

export function useCaseStudies() {
  const { data, loading } = useSanityData(caseStudiesQuery);
  const [liveData] = useLiveQuery(data, caseStudiesQuery);
  return { data: liveData ?? data, loading };
}

export function useCaseStudyBySlug(slug: string) {
  const { data, loading } = useSanityData(caseStudyBySlugQuery, { slug });
  const [liveData] = useLiveQuery(data, caseStudyBySlugQuery, { slug });
  return { data: liveData ?? data, loading };
}

export function useArchiveItems() {
  const { data, loading } = useSanityData(archiveItemsQuery);
  const [liveData] = useLiveQuery(data, archiveItemsQuery);
  return { data: liveData ?? data, loading };
}

export function useTimelineItems() {
  const { data, loading } = useSanityData(timelineItemsQuery);
  const [liveData] = useLiveQuery(data, timelineItemsQuery);
  return { data: liveData ?? data, loading };
}
