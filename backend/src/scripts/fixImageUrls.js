/**
 * Fix ibb.co page links → direct i.ibb.co URLs for all bikes in MongoDB.
 * Usage: node src/scripts/fixImageUrls.js
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Bike from "../models/Bike.js";
import { normalizeImageUrls } from "../utils/imageUrls.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const bikes = await Bike.find({});
  let updated = 0;

  for (const bike of bikes) {
    const before = JSON.stringify(bike.images || []);
    const images = await normalizeImageUrls(bike.images || []);
    const after = JSON.stringify(images);
    if (before !== after) {
      bike.images = images;
      await bike.save();
      updated++;
      console.log(`id ${bike.id} ${bike.model}:`, images.filter(Boolean).join(", "));
    }
  }

  console.log(`Done. Updated ${updated} / ${bikes.length} bikes.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
