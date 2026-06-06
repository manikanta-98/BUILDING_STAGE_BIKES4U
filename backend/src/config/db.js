import mongoose from "mongoose";
import { loadJsonInventory } from "../services/jsonInventory.js";
import { loadJsonUsers } from "../services/jsonUsers.js";

let usingJsonFallback = false;

export function isUsingJsonFallback() {
  return usingJsonFallback;
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment");
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected");
    usingJsonFallback = false;
    return;
  } catch (err) {
    const allowFallback = process.env.ALLOW_JSON_FALLBACK !== "false";
    if (!allowFallback) {
      throw err;
    }
    console.warn(`MongoDB unavailable (${err.message})`);
    loadJsonInventory();
    loadJsonUsers();
    usingJsonFallback = true;
    console.log("Using JSON inventory fallback (set ALLOW_JSON_FALLBACK=false to require MongoDB)");
  }
}
