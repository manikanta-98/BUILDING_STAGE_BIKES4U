/**
 * Client-side image URL normalization (admin ImgBB / ibb.co links).
 */

export function convertIbbToDirect(url: string): string {
  const u = url.trim();
  if (!u) return "";

  // Already direct CDN
  if (/i\.ibb\.co/i.test(u)) return u;

  // Common mistake: ibb.co page without i. subdomain — cannot convert without server fetch
  // Backend resolveExternalImageUrl fixes these on save; keep URL for retry
  if (/^https?:\/\/(?:www\.)?ibb\.co\/[a-zA-Z0-9]+\/?$/i.test(u)) {
    return u;
  }

  return u;
}

export function normalizeAdminImageUrl(url: string): string {
  const u = url?.trim();
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) {
    return convertIbbToDirect(u);
  }
  return u;
}
