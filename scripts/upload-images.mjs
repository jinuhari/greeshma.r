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

const imageMap = {
  "hero-artwork.jpg": "heroSection",
  "work-udaan.jpg": "caseStudy-udaan",
  "work-tomodachi.jpg": "caseStudy-tomodachi",
  "work-qualin.jpg": "caseStudy-qualin",
  "work-research.jpg": "caseStudy-weaving-voices",
};

async function uploadImages() {
  const assets = await client.fetch(`*[_type == "sanity.imageAsset"]`);
  console.log(`Already have ${assets.length} image assets`);

  for (const [filename, docId] of Object.entries(imageMap)) {
    try {
      const filePath = join(assetsDir, filename);
      const buffer = readFileSync(filePath);
      const asset = await client.assets.upload("image", buffer, { filename });
      console.log(`Uploaded ${filename} → ${asset._id}`);

      await client.patch(docId).set({
        coverImage: { _type: "image", asset: { _ref: asset._id } },
      }).commit();
      console.log(`  Linked to ${docId}.coverImage`);
    } catch (err) {
      console.error(`Failed to upload ${filename}:`, err.message);
    }
  }

  console.log("Done!");
}

uploadImages().catch(console.error);
