import { createClient } from "@sanity/client";
import { projectId, dataset, apiVersion, useCdn } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
});

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "previewDrafts",
  stega: {
    enabled: true,
    studioUrl: "/studio",
  },
});
