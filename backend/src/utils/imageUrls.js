/**
 * Normalize admin-pasted image URLs (ImgBB / ibb.co page links → direct i.ibb.co).
 */

function padImages(urls) {
  const out = [...urls.slice(0, 4)];
  while (out.length < 4) out.push("");
  return out;
}

/** Sync cleanup — does not fetch remote pages */
export function normalizeExternalImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  let u = url.trim();
  if (!u) return "";

  // Already a direct ImgBB CDN link
  if (/i\.ibb\.co/i.test(u)) return u;

  // ibb.co short page URL (not direct) — flag for async resolve on save
  if (/^https?:\/\/(?:www\.)?ibb\.co\/[a-zA-Z0-9]+\/?$/i.test(u)) {
    return u;
  }

  // imgbb.com page (not direct)
  if (/^https?:\/\/(?:www\.)?imgbb\.com\//i.test(u) && !/i\.ibb\.co/i.test(u)) {
    return u;
  }

  return u;
}

export function isExternalUrl(url) {
  return /^https?:\/\//i.test(String(url || "").trim());
}

/** Fetch ibb.co / imgbb page and extract og:image (direct i.ibb.co link) */
export async function resolveExternalImageUrl(url) {
  const u = normalizeExternalImageUrl(url);
  if (!u || !isExternalUrl(u)) return u;
  if (/i\.ibb\.co/i.test(u)) return u;

  const needsResolve =
    /ibb\.co/i.test(u) || /imgbb\.com/i.test(u);

  if (!needsResolve) return u;

  try {
    const res = await fetch(u, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();

    const og =
      html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
      html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/i);
    if (og?.[1] && /i\.ibb\.co/i.test(og[1])) {
      return og[1].replace(/&amp;/g, "&");
    }

    const direct = html.match(
      /https?:\/\/i\.ibb\.co\/[a-zA-Z0-9./_%-]+\.(?:jpe?g|png|webp|gif)/i
    );
    if (direct?.[0]) return direct[0];
  } catch (err) {
    console.warn("Could not resolve image URL:", u, err.message);
  }

  return u;
}

export async function normalizeImageUrls(images) {
  const list = Array.isArray(images) ? images : [];
  const resolved = [];
  for (const raw of list) {
    const trimmed = String(raw || "").trim();
    if (!trimmed) {
      resolved.push("");
      continue;
    }
    if (isExternalUrl(trimmed)) {
      resolved.push(await resolveExternalImageUrl(trimmed));
    } else {
      resolved.push(trimmed);
    }
  }
  return padImages(resolved);
}
