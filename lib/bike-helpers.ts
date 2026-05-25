import type { Bike } from "./types";

const PLACEHOLDER = "/placeholder.svg";

export function getBikeImages(bike: Bike): string[] {
  const valid = (bike.images || []).filter((url) => url && url.trim() !== "");
  return valid.length > 0 ? valid : [PLACEHOLDER];
}

export function statusLabel(status: Bike["status"]) {
  return status === "unsold" ? "Available" : "Sold";
}

export function isAvailable(status: Bike["status"]) {
  return status === "unsold";
}
