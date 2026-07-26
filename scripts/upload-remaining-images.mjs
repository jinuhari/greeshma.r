import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, "..", "src", "assets");

const client = createClient({
  projectId: "x5ya31xa",
  dataset: "production",
  apiVersion: "2026-07-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const files = [
  { file: "portrait.jpg", patch: { id: "aboutSection", field: "image" } },
  { file: "archive-1.jpg", patch: { id: "archiveItem-kalighat-revisited", field: "image" } },
  { file: "archive-2.jpg", patch: { id: "archiveItem-an-aw", field: "image" } },
  { file: "archive-3.jpg", patch: { id: "archiveItem-rosa-damascena", field: "image" } },
  { file: "archive-4.jpg", patch: { id: "archiveItem-artisan-tea", field: "image" } },
  { file: "archive-5.jpg", patch: { id: "archiveItem-bengaluru-0714", field: "image" } },
  { file: "archive-6.jpg", patch: { id: "archiveItem-kalamkari-matrix", field: "image" } },
];

async function run() {
  for (const { file, patch } of files) {
    try {
      const buffer = readFileSync(join(assetsDir, file));
      const asset = await client.assets.upload("image", buffer, { filename: file });
      console.log(`Uploaded ${file} → ${asset._id}`);
      await client.patch(patch.id).set({
        [patch.field]: { _type: "image", asset: { _ref: asset._id } },
      }).commit();
      console.log(`  Linked to ${patch.id}.${patch.field}`);
    } catch (err) {
      console.error(`Failed for ${file}:`, err.message);
    }
  }
  console.log("Done!");
}

run().catch(console.error);
