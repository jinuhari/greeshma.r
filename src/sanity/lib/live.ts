import { defineLive } from "@sanity/preview-kit";
import { client, previewClient } from "./client";

export const { sanityClient, useLiveMode } = defineLive({
  client,
  serverClient: previewClient,
  stega: {
    studioUrl: "/studio",
  },
});
