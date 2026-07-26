import { createClient } from "@sanity/client";
import { projectId, dataset, apiVersion, studioUrl } from "../env";

const token = import.meta.env.VITE_SANITY_TOKEN;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token,
});

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "previewDrafts",
  token,
  stega: {
    enabled: true,
    studioUrl,
  },
});
