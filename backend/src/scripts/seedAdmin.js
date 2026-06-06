/**
 * Create an admin user for local development.
 * Usage: node src/scripts/seedAdmin.js
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const name = process.env.SEED_ADMIN_NAME || "AK Bikes Admin";
const email = (process.env.SEED_ADMIN_EMAIL || "admin@akbikes.com").toLowerCase();
const phone = (process.env.SEED_ADMIN_PHONE || "9999999999").replace(/\D/g, "");
const password = process.env.SEED_ADMIN_PASSWORD || "admin123";

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = "admin";
    existing.password = await bcrypt.hash(password, 10);
    await existing.save();
    console.log(`Updated admin: ${email} / ${password}`);
  } else {
    await User.create({
      name,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
      role: "admin",
    });
    console.log(`Created admin: ${email} / ${password}`);
  }
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
