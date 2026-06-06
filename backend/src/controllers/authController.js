import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isUsingJsonFallback } from "../config/db.js";
import {
  authenticateJsonUser,
  createJsonUser,
  findJsonUserById,
  sanitizeJsonUser,
} from "../services/jsonUsers.js";

const SALT_ROUNDS = 10;

function signToken(user) {
  const id = user._id ? user._id.toString() : user.id;
  return jwt.sign(
    {
      id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function sanitizeUser(user) {
  if (user._id) {
    return {
      id: user._id.toString(),
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
    };
  }
  return sanitizeJsonUser(user);
}

function resolveRole(email) {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (adminEmails.includes(email.toLowerCase())) {
    return "admin";
  }
  return "customer";
}

export async function signup(req, res) {
  try {
    const { name, phone, email, password } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required" });
    }
    if (!phone?.trim()) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }
    const phoneNorm = phone.replace(/\D/g, "");
    if (phoneNorm.length !== 10) {
      return res.status(400).json({ success: false, message: "Enter a valid 10-digit phone number" });
    }
    if (!email?.trim()) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const emailNorm = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    if (isUsingJsonFallback()) {
      try {
        const user = await createJsonUser({
          name,
          phone: phoneNorm,
          email: emailNorm,
          password,
        });
        const token = signToken(user);
        return res.status(201).json({
          success: true,
          message: "Account created successfully",
          token,
          user: sanitizeJsonUser(user),
        });
      } catch (err) {
        return res
          .status(err.status || 500)
          .json({ success: false, message: err.message });
      }
    }

    const existing = await User.findOne({
      $or: [{ email: emailNorm }, { phone: phoneNorm }],
    });
    if (existing) {
      const field = existing.email === emailNorm ? "email" : "phone";
      return res.status(409).json({
        success: false,
        message: field === "email" ? "Email already registered" : "Phone number already registered",
      });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name: name.trim(),
      phone: phoneNorm,
      email: emailNorm,
      password: hashed,
      role: resolveRole(emailNorm),
    });

    const token = signToken(user);
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Could not create account" });
  }
}

export async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier?.trim()) {
      return res.status(400).json({ success: false, message: "Email or phone is required" });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    if (isUsingJsonFallback()) {
      try {
        const user = await authenticateJsonUser(identifier, password);
        const token = signToken(user);
        return res.json({
          success: true,
          message: "Login successful",
          token,
          user: sanitizeJsonUser(user),
        });
      } catch (err) {
        return res
          .status(err.status || 500)
          .json({ success: false, message: err.message });
      }
    }

    const id = identifier.trim();
    const isEmail = id.includes("@");
    const query = isEmail
      ? { email: id.toLowerCase() }
      : { phone: id.replace(/\D/g, "") };

    const user = await User.findOne(query).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email/phone or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid email/phone or password" });
    }

    const token = signToken(user);
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
}

export async function me(req, res) {
  try {
    if (isUsingJsonFallback()) {
      const user = findJsonUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      return res.json({ success: true, user: sanitizeJsonUser(user) });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Could not fetch profile" });
  }
}
