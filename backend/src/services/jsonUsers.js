import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersPath = path.resolve(__dirname, "../../data/users.json");

let usersCache = null;

function ensureDataDir() {
  const dir = path.dirname(usersPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function loadJsonUsers() {
  ensureDataDir();
  if (!fs.existsSync(usersPath)) {
    usersCache = [];
    persistJsonUsers();
    console.log("JSON users store created (0 users)");
    return usersCache;
  }
  usersCache = JSON.parse(fs.readFileSync(usersPath, "utf8"));
  console.log(`JSON users loaded (${usersCache.length} users)`);
  return usersCache;
}

function persistJsonUsers() {
  ensureDataDir();
  fs.writeFileSync(usersPath, JSON.stringify(usersCache, null, 2) + "\n", "utf8");
}

function resolveRole(email) {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (adminEmails.includes(email.toLowerCase())) return "admin";
  return "customer";
}

export function sanitizeJsonUser(user) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
  };
}

export function findJsonUserById(id) {
  if (!usersCache) loadJsonUsers();
  return usersCache.find((u) => u.id === id) || null;
}

export function findJsonUserByEmail(email) {
  if (!usersCache) loadJsonUsers();
  return usersCache.find((u) => u.email === email.toLowerCase()) || null;
}

export function findJsonUserByPhone(phone) {
  if (!usersCache) loadJsonUsers();
  const norm = phone.replace(/\D/g, "");
  return usersCache.find((u) => u.phone === norm) || null;
}

export async function createJsonUser({ name, phone, email, password }) {
  if (!usersCache) loadJsonUsers();

  const emailNorm = email.trim().toLowerCase();
  const phoneNorm = phone.replace(/\D/g, "");

  if (findJsonUserByEmail(emailNorm)) {
    const err = new Error("Email already registered");
    err.status = 409;
    throw err;
  }
  if (findJsonUserByPhone(phoneNorm)) {
    const err = new Error("Phone number already registered");
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: randomUUID(),
    name: name.trim(),
    phone: phoneNorm,
    email: emailNorm,
    password: hashed,
    role: resolveRole(emailNorm),
    createdAt: new Date().toISOString(),
  };
  usersCache.push(user);
  persistJsonUsers();
  return user;
}

export async function authenticateJsonUser(identifier, password) {
  if (!usersCache) loadJsonUsers();

  const id = identifier.trim();
  const isEmail = id.includes("@");
  const user = isEmail
    ? findJsonUserByEmail(id.toLowerCase())
    : findJsonUserByPhone(id);

  if (!user) {
    const err = new Error("Invalid email/phone or password");
    err.status = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error("Invalid email/phone or password");
    err.status = 401;
    throw err;
  }

  return user;
}
