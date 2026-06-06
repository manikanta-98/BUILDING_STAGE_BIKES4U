import type { Bike } from "./types";
import { normalizeAdminImageUrl } from "./image-url";

export const PLACEHOLDER = "/placeholder.svg";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
).replace(/\/api\/?$/, "");

export function normalizeImageUrl(url: string): string {
  const u = url?.trim();
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) {
    return normalizeAdminImageUrl(u);
  }
  if (u.startsWith("/uploads/")) return `${API_BASE}${u}`;
  if (u.startsWith("Bikes/")) return `/${u}`;
  if (u.startsWith("/")) return u;
  return `/${u}`;
}

export function getPrimaryBikeImage(bike: Bike): string {
  const raw = bike.images?.[0];
  if (raw?.trim()) {
    return normalizeImageUrl(raw) || PLACEHOLDER;
  }
  const fallback = (bike.images || [])
    .map(normalizeImageUrl)
    .find((url) => url !== "");
  return fallback || PLACEHOLDER;
}

export function getBikeImages(bike: Bike): string[] {
  const valid = (bike.images || [])
    .map(normalizeImageUrl)
    .filter((url) => url !== "");
  return valid.length > 0 ? valid : [PLACEHOLDER];
}

export function statusLabel(status: Bike["status"]) {
  return status === "unsold" ? "Available" : "Sold";
}

export function isAvailable(status: Bike["status"]) {
  return status === "unsold";
}
