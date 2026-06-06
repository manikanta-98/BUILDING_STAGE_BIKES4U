import { Router } from "express";
import { signup, login, me } from "../controllers/authController.js";
import { jwtAuth } from "../middleware/jwtAuth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", jwtAuth, me);

export default router;
