import Bike from "../models/Bike.js";
import { isUsingJsonFallback } from "../config/db.js";
import {
  queryBikes as queryJsonBikes,
  findBikeById as findJsonBikeById,
  createJsonBike,
  updateJsonBike,
  deleteJsonBike,
  updateJsonBikeStatus,
} from "../services/jsonInventory.js";
import { enrichBike, enrichBikes } from "../utils/bikeImages.js";
import { normalizeImageUrls } from "../utils/imageUrls.js";

function buildFilter(query) {
  const filter = {};

  if (query.status && query.status !== "all") {
    filter.status = query.status;
  }

  if (query.model) {
    filter.model = { $regex: query.model, $options: "i" };
  }

  if (query.search) {
    filter.$or = [
      { model: { $regex: query.search, $options: "i" } },
      { number: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.year && query.year !== "all") {
    filter.year = Number(query.year);
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.priceRange && query.priceRange !== "all") {
    const [min, max] = query.priceRange.split("-").map(Number);
    filter.price = {};
    if (!Number.isNaN(min)) filter.price.$gte = min;
    if (max && !Number.isNaN(max)) filter.price.$lte = max;
  }

  return filter;
}

function buildSort(sort) {
  switch (sort) {
    case "price-asc":
      return { price: 1, id: -1 };
    case "price-desc":
      return { price: -1, id: -1 };
    case "latest":
    default:
      return { createdAt: -1, id: -1 };
  }
}

export async function getBikes(req, res, next) {
  try {
    if (isUsingJsonFallback()) {
      const result = queryJsonBikes(req.query);
      return res.json({ success: true, ...result });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const requestedLimit = parseInt(req.query.limit, 10);
    // Public catalog: default 12, max 50. Admin/list views can request up to 500.
    const limit = Number.isNaN(requestedLimit)
      ? 12
      : Math.min(500, Math.max(1, requestedLimit));
    const skip = (page - 1) * limit;

    const filter = buildFilter(req.query);
    const sort = buildSort(req.query.sort);

    const [bikes, total] = await Promise.all([
      Bike.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Bike.countDocuments(filter),
    ]);

    const [totalAll, available, sold] = await Promise.all([
      Bike.countDocuments(),
      Bike.countDocuments({ status: "unsold" }),
      Bike.countDocuments({ status: "sold" }),
    ]);

    res.json({
      success: true,
      data: enrichBikes(bikes),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
        hasMore: skip + bikes.length < total,
      },
      stats: { total: totalAll, available, sold },
    });
  } catch (err) {
    next(err);
  }
}

export async function getBikeById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isUsingJsonFallback()) {
      const bike = findJsonBikeById(id);
      if (!bike) {
        return res.status(404).json({ success: false, message: "Bike not found" });
      }
      return res.json({ success: true, data: bike });
    }
    const bike = await Bike.findOne({ id }).lean();
    if (!bike) {
      return res.status(404).json({ success: false, message: "Bike not found" });
    }
    res.json({ success: true, data: enrichBike(bike) });
  } catch (err) {
    next(err);
  }
}

export async function createBike(req, res, next) {
  try {
    const payload = await normalizePayloadAsync(req.body);
    if (isUsingJsonFallback()) {
      try {
        const bike = createJsonBike(payload);
        return res.status(201).json({ success: true, data: bike });
      } catch (err) {
        return res
          .status(err.status || 500)
          .json({ success: false, message: err.message });
      }
    }
    const existing = await Bike.findOne({
      $or: [{ id: payload.id }, ...(payload.number ? [{ number: payload.number }] : [])],
    });
    if (existing) {
      return res.status(409).json({ success: false, message: "Bike with same id or number already exists" });
    }
    const bike = await Bike.create(payload);
    res.status(201).json({ success: true, data: enrichBike(bike.toObject()) });
  } catch (err) {
    next(err);
  }
}

export async function updateBike(req, res, next) {
  try {
    const id = Number(req.params.id);
    const payload = await normalizePayloadAsync(req.body, { partial: true });
    if (isUsingJsonFallback()) {
      try {
        const bike = updateJsonBike(id, payload);
        return res.json({ success: true, data: bike });
      } catch (err) {
        return res
          .status(err.status || 500)
          .json({ success: false, message: err.message });
      }
    }
    const bike = await Bike.findOneAndUpdate({ id }, payload, {
      new: true,
      runValidators: true,
    });
    if (!bike) {
      return res.status(404).json({ success: false, message: "Bike not found" });
    }
    res.json({ success: true, data: enrichBike(bike.toObject()) });
  } catch (err) {
    next(err);
  }
}

export async function deleteBike(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isUsingJsonFallback()) {
      try {
        deleteJsonBike(id);
        return res.json({ success: true, message: "Bike deleted" });
      } catch (err) {
        return res
          .status(err.status || 500)
          .json({ success: false, message: err.message });
      }
    }
    const bike = await Bike.findOneAndDelete({ id });
    if (!bike) {
      return res.status(404).json({ success: false, message: "Bike not found" });
    }
    res.json({ success: true, message: "Bike deleted" });
  } catch (err) {
    next(err);
  }
}

export async function updateBikeStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!["unsold", "sold"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be unsold or sold" });
    }
    if (isUsingJsonFallback()) {
      try {
        const bike = updateJsonBikeStatus(id, status);
        return res.json({ success: true, data: bike });
      } catch (err) {
        return res
          .status(err.status || 500)
          .json({ success: false, message: err.message });
      }
    }
    const bike = await Bike.findOneAndUpdate({ id }, { status }, { new: true });
    if (!bike) {
      return res.status(404).json({ success: false, message: "Bike not found" });
    }
    res.json({ success: true, data: enrichBike(bike.toObject()) });
  } catch (err) {
    next(err);
  }
}

async function normalizePayloadAsync(body, { partial = false } = {}) {
  const out = normalizePayload(body, { partial });
  if (out.images !== undefined && Array.isArray(out.images)) {
    out.images = await normalizeImageUrls(out.images);
  }
  return out;
}

function normalizePayload(body, { partial = false } = {}) {
  const out = {};
  const fields = ["id", "model", "year", "number", "price", "status", "description", "images"];
  for (const key of fields) {
    if (body[key] !== undefined || !partial) {
      if (body[key] !== undefined) {
        out[key] = body[key];
      }
    }
  }
  if (out.id !== undefined) out.id = Number(out.id);
  if (out.year !== undefined) out.year = out.year === null || out.year === "" ? null : Number(out.year);
  if (out.price !== undefined) out.price = out.price === null || out.price === "" ? null : Number(out.price);
  if (out.number !== undefined) out.number = out.number || null;
  if (out.images !== undefined && !Array.isArray(out.images)) {
    out.images = ["", "", "", ""];
  }
  if (!partial && !out.images) out.images = ["", "", "", ""];
  if (!partial && !out.status) out.status = "unsold";
  return out;
}
