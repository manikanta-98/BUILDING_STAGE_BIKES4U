import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { enrichBike, enrichBikes } from "../utils/bikeImages.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.resolve(__dirname, "../../../bikes (1).json");

let bikesCache = null;

export function isJsonInventoryActive() {
  return bikesCache !== null;
}

export function loadJsonInventory() {
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Inventory file not found: ${jsonPath}`);
  }
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  bikesCache = enrichBikes(raw);
  console.log(`JSON inventory loaded (${bikesCache.length} bikes)`);
  return bikesCache;
}

function buildFilter(query) {
  return bikesCache.filter((bike) => {
    if (query.status && query.status !== "all" && bike.status !== query.status) {
      return false;
    }
    if (query.model && !bike.model?.toLowerCase().includes(query.model.toLowerCase())) {
      return false;
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      const hay = [bike.model, bike.number, bike.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(s)) return false;
    }
    if (query.year && query.year !== "all" && bike.year !== Number(query.year)) {
      return false;
    }
    if (query.priceRange && query.priceRange !== "all") {
      const [min, max] = query.priceRange.split("-").map(Number);
      if (bike.price == null) return false;
      if (!Number.isNaN(min) && bike.price < min) return false;
      if (max && !Number.isNaN(max) && bike.price > max) return false;
    }
    return true;
  });
}

function sortBikes(list, sort) {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0) || b.id - a.id);
    case "price-desc":
      return copy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0) || b.id - a.id);
    case "latest":
    default:
      return copy.sort((a, b) => b.id - a.id);
  }
}

export function queryBikes(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const requestedLimit = parseInt(query.limit, 10);
  const limit = Number.isNaN(requestedLimit)
    ? 12
    : Math.min(500, Math.max(1, requestedLimit));
  const skip = (page - 1) * limit;

  const filtered = sortBikes(buildFilter(query), query.sort);
  const total = filtered.length;
  const data = enrichBikes(filtered.slice(skip, skip + limit));

  const totalAll = bikesCache.length;
  const available = bikesCache.filter((b) => b.status === "unsold").length;
  const sold = bikesCache.filter((b) => b.status === "sold").length;

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
      hasMore: skip + data.length < total,
    },
    stats: { total: totalAll, available, sold },
  };
}

export function findBikeById(id) {
  const bike = bikesCache.find((b) => b.id === Number(id));
  return bike ? enrichBike(bike) : null;
}

function persistJsonInventory() {
  const raw = bikesCache.map((bike) => {
    const { _id, __v, createdAt, updatedAt, ...rest } = bike;
    return rest;
  });
  fs.writeFileSync(jsonPath, JSON.stringify(raw, null, 2) + "\n", "utf8");
}

export function createJsonBike(payload) {
  if (!bikesCache) loadJsonInventory();
  const existing = bikesCache.find(
    (b) =>
      b.id === payload.id ||
      (payload.number && b.number && b.number === payload.number)
  );
  if (existing) {
    const err = new Error("Bike with same id or number already exists");
    err.status = 409;
    throw err;
  }
  bikesCache.push(payload);
  persistJsonInventory();
  return enrichBike(payload);
}

export function updateJsonBike(id, payload) {
  if (!bikesCache) loadJsonInventory();
  const idx = bikesCache.findIndex((b) => b.id === Number(id));
  if (idx === -1) {
    const err = new Error("Bike not found");
    err.status = 404;
    throw err;
  }
  bikesCache[idx] = { ...bikesCache[idx], ...payload, id: Number(id) };
  persistJsonInventory();
  return enrichBike(bikesCache[idx]);
}

export function deleteJsonBike(id) {
  if (!bikesCache) loadJsonInventory();
  const idx = bikesCache.findIndex((b) => b.id === Number(id));
  if (idx === -1) {
    const err = new Error("Bike not found");
    err.status = 404;
    throw err;
  }
  bikesCache.splice(idx, 1);
  persistJsonInventory();
  return true;
}

export function updateJsonBikeStatus(id, status) {
  return updateJsonBike(id, { status });
}
