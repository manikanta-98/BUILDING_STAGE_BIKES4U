import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sellDir = path.resolve(__dirname, "../../uploads/sell");

if (!fs.existsSync(sellDir)) {
  fs.mkdirSync(sellDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, sellDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, cb) => {
    const allowedExt = /\.(jpe?g|png|webp)$/i;
    const allowedMime = /^image\/(jpeg|jpg|png|webp)$/i;
    if (allowedExt.test(file.originalname) || allowedMime.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG, and WEBP images are allowed"));
    }
  },
});

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "Sell API ready" });
});

router.post("/upload", (req, res) => {
  upload.array("photos", 8)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    const base =
      process.env.PUBLIC_API_BASE ||
      `${req.protocol}://${req.get("host")}`;

    const urls = (req.files || []).map(
      (f) => `${base}/uploads/sell/${f.filename}`
    );

    res.json({ success: true, urls });
  });
});

export default router;
