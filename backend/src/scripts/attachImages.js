import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.resolve(__dirname, "../../../bikes (1).json");
const bikesDir = path.resolve(__dirname, "../../../public/Bikes");

function normalizeNumber(value) {
  if (!value || typeof value !== "string") return null;
  return value.trim().toUpperCase();
}

function collectImageFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`No folder at public/Bikes — create it and add photos named REG-1.jpg`);
    return new Map();
  }

  const map = new Map();
  const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  for (const file of files) {
    const match = file.match(/^(.+)-(\d+)\.(jpe?g|png|webp)$/i);
    if (!match) continue;
    const reg = normalizeNumber(match[1]);
    const index = Number(match[2]);
    if (!reg || Number.isNaN(index)) continue;
    if (!map.has(reg)) map.set(reg, []);
    map.get(reg).push({ index, path: `/Bikes/${file}` });
  }

  for (const [reg, items] of map) {
    items.sort((a, b) => a.index - b.index);
    map.set(
      reg,
      items.map((i) => i.path)
    );
  }

  return map;
}

function padImages(urls) {
  const out = [...urls.slice(0, 4)];
  while (out.length < 4) out.push("");
  return out;
}

const imageMap = collectImageFiles(bikesDir);
const bikes = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

let matched = 0;
const updated = bikes.map((bike) => {
  const key = normalizeNumber(bike.number);
  const found = key && imageMap.has(key) ? imageMap.get(key) : [];
  const existing = (bike.images || []).filter((u) => String(u).trim() !== "");
  if (found.length > 0) {
    matched++;
    return { ...bike, images: padImages(found) };
  }
  // Keep admin-pasted URLs; don't wipe when no local file match
  if (existing.length > 0) {
    return { ...bike, images: padImages(existing) };
  }
  return { ...bike, images: ["", "", "", ""] };
});

fs.writeFileSync(jsonPath, JSON.stringify(updated, null, 2) + "\n", "utf8");
console.log(`Updated ${updated.length} bikes. ${matched} matched with photos in public/Bikes.`);
