import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { isExternalUrl, normalizeExternalImageUrl } from "./imageUrls.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.resolve(__dirname, "../../../public");

function normalizeNumber(value) {
  if (!value || typeof value !== "string") return null;
  return value.trim().toUpperCase();
}

export function publicPathExists(webPath) {
  if (!webPath || typeof webPath !== "string") return false;
  if (isExternalUrl(webPath)) return true;
  const rel = webPath.replace(/^\//, "").replace(/\\/g, "/");
  const disk = path.join(publicRoot, ...rel.split("/"));
  return fs.existsSync(disk);
}

function padImages(urls) {
  const out = [...urls.slice(0, 4)];
  while (out.length < 4) out.push("");
  return out;
}

/**
 * Keep admin-pasted https URLs. Only use local /Bikes/ fallback when no URLs set.
 */
export function resolveBikeImages(bike) {
  const raw = (bike.images || [])
    .map((u) => String(u).trim())
    .filter((u) => u !== "");

  const external = raw
    .filter(isExternalUrl)
    .map(normalizeExternalImageUrl)
    .filter(Boolean);

  if (external.length > 0) {
    return padImages(external);
  }

  const local = raw.filter((u) => !isExternalUrl(u));
  if (local.length > 0) {
    return padImages(local);
  }

  return ["", "", "", ""];
}

export function enrichBike(bike) {
  return { ...bike, images: resolveBikeImages(bike) };
}

export function enrichBikes(bikes) {
  return bikes.map(enrichBike);
}
