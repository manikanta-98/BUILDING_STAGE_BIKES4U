import jwt from "jsonwebtoken";

/** Legacy admin key OR JWT bearer with role=admin */
export function adminAuth(req, res, next) {
  const key = req.headers["x-admin-key"] || req.query.adminKey;
  if (process.env.ADMIN_KEY && key === process.env.ADMIN_KEY) {
    req.user = { role: "admin", via: "admin-key" };
    return next();
  }

  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
      if (decoded.role === "admin") {
        req.user = decoded;
        return next();
      }
    } catch {
      /* fall through */
    }
  }

  return res.status(401).json({ success: false, message: "Unauthorized admin access" });
}
