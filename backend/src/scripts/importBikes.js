import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Bike from "../models/Bike.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const jsonPath = path.resolve(__dirname, "../../../bikes (1).json");

async function importBikes() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");

  await mongoose.connect(uri);
  const bikes = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  let synced = 0;
  let skipped = 0;

  for (const row of bikes) {
    if (row.number) {
      const conflict = await Bike.findOne({
        number: row.number,
        id: { $ne: row.id },
      });
      if (conflict) {
        console.warn(
          `Skip id ${row.id}: number "${row.number}" already used by id ${conflict.id}`
        );
        skipped++;
        continue;
      }
    }

    await Bike.findOneAndUpdate(
      { id: row.id },
      {
        id: row.id,
        model: row.model,
        year: row.year ?? null,
        number: row.number ?? null,
        price: row.price ?? null,
        status: row.status || "unsold",
        description: row.description || "",
        images: row.images || ["", "", "", ""],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    synced++;
  }

  const total = await Bike.countDocuments();
  console.log(`Import complete: ${synced} synced, ${skipped} skipped, ${total} total in DB`);
  await mongoose.disconnect();
}

importBikes().catch((err) => {
  console.error(err);
  process.exit(1);
});
